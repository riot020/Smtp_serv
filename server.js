require('dotenv').config({ path: '.env' });
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow all origins — you can restrict to specific domains later
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
  const data = req.body;
  const source = data.source || "Unknown Source";

  let emailBody = `New Form Submission from ${source}\n\n`;
  for (const key in data) {
    if (key !== "source") {
      emailBody += `${key}: ${data[key]}\n`;
    }
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${data.email || 'Form User'}" <${data.email || process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
    subject: `New Form Submission (${source})`,
    text: emailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    res.status(500).send("Failed to send email: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
