const { client } = require("./sesClient");
const { SendEmailCommand } = require("@aws-sdk/client-ses");
async function sendEmail() {
  const params = {
    Source: "your_verified_email@example.com",
    Destination: {
      ToAddresses: ["recipient@example.com"],
    },
    Message: {
      Subject: {
        Data: "Hello from SES in Node.js",
      },
      Body: {
        Text: {
          Data: "This is a test email sent via Amazon SES using Node.js!",
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await client.send(command);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

sendEmail();
