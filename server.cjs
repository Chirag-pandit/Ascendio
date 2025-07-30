const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, company, message } = req.body;

  // Configure your email transport (update with your real email and app password)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'octane428@gmail.com',      // <-- Replace with your email
      pass: 'supersuper',         // <-- Replace with your app password
    },
  });

  const mailOptions = {
    from: email,
    to: 'ascendio.global@gmail.com',      // <-- Replace with receiver's email
    subject: `New Contact Form Submission from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Company: ${company}
      Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ message: 'Failed to send message.', error });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));