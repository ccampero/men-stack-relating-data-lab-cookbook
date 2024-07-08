const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// Route to display the pantry
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.redirect('/');
    res.render('foods/index', { user: req.session.user, pantry: user.pantry });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Route to display the form for adding a new food item
router.get('/new', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      console.log("User not found");
      return res.redirect('/');
    }
    res.render('foods/new', { user: req.session.user });
  } catch (err) {
    console.error("Error finding user:", err);
    res.redirect('/');
  }
});

// Route to handle the form submission for adding a new food item
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.redirect('/');

    user.pantry.push({ name: req.body.name });
    await user.save();
    res.redirect(`/users/${req.session.user._id}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

router.delete('/:foodId', async (req, res) => {
    try {
      const user = await User.findById(req.session.user._id);
      if (!user) return res.redirect('/');
  
      user.pantry.id(req.params.foodId).remove(); // Remove the food item from pantry
      await user.save();
      res.redirect(`/users/${req.session.user._id}/foods`);
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  });

  router.get('/:foodId/edit', async (req, res) => {
    try {
      const user = await User.findById(req.session.user._id);
      if (!user) return res.redirect('/');
  
      const food = user.pantry.id(req.params.foodId);
      if (!food) return res.redirect(`/users/${req.session.user._id}/foods`);
  
      res.render('foods/edit', { user: req.session.user, food });
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  });

  router.put('/:foodId', async (req, res) => {
    try {
      const user = await User.findById(req.session.user._id);
      if (!user) return res.redirect('/');
  
      const food = user.pantry.id(req.params.foodId);
      if (!food) return res.redirect(`/users/${req.session.user._id}/foods`);
  
      food.name = req.body.name;
      await user.save();
      res.redirect(`/users/${req.session.user._id}/foods`);
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  });

module.exports = router;
