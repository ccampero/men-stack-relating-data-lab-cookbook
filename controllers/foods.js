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
  
      await User.findByIdAndUpdate(req.session.user._id, {
        $pull: { pantry: { _id: req.params.foodId } }
      });
  
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

  router.put('/:itemId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        console.log("User not found");
        return res.redirect('/');
      }
      
      const foodItem = user.pantry.id(req.params.itemId);
      if (!foodItem) {
        console.log("Food item not found");
        return res.redirect(`/users/${req.params.userId}/foods`);
      }
  
      foodItem.name = req.body.name;
      await user.save();
  
      res.redirect(`/users/${req.params.userId}/foods`);
    } catch (err) {
      console.error("Error updating food item:", err);
      res.redirect('/');
    }
  });

  router.get('/community', async (req, res) => {
    try {
       const users = await User.find();
        res.render('community/index', { users }); 
    } catch (err) {
        console.error(err);
        res.redirect('/'); 
    }
});

router.get('/', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) return res.redirect('/'); 
      res.render('foods/index', { user, pantry: user.pantry });
    } catch (err) {
      console.error(err);
      res.redirect('/'); 
    }
  });
  

module.exports = router;
