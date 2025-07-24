import User from '../models/User.js';
import Notification from '../models/Notification.js';

// Get full profile (basic info + profileData)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profileData (or create if empty)
export const updateUserProfile = async (req, res) => {
  const updates = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update name/avatar directly if passed
    if (updates.name) user.name = updates.name;
    if (updates.avatar) user.avatar = updates.avatar;

    // Merge profileData
    user.profileData = {
      ...user.profileData,
      ...updates.profileData
    };

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      profileData: updatedUser.profileData
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all notifications for the current user
export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json(notifications);
};

// Mark all notifications as read for the current user
export const markAllRead = async (req, res) => {
  await Notification.updateMany({ userId: req.user.userId, read: false }, { $set: { read: true } });
  res.json({ message: "All notifications marked as read" });
};

// Create a notification (call this from other controllers)
export const createNotification = async ({ userId, type, title, message }) => {
  await Notification.create({ userId, type, title, message });
};
