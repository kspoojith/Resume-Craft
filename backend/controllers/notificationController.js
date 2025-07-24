import Notification from '../models/Notification.js';

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
