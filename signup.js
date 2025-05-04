const express = require("express");
const router = express.Router();
const LoginData = require("./models/mdl_usr"); // 👈 Import the model

// Serve signup page
router.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    <link rel="stylesheet" href="/login.css">
  </head>
  <body>
    <div class="login-container">
      <h2>Sign Up</h2>
      <form id="signupForm" method="POST" action="/signup">
        <div class="input-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" placeholder="Enter your name" required>
          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" required>
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" required>
        </div>
        <button type="submit" id="submitBtn" class="login-btn">Sign Up</button>
      </form>
      <a href="/login" class="login-btn" style="display: inline-block; text-align: center;">Login</a>
    </div>
    <script>
      const form = document.getElementById("signupForm");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const res = await fetch("/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        alert(result.message || result.error);
      });
    </script>
  </body>
  </html>
  `);
});

// Signup POST route
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await LoginData.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const newUser = new LoginData({ name, email: email.toLowerCase(), password });
    await newUser.save();
    res.json({ message: "✅ User registered successfully!" });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ error: "Server error during registration." });
  }
});

module.exports = router;
