const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const LoginData = require("./models/mdl_usr"); // <-- MongoDB model

router.use(express.json());
const usersFile = path.join(__dirname, "data2.json");

// Route to serve login page
router.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Page</title>
  <link rel="stylesheet" href="/login.css">
</head>
<body>
  <div class="login-container">
    <h2>Login</h2>
    <form id="loginForm" method="POST" action="/login">
      <div class="input-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" required>
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" required>
      </div>
      <button type="submit" class="login-btn">Login</button>   
    <a href="/signup" class="login-btn" style="display: inline-block; text-align: center;">Sign Up</a>
 </form> </div>

 <script>

const form = document.getElementById("loginForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    alert(result.message || result.error);

    if (result.success && result.redirect) {
      window.location.href = result.redirect;
    }
  });
 </script>
</body>
</html>
  `);
});

// Handle login POST
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  console.log("📩 Login Attempt:", email, password);

  try {
    const user = await LoginData.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "❌ User not found!" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "❌ Incorrect password!" });
    }

    res.json({ success: true, message: "✅ Login successful", redirect: "/home" });

  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ error: "Server error while logging in." });
  }
});

module.exports = router;