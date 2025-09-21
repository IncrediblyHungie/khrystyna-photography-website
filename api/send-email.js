import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail app password
      },
    });

    // Email content for Khrystyna
    const mailOptionsToKhrystyna = {
      from: process.env.EMAIL_USER,
      to: 'khrystynaskotte@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          </div>

          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #007cba; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #666;">${message.replace(/\n/g, '<br>')}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999;">
            <p>This email was sent from your photography website contact form.</p>
            <p>Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
    };

    // Auto-reply email to the sender
    const mailOptionsToSender = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Khrystyna Skotte Photography',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px;">
            Thank you for reaching out!
          </h2>

          <p>Hi ${name},</p>

          <p>Thank you for contacting Khrystyna Skotte Photography! I have received your message and will get back to you within 24-48 hours.</p>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Your message:</h3>
            <p style="line-height: 1.6; color: #666;">${message.replace(/\n/g, '<br>')}</p>
          </div>

          <p>I look forward to discussing your photography needs with you!</p>

          <p>Best regards,<br>
          <strong>Khrystyna Skotte</strong><br>
          Khrystyna Skotte Photography<br>
          📧 khrystynaskotte@gmail.com<br>
          📱 619-577-6091</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999;">
            <p>If you need immediate assistance, please call 619-577-6091.</p>
          </div>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(mailOptionsToKhrystyna),
      transporter.sendMail(mailOptionsToSender)
    ]);

    res.status(200).json({
      message: 'Email sent successfully',
      success: true
    });

  } catch (error) {
    console.error('Email sending error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
      command: error.command
    });

    res.status(500).json({
      message: 'Failed to send email',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}