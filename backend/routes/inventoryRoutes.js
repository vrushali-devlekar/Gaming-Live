const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const User = require('../models/User');

// GET /api/inventory/shop - Fetch available shop items
router.get('/shop', async (req, res) => {
  try {
    const items = await Inventory.find({});
    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('Error fetching inventory shop:', error);
    res.status(500).json({ success: false, message: 'Server error fetching shop items' });
  }
});

// POST /api/inventory/buy - Purchase item with user's BP
router.post('/buy', async (req, res) => {
  try {
    const { itemName, userId } = req.body;

    if (!itemName) {
      return res.status(400).json({ success: false, message: 'itemName is required' });
    }

    const item = await Inventory.findOne({ name: itemName });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in shop' });
    }

    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (req.user && req.user._id) {
      user = await User.findById(req.user._id);
    } else {
      user = await User.findOne({ email: 'ghost_coder@codebattle.com' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    // Check if already unlocked
    if (user.unlockedSkins.includes(item.name)) {
      return res.status(400).json({
        success: false,
        message: 'Item already unlocked in your inventory'
      });
    }

    // Check BP balance
    if (user.stats.bp < item.costBP) {
      return res.status(400).json({
        success: false,
        message: `Insufficient BP! Requires ${item.costBP} BP, but you have ${user.stats.bp} BP.`
      });
    }

    // Deduct BP & unlock item
    user.stats.bp -= item.costBP;
    user.unlockedSkins.push(item.name);
    await user.save();

    res.json({
      success: true,
      message: `Successfully purchased ${item.name}!`,
      remainingBP: user.stats.bp,
      unlockedSkins: user.unlockedSkins
    });
  } catch (error) {
    console.error('Error purchasing item:', error);
    res.status(500).json({ success: false, message: 'Server error processing purchase' });
  }
});

module.exports = router;
