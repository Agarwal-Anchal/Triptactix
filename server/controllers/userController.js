const User = require('../models/User');

const userController = {
  // Create a new user with preferences
  async createUser(req, res) {
    try {
      const userData = req.body;
      const user = new User(userData);
      await user.save();
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to create user',
        error: error.message
      });
    }
  },

  // Get user by ID
  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
        error: error.message
      });
    }
  },

  // Update user preferences
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const user = await User.findByIdAndUpdate(
        id, 
        updates, 
        { new: true, runValidators: true }
      );
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User updated successfully',
        user: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to update user',
        error: error.message
      });
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: error.message
      });
    }
  },

  // Get all users (for development/admin)
  async getAllUsers(req, res) {
    try {
      const users = await User.find().select('-__v');
      res.json({
        success: true,
        count: users.length,
        users: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      });
    }
  }
};

module.exports = userController;
