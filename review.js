// review.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Route to display the review page
router.get('/', (req, res) => {
    // Read reviews from the reviews.txt file
    const filePath = path.join(__dirname, 'reviews.txt');
    let reviews = [];

    if (fs.existsSync(filePath)) {
        const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
        reviews = lines.reverse().map(line => {
            const [name, email, review] = line.split('|');
            return { name, email, review };
        });
    }

    // Render the EJS template with reviews
    res.render('review', { reviews });
});

// Route to handle review submission
router.post('/', (req, res) => {
    const { name, email, review } = req.body;
    const filePath = path.join(__dirname, 'reviews.txt');
    const entry = `${name}|${email}|${review}\n`;

    fs.appendFileSync(filePath, entry, 'utf-8'); // Save review

    // Redirect back to the same page to show the updated reviews
    res.redirect('/review');
});

module.exports = router;
