//app/api/send-email/route.ts
import { NextResponse } from "next/server";
import connect from "@/db";
import FormSubmission from "@/modal/FormSubmission";
import { sendEmail } from "@/utils/emailConfig";
import { randomUUID } from "crypto";
import * as XLSX from "xlsx";
import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

// ---------------------------
// Get file extension from MIME
// ---------------------------
function getExtensionFromMime(mime: string): string {
  const map: Record<string, string> = {
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "doc",
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  };
  return map[mime] || mime.split("/")[1] || "bin";
}

// ---------------------------
// Get Microsoft Graph client
// ---------------------------
async function getGraphClient() {
  const tokenResponse = await fetch(
    `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.AZURE_CLIENT_ID!,
        client_secret: process.env.AZURE_CLIENT_SECRET!,
        grant_type: "client_credentials",
        scope: "https://graph.microsoft.com/.default",
      }),
    }
  );

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    throw new Error("Failed to get access token from Azure");
  }

  return Client.init({
    authProvider: (done) => {
      done(null, tokenData.access_token);
    },
  });
}

// ---------------------------
// Resolve ONEDRIVE_LINK → driveId + folderId
// ---------------------------
async function resolveSharedFolder(client: Client) {
  if (!process.env.ONEDRIVE_LINK) {
    throw new Error("ONEDRIVE_LINK is not set in environment");
  }

  const base64Url = Buffer.from(process.env.ONEDRIVE_LINK)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const shareId = `u!${base64Url}`;

  const sharedItem = await client.api(`/shares/${shareId}/driveItem`).get();

  return {
    driveId: sharedItem.parentReference.driveId,
    folderId: sharedItem.id,
  };
}

// ---------------------------
// Upload file to shared OneDrive folder
// ---------------------------
async function uploadUserFilesToOneDrive(buffer: Buffer, filename: string, subFolder?: string) {
  const client = await getGraphClient();
  const { driveId, folderId } = await resolveSharedFolder(client);

  let targetFolderId = folderId;

  if (subFolder) {
    try {
      const folder = await client
        .api(`/drives/${driveId}/items/${folderId}/children/${subFolder}`)
        .get();
      targetFolderId = folder.id;
    } catch {
      const folder = await client.api(`/drives/${driveId}/items/${folderId}/children`).post({
        name: subFolder,
        folder: {},
        "@microsoft.graph.conflictBehavior": "rename",
      });
      targetFolderId = folder.id;
    }
  }

  const uploadRes = await client
    .api(`/drives/${driveId}/items/${targetFolderId}:/${filename}:/content`)
    .put(buffer);

  return { link: uploadRes.webUrl, id: uploadRes.id };
}

// ---------------------------
// Handle form submission
// ---------------------------
export async function POST(req: Request) {
  try {
    const body: Record<string, any> = await req.json();
    await connect();

    const publicId = randomUUID();

    // Clean body → replace base64 with marker
    const cleanedBody: Record<string, any> = { ...body };
    for (const key in cleanedBody) {
      if (typeof cleanedBody[key] === "string" && cleanedBody[key].startsWith("data:")) {
        cleanedBody[key] = "[Uploaded File]";
      }
    }

    const savedSubmission = await FormSubmission.create({
      data: cleanedBody,
      publicId,
    });

    const firstName = body.firstName || "user";
    const safefirstName = firstName.replace(/[^a-z0-9]/gi, "_");

// Build Excel Workbook
// ---------------------------
const mainData = Object.entries(cleanedBody)
  .filter(([key]) => !key.toLowerCase().includes("dependent") && !key.toLowerCase().includes("school") && !key.toLowerCase().includes("professional") && !key.toLowerCase().includes("employmentHistory") && !key.toLowerCase().includes("previousEmployers"))
  .map(([key, value]) => ({ Field: key, Value: value }));

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(mainData), "Main Data");

// ---------------------------
// dependent sheet
// ---------------------------
const dependentEntries = Object.entries(body).filter(([key]) =>
  key.toLowerCase().startsWith("dependent")
);

let dependent: any[] = [];
if (dependentEntries.length > 0) {
  dependent = dependentEntries.map(([key, val]) => {
    if (typeof val === "object" && val !== null) {
      return { Dependent: key, ...val };
    }
    return { Dependent: key, Value: val }; // fallback for string/other
  });
}
if (dependent.length === 0) {
  dependent.push({ Director: "No dependent submitted" });
}
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dependent), "Dependent");

// ---------------------------
// school sheet
// ---------------------------
const schoolEntries = Object.entries(body).filter(([key]) =>
  key.toLowerCase().startsWith("school")
);
let school: any[] = [];
if (schoolEntries.length > 0) {
  school = schoolEntries.map(([key, val]) => {
    if (typeof val === "object" && val !== null) {
      return { School: key, ...val };
    }
    return { School: key, Value: val }; // fallback for string/other
  });
}
if (school.length === 0) {
  school.push({ School: "No schools submitted" });
}
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(school), "Schools");

// ---------------------------
// professional sheet
// ---------------------------
const professionalEntries = Object.entries(body).filter(([key]) =>
  key.toLowerCase().startsWith("professional")
);
let professional: any[] = [];
if (professionalEntries.length > 0) {
  professional = professionalEntries.map(([key, val]) => {
    if (typeof val === "object" && val !== null) {
      return { Professional: key, ...val };
    }
    return { Professional: key, Value: val }; // fallback for string/other
  });
}
if (professional.length === 0) {
  professional.push({ Professional: "No professional submitted" });
}
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(professional), "professional");

// ---------------------------
// employment history sheet
// ---------------------------
const employmentHistoryEntries = Object.entries(body).filter(([key]) =>
  key.toLowerCase().startsWith("employmentHistory")
);
let employmentHistory: any[] = [];
if (employmentHistoryEntries.length > 0) {
  employmentHistory = employmentHistoryEntries.map(([key, val]) => {
    if (typeof val === "object" && val !== null) {
      return { EmploymentHistory: key, ...val };
    }
    return { EmploymentHistory: key, Value: val }; // fallback for string/other
  });
}
if (employmentHistory.length === 0) {
  employmentHistory.push({ EmploymentHistory: "No employmentHistory submitted" });
}
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(employmentHistory), "employmentHistories");

// ---------------------------
// previous employers sheet
// ---------------------------
const previousEmployersEntries = Object.entries(body).filter(([key]) =>
  key.toLowerCase().startsWith("previousEmployers")
);
let previousEmployers: any[] = [];
if (previousEmployersEntries.length > 0) {
  previousEmployers = previousEmployersEntries.map(([key, val]) => {
    if (typeof val === "object" && val !== null) {
      return { PreviousEmployers: key, ...val };
    }
    return { PreviousEmployers: key, Value: val }; // fallback for string/other
  });
}
if (previousEmployers.length === 0) {
  previousEmployers.push({ Signatory: "No previousEmployers submitted" });
}
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(previousEmployers), "previousEmployers");

// ---------------------------
const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });


    // Upload Excel
    const { link } = await uploadUserFilesToOneDrive(
      excelBuffer,
      `${safefirstName}_submission.xlsx`,
      safefirstName
    );

     // NEW: Upload PDF if exists
    let pdfLink = "";
    if (body.formPDF && body.formPDF.startsWith("data:application/pdf")) {
      const pdfMatches = body.formPDF.match(/^data:(.+);base64,(.+)$/);
      if (pdfMatches) {
        const pdfBase64 = pdfMatches[2];
        const pdfBuffer = Buffer.from(pdfBase64, "base64");
        const { link } = await uploadUserFilesToOneDrive(
          pdfBuffer,
          `${safefirstName}_form.pdf`,
          safefirstName
        );
        pdfLink = link;
      }
    }

    // Upload file attachments
    const uploadPromises = Object.entries(body)
      .filter(([_, value]) => typeof value === "string" && value.startsWith("data:"))
      .map(async ([key, value]) => {
        const matches = (value as string).match(/^data:(.+);base64,(.+)$/);
        if (!matches) return;

        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");
        const extension = getExtensionFromMime(mimeType); // ✅ using helper

        await uploadUserFilesToOneDrive(buffer, `${key}.${extension}`, safefirstName);
      });

    await Promise.all(uploadPromises);

    // ---------------------------
    // Send Email
    // ---------------------------
    const adminHtml = `
      <h2>New Form Submission</h2>
      <ul>
        <li>Uploaded File: <a href="${link}">${link}</a></li>
        ${pdfLink ? `<li>Form PDF: <a href="${pdfLink}">${pdfLink}</a></li>` : ''}
      </ul>
    `;
   await sendEmail(
  process.env.ADMIN_EMAIL!,
  "New Form Submission",
  adminHtml
);

    if (body.email) {
      const userHtml = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f16024;padding:20px 0;font-family:Arial,sans-serif;border:1px border-color:#d7d8e1">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;">
        <tr>
          <td style="background:#f16024;color:#ffffff;padding:30px;font-size:25px;font-weight:bold;text-align:center;">
            SOHCAHTOA
          </td>
        </tr>
        <tr>
          <td style="padding:30px;color:#333333;font-size:16px;line-height:1.6;">
            <p style="margin:0 0 16px 0;">Hi ${safefirstName},</p>
            <p style="margin:0 0 16px 0;">
              Thank you for your submission. Your files have been recorded.
            </p>
            <div style="background-color:#f4b192; display:flex; justify-content: center;align-items: center;padding:10px border-radius:10px;">
            <p style="margin:0; color:#c16c45;">
              for inquiry on our services, please contact us directly at
              <a href="mailto:support@sohcahtoa.com" style="color:#f26522;">support@sohcahtoa.com</a>.
            </p> </div>
          </td>
        </tr>
        <tr>
          <td style="background:#f3f3fe;border-top:1px;border-color:#d7d8e1;padding:15px;text-align:center;font-size:12px;color:#2c3345;">
            © ${new Date().getFullYear()} SohCahToa. All rights reserved.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;

       await sendEmail(
  body.email,
  "Your message has been sent to SOHCAHTOA HR team",
  userHtml
);
    }

    return NextResponse.json(
      { success: true, id: savedSubmission._id, publicId },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error in /api/send-email:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
