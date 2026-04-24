import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String },
  location: { type: String },
  isRwandaFocused: { type: Boolean, default: true },
  acceptInternational: { type: Boolean, default: true },
  employmentType: { type: String },
  seniority: { type: String },
  requiredSkills: [{ type: String }],
  preferredSkills: [{ type: String }],
  minExperience: { type: Number },
  maxExperience: { type: Number },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  currency: { type: String },
  status: { type: String, default: 'open' },
  postedBy: { type: String },
  deadline: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
