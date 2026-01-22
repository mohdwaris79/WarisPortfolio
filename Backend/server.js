require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// ✅ CORS: allow only your frontend URL
app.use(cors({
  origin: "https://waris-portfolio-ten.vercel.app",
  methods: ["GET", "POST"],
}));

// ✅ Parse JSON body
app.use(express.json());

// ✅ Health check route (optional)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Nodemailer setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ POST /send route
app.post("/send", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // ✅ Validate request body
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
      body: req.body, // optional for debugging
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

// ✅ Export app for Vercel
module.exports = app;
