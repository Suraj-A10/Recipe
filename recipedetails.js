// recipedetails.js
const express = require('express');
const router = express.Router();

router.get('/:name', (req, res) => {
  const recipe = req.params.name;
  res.render(`recipedetails/${recipe}`); // ✅ Looks inside views/recipedetails/recipe.ejs
});


module.exports = router;
