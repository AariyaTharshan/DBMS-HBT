const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: 'https://home-budget-tracker-one.vercel.app/', // Front-end URL
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions));

// MongoDB connection string
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User schema and model
const MemberSchema = new mongoose.Schema({
  username: String,
  incomes: [{ amount: Number, description: String }],
  expenses: [{ amount: Number, category: String, description: String }]
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  members: [MemberSchema]
});

const ChangeSchema = new mongoose.Schema({
  username: String,
  changeType: String,
  description: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);
const Change = mongoose.model('Change', ChangeSchema);

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  jwt.verify(token, 'jwt123!', (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: 'Failed to authenticate token' });
    }

    req.user = decoded;
    next();
  });
};

// Routes

// Signup route
app.post('/signup', asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  const token = jwt.sign({ id: newUser._id, username: newUser.username }, 'jwt123!', { expiresIn: '1h' });

  res.cookie('accessToken', token, { httpOnly: true, secure: false, sameSite: 'strict' })
    .status(201).json({ msg: 'User registered successfully', token });
}));

app.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    console.log('User not found');
    return res.status(400).json({ msg: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log('Password does not match');
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, 'jwt123!', { expiresIn: '1h' });

  res.status(200).json({ msg: 'Login successful', token });
}));

// Add member route
app.post('/add-member', verifyToken, asyncHandler(async (req, res) => {
  const { memberUsername } = req.body;
  const { username: loggedInUsername } = req.user;

  const user = await User.findOne({ username: loggedInUsername });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  const existingMember = user.members.find(member => member.username === memberUsername);
  if (existingMember) {
    return res.status(400).json({ msg: 'Member already exists' });
  }

  user.members.push({ username: memberUsername, incomes: [], expenses: [] });
  await user.save();

  const newChange = new Change({ username: loggedInUsername, changeType: 'addition', description: `Added member ${memberUsername}` });
  await newChange.save();

  res.status(200).json({ msg: 'Member added successfully' });
}));

// Add income route
app.post('/add-income', verifyToken, asyncHandler(async (req, res) => {
  const { memberUsername, amount, description } = req.body;
  const { username: loggedInUsername } = req.user;

  const user = await User.findOne({ username: loggedInUsername });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  const member = user.members.find(member => member.username === memberUsername);
  if (!member) {
    return res.status(400).json({ msg: 'Member not found' });
  }

  member.incomes.push({ amount, description });
  await user.save();

  const newChange = new Change({ username: loggedInUsername, changeType: 'income addition', description: `Added income ${amount} to member ${memberUsername}` });
  await newChange.save();

  res.status(200).json({ msg: 'Income added successfully' });
}));

// Add expense route
app.post('/add-expense', verifyToken, asyncHandler(async (req, res) => {
  const { memberUsername, amount, category, description } = req.body;
  const { username: loggedInUsername } = req.user;

  const user = await User.findOne({ username: loggedInUsername });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  const member = user.members.find(member => member.username === memberUsername);
  if (!member) {
    return res.status(400).json({ msg: 'Member not found' });
  }

  member.expenses.push({ amount, category, description });
  await user.save();

  const newChange = new Change({ username: loggedInUsername, changeType: 'expense addition', description: `Added expense ${amount} to member ${memberUsername}` });
  await newChange.save();

  res.status(200).json({ msg: 'Expense added successfully' });
}));

// Income stats route
app.get('/income-stats/:username', verifyToken, asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { username: loggedInUsername } = req.user;

  if (username !== loggedInUsername) {
    return res.status(403).json({ msg: 'Access denied. You can only view stats for your own username.' });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  const stats = user.members.map(member => {
    const totalIncome = member.incomes.reduce((acc, income) => acc + income.amount, 0);
    return {
      memberUsername: member.username,
      totalIncome
    };
  });

  res.status(200).json(stats);
}));

// Expense stats route
app.get('/expense-stats/:username', verifyToken, asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { username: loggedInUsername } = req.user;

  if (username !== loggedInUsername) {
    return res.status(403).json({ msg: 'Access denied. You can only view stats for your own username.' });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  const stats = user.members.map(member => {
    const totalExpense = member.expenses.reduce((acc, expense) => acc + expense.amount, 0);
    return {
      memberUsername: member.username,
      totalExpense
    };
  });

  res.status(200).json(stats);
}));

// Compare stats route
app.get('/compare-stats/:username', verifyToken, asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { username: loggedInUsername } = req.user;

  if (username !== loggedInUsername) {
    return res.status(403).json({ msg: 'Access denied. You can only compare stats for your own username.' });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  const stats = user.members.map(member => {
    const totalIncome = member.incomes.reduce((acc, income) => acc + income.amount, 0);
    const totalExpense = member.expenses.reduce((acc, expense) => acc + expense.amount, 0);
    return {
      memberUsername: member.username,
      totalIncome,
      totalExpense
    };
  });

  res.status(200).json(stats);
}));

// Route to fetch members for a given username
app.get('/members/:username', verifyToken, asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { username: loggedInUsername } = req.user;

  if (username !== loggedInUsername) {
    return res.status(403).json({ msg: 'Access denied. You can only view members for your own username.' });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  res.status(200).json(user.members);
}));

app.get('/change-logs/:username', verifyToken, asyncHandler(async (req, res) => {
  const { username: loggedInUsername } = req.user;

  console.log('Received request for username:', loggedInUsername);

  let changes = await Change.find({ username: loggedInUsername });
  if (!changes.length) {
    console.log('No changes found for username:', loggedInUsername);
    return res.status(404).json({ msg: 'No change logs found' });
  }

  // Sorting by date in descending order
  changes = changes.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Filtering by type if specified
  const { type } = req.query;
  console.log('Filtering changes by type:', type);
  if (type && (type === 'income addition' || type === 'expense addition')) {
    changes = changes.filter(change => change.changeType === type);
  }

  res.status(200).json(changes);
}));



// New route to fetch total income and expense
app.get('/total-stats', verifyToken, asyncHandler(async (req, res) => {
  try {
    const { username: loggedInUsername } = req.user;

    const user = await User.findOne({ username: loggedInUsername });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const totals = user.members.reduce((acc, member) => {
      const totalIncome = member.incomes.reduce((acc, income) => acc + income.amount, 0);
      const totalExpense = member.expenses.reduce((acc, expense) => acc + expense.amount, 0);
      acc.totalIncome += totalIncome;
      acc.totalExpense += totalExpense;
      return acc;
    }, { totalIncome: 0, totalExpense: 0 });

    res.status(200).json(totals);
  } catch (error) {
    console.error('Error fetching total stats:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
}));




app.listen(port, () => console.log(`Server running on port ${port}`));
