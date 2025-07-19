const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// Job Schema
const jobSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  post: String,
  company: String,
  requirement: String,
  salary: String,
  contact: String
});
const Job = mongoose.model('Job', jobSchema);

// Register route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  res.json({ message: 'User registered successfully' });
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  res.json({ userId: user._id, message: 'Login successful' });
});

// Post job
app.post('/jobs', async (req, res) => {
  const { userId, post, company, requirement, salary, contact } = req.body;
  const job = new Job({ userId, post, company, requirement, salary, contact });
  await job.save();
  res.json({ message: 'Job posted successfully' });
});

// Get all jobs
app.get('/jobs', async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

// Secure DELETE job
app.delete('/jobs/:id', async (req, res) => {
  const userId = req.body.userId;
  const jobId = req.params.id;

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.userId.toString() !== userId) {
    return res.status(403).json({ message: 'Unauthorized: You can only delete your own jobs' });
  }

  await Job.findByIdAndDelete(jobId);
  res.json({ message: 'Job deleted successfully' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
