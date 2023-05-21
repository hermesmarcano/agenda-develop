const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Manager = require("../models/manager");
const bcrypt = require("bcrypt");

// Configure nodemailer with your email provider's settings
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.PASSWORD,
  },
});

// Route to send email and generate password reset link
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const manager = await Manager.findOne({ email });

    if (!manager) {
      return res.status(404).json({ error: "User was not found" });
    }

    // Generate a password reset token
    const token = crypto.randomBytes(20).toString("hex");

    // Store the reset token in the manager model
    manager.resetToken = token;

    // Save the updated manager in the database
    await manager.save();

    // Compose the email
    const mailOptions = {
      from: `"Agenda App" <${process.env.MAIL_USERNAME}>`,
      to: email,
      subject: "Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <h2 style="color: #333333; margin-bottom: 20px;">Password Reset</h2>
          <p style="color: #333333; margin-bottom: 20px;">
            Dear ${manager.name},
          </p>
          <p style="color: #333333; margin-bottom: 20px;">
            You have requested to reset your password for Agenda App. Please click the following link to proceed:
          </p>
          <a href="http://localhost:3000/#/reset-password/${token}" style="display: inline-block; background-color: #4caf50; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
          <p style="color: #333333; margin-top: 20px;">
            If you did not request a password reset, please ignore this email.
          </p>
          <p style="color: #333333;">
            Thank you,
            <br />
            The Agenda App Team
          </p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  console.log(req.body);

  try {
    // Validate the token and find the user in your database
    const manager = await Manager.findOne({ resetToken: token });

    if (!manager) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Set the new password for the user
    manager.password = newPassword;

    // Clear or mark the reset token as used
    manager.resetToken = null;

    // Save the updated user in the database
    await manager.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
