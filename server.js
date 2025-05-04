const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/surajDB')
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

//  View Engine
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); //  Set views to root folder (recipe_ui)

//  Serve static files from current folder (recipe_ui)
app.use(express.static(__dirname)); // IMPORTANT
// server.js

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add CORS middleware if needed
const cors = require('cors');
app.use(cors());

// Routes
const loginRoute = require("./login");
const signupRoute = require("./signup");
const homeRoute = require("./home"); 
const offerRoute = require("./offer"); 
const popularRoute = require("./popular"); 
const contactRoute = require("./contact"); 
const cartRoute = require("./cart"); 
const orderRoute = require("./order"); 
const reviewRoute = require("./review"); 
const recipedetailsRoute = require("./recipedetails");


app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/home", homeRoute); 
app.use("/offer", offerRoute); 
app.use("/popular", popularRoute); 
app.use("/contact", contactRoute); 
app.use("/cart", cartRoute); 
app.use("/order", orderRoute); 
app.use("/review", reviewRoute); 
app.use("/recipedetails", recipedetailsRoute);

// Redirect root to login
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
