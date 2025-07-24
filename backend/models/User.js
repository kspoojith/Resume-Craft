import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String, // Only for email login
  googleId: String,
  linkedinId: String,
  avatar: String,
  resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resume' }],
  profileData: {
    phone: String,
    location: String,
    website: String,
    github: String,
    linkedin: String,
    bio: String,
    interests: [String],  // e.g., ['Web Dev', 'AI', 'Design']
    experience: [
      {
        jobTitle: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        description: String
      }
    ],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
        grade: String
      }
    ],
    skills: [String] // e.g., ["React", "Node.js", "LaTeX"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);
