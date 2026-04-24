import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  headline: { type: String },
  bio: { type: String },
  location: { type: String },
  phone: { type: String },
  country: { type: String },
  isRwandaBased: { type: Boolean },
  skills: [{ type: mongoose.Schema.Types.Mixed }], // supports strings or object matching Talent Profile Schema
  languages: [{ type: mongoose.Schema.Types.Mixed }],
  experience: [{ type: mongoose.Schema.Types.Mixed }],
  education: [{ type: mongoose.Schema.Types.Mixed }],
  certifications: [{ type: mongoose.Schema.Types.Mixed }],
  projects: [{ type: mongoose.Schema.Types.Mixed }],
  availability: { type: mongoose.Schema.Types.Mixed },
  socialLinks: { type: mongoose.Schema.Types.Mixed },
  cvUrl: { type: String },
  cvText: { type: String }, // Raw extracted text for AI context
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);
