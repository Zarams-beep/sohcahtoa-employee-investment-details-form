// utils/emailConfig.ts
import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

// Get Microsoft Graph client with authentication
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
    console.error(" Token response:", tokenData);
    throw new Error("Failed to get access token from Azure");
  }

  console.log(" Got access token successfully");
  return Client.init({
    authProvider: (done) => {
      done(null, tokenData.access_token);
    },
  });
}

// Send email using Microsoft Graph API
export async function sendEmail(
  toEmail: string,
  subject: string,
  htmlContent: string
) {
  try {
    const client = await getGraphClient();
    const senderEmail = process.env.ADMIN_EMAIL!;

    const message = {
      message: {
        subject,
        body: {
          contentType: "HTML",
          content: htmlContent,
        },
        toRecipients: [
          {
            emailAddress: {
              address: toEmail,
            },
          },
        ],
      },
      saveToSentItems: true,
    };

    await client.api(`/users/${senderEmail}/sendMail`).post(message);
    
    return { success: true };
  } catch (error: any) { 
    if (error.statusCode === 404) {
      throw new Error(`Sender email "${process.env.ADMIN_EMAIL}" not found in Microsoft 365`);
    } else if (error.statusCode === 403) {
      throw new Error("Missing Mail.Send permission. Check Azure app permissions.");
    }
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
}