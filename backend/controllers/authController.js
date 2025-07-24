import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import axios from 'axios';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Registering with password:", password);

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profileData: user.profileData,
      googleId: user.googleId,
      linkedinId: user.linkedinId
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out' });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const oauthLogin = async (req, res) => {
  const { provider, providerId, email, name, avatar } = req.body;

  if (!provider || !providerId || !email) {
    return res.status(400).json({ message: 'Missing required OAuth data' });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      // Check if provider matches
      if (
        (provider === 'google' && !user.googleId) ||
        (provider === 'linkedin' && !user.linkedinId)
      ) {
        return res.status(403).json({ message: 'Email already used with different login method' });
      }
    } else {
      user = new User({ email, name, avatar });
    }

    if (provider === 'google') user.googleId = providerId;
    if (provider === 'linkedin') user.linkedinId = providerId;
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profileData: user.profileData,
      googleId: user.googleId,
      linkedinId: user.linkedinId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OAuth login failed' });
  }
};

export const linkedinLogin = async (req, res) => {
  const { code, redirectUri } = req.body;

  if (!code || !redirectUri) {
    return res.status(400).json({ message: 'Missing code or redirectUri' });
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const accessToken = tokenRes.data.access_token;

    // 2. Fetch user info
    const [profileRes, emailRes] = await Promise.all([
      axios.get('https://api.linkedin.com/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      }),
      axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
    ]);

    const linkedinId = profileRes.data.id;
    const name = `${profileRes.data.localizedFirstName} ${profileRes.data.localizedLastName}`;
    const email = emailRes.data.elements[0]['handle~'].emailAddress;

    // 3. Check/create user
    let user = await User.findOne({ email });
    if (user && !user.linkedinId) {
      return res.status(403).json({ message: 'Email already used with different login method' });
    }
    if (!user) {
      user = new User({ name, email, linkedinId });
    } else {
      user.linkedinId = linkedinId;
      if (!user.name) user.name = name;
    }

    await user.save();
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error('LinkedIn login error:', err.message);
    res.status(500).json({ message: 'LinkedIn login failed' });
  }
};