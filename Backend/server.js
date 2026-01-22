require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

/*  CORS (NO trailing slash) */
app.use(
  cors({
    origin: "https://waris-portfolio-ten.vercel.app",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

/*  Health check (optional but recommended) */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* Send Email API */
app.post("/send", async (req, res) => {
  const { name, email, subject, message } = req.body;

  /*  Validation (fixes 400 error) */
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject,
      text: `Message from ${name} (${email}):\n\n${message}`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/*  REQUIRED for Vercel */
module.exports = app;
