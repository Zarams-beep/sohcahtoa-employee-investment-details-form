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
// Uses AZURE_CLIENT_SECRET_MAIN (renamed from AZURE_CLIENT_SECRET)
// ---------------------------
async function getGraphClient() {
  const tokenResponse = await fetch(
    `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.AZURE_CLIENT_ID!,
        client_secret: process.env.AZURE_CLIENT_SECRET_MAIN!, // ✅ updated secret name
        grant_type: "client_credentials",
        scope: "https://graph.microsoft.com/.default",
      }),
    }
  );

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    throw new Error(
      `Failed to get access token from Azure: ${JSON.stringify(tokenData)}`
    );
  }

  return Client.init({
    authProvider: (done) => {
      done(null, tokenData.access_token);
    },
  });
}

// ---------------------------
// Upload file directly using ONEDRIVE_DRIVE_ID + ONEDRIVE_FOLDER_ID
// No shared link needed — only HR can see the folder
// ---------------------------
async function uploadUserFilesToOneDrive(
  buffer: Buffer,
  filename: string,
  subFolder?: string
) {
  const client = await getGraphClient();

  const driveId = process.env.ONEDRIVE_DRIVE_ID!;
  const folderId = process.env.ONEDRIVE_FOLDER_ID!;

  if (!driveId || !folderId) {
    throw new Error(
      "ONEDRIVE_DRIVE_ID or ONEDRIVE_FOLDER_ID is not set in environment variables"
    );
  }

  let targetFolderId = folderId;

  // Create or find subfolder (named after the employee)
  if (subFolder) {
    try {
      // Try to find existing subfolder by listing children and filtering
      const existingFolders = await client
        .api(`/drives/${driveId}/items/${folderId}/children`)
        .filter(`name eq '${subFolder}'`)
        .get();

      if (existingFolders.value && existingFolders.value.length > 0) {
        targetFolderId = existingFolders.value[0].id;
      } else {
        // Create the subfolder since it doesn't exist
        const newFolder = await client
          .api(`/drives/${driveId}/items/${folderId}/children`)
          .post({
            name: subFolder,
            folder: {},
            "@microsoft.graph.conflictBehavior": "rename",
          });
        targetFolderId = newFolder.id;
      }
    } catch {
      // Fallback: create the subfolder
      const newFolder = await client
        .api(`/drives/${driveId}/items/${folderId}/children`)
        .post({
          name: subFolder,
          folder: {},
          "@microsoft.graph.conflictBehavior": "rename",
        });
      targetFolderId = newFolder.id;
    }
  }

  // Upload the file into the target folder
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
      if (
        typeof cleanedBody[key] === "string" &&
        cleanedBody[key].startsWith("data:")
      ) {
        cleanedBody[key] = "[Uploaded File]";
      }
    }

    const savedSubmission = await FormSubmission.create({
      data: cleanedBody,
      publicId,
    });

    const firstName = body.firstName || "user";
    const safefirstName = firstName.replace(/[^a-z0-9]/gi, "_");

    // ---------------------------
    // Build Excel Workbook
    // ---------------------------
    const mainData = Object.entries(cleanedBody)
      .filter(
        ([key]) =>
          !key.toLowerCase().includes("dependent") &&
          !key.toLowerCase().includes("school") &&
          !key.toLowerCase().includes("professional") &&
          !key.toLowerCase().includes("employmentHistory") &&
          !key.toLowerCase().includes("previousEmployers")
      )
      .map(([key, value]) => ({ Field: key, Value: value }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(mainData), "Main Data");

    // Dependent sheet
    const dependentEntries = Object.entries(body).filter(([key]) =>
      key.toLowerCase().startsWith("dependent")
    );
    const dependent: any[] =
      dependentEntries.length > 0
        ? dependentEntries.map(([key, val]) =>
            typeof val === "object" && val !== null
              ? { Dependent: key, ...val }
              : { Dependent: key, Value: val }
          )
        : [{ Director: "No dependent submitted" }];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dependent), "Dependent");

    // School sheet
    const schoolEntries = Object.entries(body).filter(([key]) =>
      key.toLowerCase().startsWith("school")
    );
    const school: any[] =
      schoolEntries.length > 0
        ? schoolEntries.map(([key, val]) =>
            typeof val === "object" && val !== null
              ? { School: key, ...val }
              : { School: key, Value: val }
          )
        : [{ School: "No schools submitted" }];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(school), "Schools");

    // Professional sheet
    const professionalEntries = Object.entries(body).filter(([key]) =>
      key.toLowerCase().startsWith("professional")
    );
    const professional: any[] =
      professionalEntries.length > 0
        ? professionalEntries.map(([key, val]) =>
            typeof val === "object" && val !== null
              ? { Professional: key, ...val }
              : { Professional: key, Value: val }
          )
        : [{ Professional: "No professional submitted" }];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(professional), "professional");

    // Employment history sheet
    const employmentHistoryEntries = Object.entries(body).filter(([key]) =>
      key.toLowerCase().startsWith("employmentHistory")
    );
    const employmentHistory: any[] =
      employmentHistoryEntries.length > 0
        ? employmentHistoryEntries.map(([key, val]) =>
            typeof val === "object" && val !== null
              ? { EmploymentHistory: key, ...val }
              : { EmploymentHistory: key, Value: val }
          )
        : [{ EmploymentHistory: "No employmentHistory submitted" }];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(employmentHistory), "employmentHistories");

    // Previous employers sheet
    const previousEmployersEntries = Object.entries(body).filter(([key]) =>
      key.toLowerCase().startsWith("previousEmployers")
    );
    const previousEmployers: any[] =
      previousEmployersEntries.length > 0
        ? previousEmployersEntries.map(([key, val]) =>
            typeof val === "object" && val !== null
              ? { PreviousEmployers: key, ...val }
              : { PreviousEmployers: key, Value: val }
          )
        : [{ Signatory: "No previousEmployers submitted" }];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(previousEmployers), "previousEmployers");

    const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // ---------------------------
    // Upload Excel to OneDrive
    // ---------------------------
    const { link } = await uploadUserFilesToOneDrive(
      excelBuffer,
      `${safefirstName}_submission.xlsx`,
      safefirstName
    );

    // Upload PDF if exists
    let pdfLink = "";
    if (body.formPDF && body.formPDF.startsWith("data:application/pdf")) {
      const pdfMatches = body.formPDF.match(/^data:(.+);base64,(.+)$/);
      if (pdfMatches) {
        const pdfBuffer = Buffer.from(pdfMatches[2], "base64");
        const { link: pl } = await uploadUserFilesToOneDrive(
          pdfBuffer,
          `${safefirstName}_form.pdf`,
          safefirstName
        );
        pdfLink = pl;
      }
    }

    // Upload all other file attachments (passport photo, etc.)
    const uploadPromises = Object.entries(body)
      .filter(
        ([_, value]) =>
          typeof value === "string" && value.startsWith("data:")
      )
      .map(async ([key, value]) => {
        const matches = (value as string).match(/^data:(.+);base64,(.+)$/);
        if (!matches) return;
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        const extension = getExtensionFromMime(mimeType);
        await uploadUserFilesToOneDrive(
          buffer,
          `${key}.${extension}`,
          safefirstName
        );
      });

    await Promise.all(uploadPromises);

    // ---------------------------
    // Send Email to Admin
    // ---------------------------
    const adminHtml = `
      <h2>New Form Submission</h2>
      <ul>
        <li>Excel File: <a href="${link}">${link}</a></li>
        ${pdfLink ? `<li>Form PDF: <a href="${pdfLink}">${pdfLink}</a></li>` : ""}
      </ul>
    `;
    await sendEmail(process.env.ADMIN_EMAIL!, "New Form Submission", adminHtml);

    // Send confirmation email to user
    if (body.email) {
      const userHtml = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f16024;padding:20px 0;font-family:Arial,sans-serif;border:1px solid #d7d8e1">
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
            <div style="background-color:#f4b192;padding:10px;border-radius:10px;">
              <p style="margin:0;color:#c16c45;">
                For inquiries on our services, please contact us directly at
                <a href="mailto:support@sohcahtoa.com" style="color:#f26522;">support@sohcahtoa.com</a>.
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#f3f3fe;border-top:1px solid #d7d8e1;padding:15px;text-align:center;font-size:12px;color:#2c3345;">
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
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
