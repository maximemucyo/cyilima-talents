import dbConnect from '../lib/db';
import User from '../lib/models/User';
import Job from '../lib/models/Job';
import Candidate from '../lib/models/Candidate';

async function check() {
  try {
    await dbConnect();
    const users = await User.countDocuments();
    const jobs = await Job.countDocuments();
    const candidates = await Candidate.countDocuments();
    
    console.log('Database Status:');
    console.log(`- Users: ${users}`);
    console.log(`- Jobs: ${jobs}`);
    console.log(`- Candidates: ${candidates}`);
    
    if (jobs > 0) {
        const sampleJob = await Job.findOne();
        console.log(`Sample Job: ${sampleJob.title} in ${sampleJob.location}`);
    }
    
    if (candidates > 0) {
        const sampleCandidate = await Candidate.findOne();
        console.log(`Sample Candidate: ${sampleCandidate.firstName} ${sampleCandidate.lastName}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Check failed:', error);
    process.exit(1);
  }
}

check();
