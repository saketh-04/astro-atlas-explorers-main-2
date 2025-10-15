const User = require('../models/User');
const CelestialObject = require('../models/CelestialObject');

exports.banUser = async (req, res) => {
  // Example ban implementation (could be status field or removal)
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.json({ message: 'User banned/removed', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addCelestialObject = async (req, res) => {
  try {
    const obj = new CelestialObject(req.body);
    await obj.save();
    res.status(201).json(obj);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
