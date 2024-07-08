const express = require('express');
const router = express.Router();
const User = require('../models/user.js'); 


router.get('/', async (req, res) => {
  try {
    const users = await User.find(); 
    res.render('community/index.ejs', { users }); 
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

router.get('/:userId', async (req, res) => {
  try {
      const user = await User.findById(req.params.userId);
      if (!user) {
          return res.status(404).send('User not found');
      }
      res.render('users/show', { user });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

module.exports = router;
