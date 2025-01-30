const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');




//users registration
exports.registerUser = async (req, res) => {
    const { name, email, password ,usertype} = req.body;
  
    if (!name || !email || !password || !usertype) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
  
      // Save the user to the database
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        usertype
      });
  
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully", newUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// users login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
           // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Successful login
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserProfile = async (req, res) => {
    try {
        // Ensure user ID is provided in the query
        const userId = req.query.id;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Fetch user from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Respond with user details
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    const { id } = req.query; // Extract ID from query parameters
    const { name, email, usertype } = req.body;

    console.log('User ID from query:', id); // Debugging

    try {
        // Validate query parameter
        if (!id) {
            return res.status(400).json({ error: 'User ID is required in the query parameters' });
        }

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user data
        user.name = name || user.name;
        user.email = email || user.email;
        user.usertype = usertype || user.usertype;

        await user.save();

        // Send success response
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating profile:', error.message); // Debugging
        res.status(500).json({ error: error.message });
    }
};
const crypto = require('crypto');


exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Generate an OTP
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        user.resetPasswordToken = otp;
        user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Configure the email transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, 
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

  
        // Email content
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Your Password Reset OTP',
            text: `You requested to reset your password. Your OTP is:\n\n${otp}\n\n` +
                  `This OTP will expire in 1 hour. If you did not request this, please ignore this email.`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent to your email address' });
    } catch (error) {
        console.error('Error in requestPasswordReset:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
