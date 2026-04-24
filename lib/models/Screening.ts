import mongoose from 'mongoose';

const ScreeningResultSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
  candidateName: { type: String },
  matchScore: { type: Number, required: true },
  reasoning: { type: String, required: true },
  strengths: [{ type: String }],
  gaps: [{ type: String }],
  recommendedAction: { type: String, enum: ['shortlist', 'review', 'reject'] },
});

const ScreeningSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'failed'], default: 'pending' },
  results: [ScreeningResultSchema],
  error: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.Screening || mongoose.model('Screening', ScreeningSchema);
