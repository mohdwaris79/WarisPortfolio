// require('dotenv').config();
// const express = require('express');
// const nodemailer = require('nodemailer');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });


// app.post('/send', (req, res) => {
//   const { name, email, subject, message } = req.body;

//   const mailOptions = {
//   from: process.env.EMAIL_USER,
//   to: process.env.EMAIL_USER,
//   replyTo: email,
//   subject,
//   text: `Message from ${name} (${email}):\n\n${message}`,
// };

//   transporter.sendMail(mailOptions, (err, info) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ success: false, error: err.message });
//     }
//     res.json({ success: true });
//   });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running on port ${PORT}`);
// });




require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: "https://waris-portfolio-ten.vercel.app/",
  methods: ["GET", "POST"],
}));

app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send', async (req, res) => {
  const { name, email, subject, message } = req.body;

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


module.exports = app;
