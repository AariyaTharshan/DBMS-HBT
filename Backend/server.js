const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;
app.use(cors());

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

// Middleware
app.use(bodyParser.json());

// Routes

// Signup route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Generate token after signup
    const token = jwt.sign({ id: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });
    
    // Redirect to login page after successful signup
    res.status(201).json({ msg: 'User registered successfully', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Send token in response
    res.status(200).json({ msg: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add member route
app.post('/add-member', async (req, res) => {
  const { username, memberUsername } = req.body;

  try {
    // Check if the member already exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const existingMember = user.members.find(member => member.username === memberUsername);
    if (existingMember) {
      return res.status(400).json({ msg: 'Member already exists' });
    }

    // Add the member
    user.members.push({ username: memberUsername, incomes: [], expenses: [] });
    await user.save();

    // Log the change
    const newChange = new Change({ username, changeType: 'addition', description: `Added member ${memberUsername}` });
    await newChange.save();

    res.status(200).json({ msg: 'Member added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add income route
app.post('/add-income', async (req, res) => {
  const { username, memberUsername, amount, description } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const member = user.members.find(member => member.username === memberUsername);
    if (!member) {
      return res.status(400).json({ msg: 'Member not found' });
    }

    member.incomes.push({ amount, description });
    await user.save();

    // Log the change
    const newChange = new Change({ username, changeType: 'income addition', description: `Added income ${amount} to member ${memberUsername}` });
    await newChange.save();

    res.status(200).json({ msg: 'Income added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add expense route
app.post('/add-expense', async (req, res) => {
  const { username, memberUsername, amount, category, description } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const member = user.members.find(member => member.username === memberUsername);
    if (!member) {
      return res.status(400).json({ msg: 'Member not found' });
    }

    member.expenses.push({ amount, category, description });
    await user.save();

    // Log the change
    const newChange = new Change({ username, changeType: 'expense addition', description: `Added expense ${amount} to member ${memberUsername}` });
    await newChange.save();

    res.status(200).json({ msg: 'Expense added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Income stats route
app.get('/income-stats/:username', async (req, res) => {
  const { username } = req.params;

  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Expense stats route
app.get('/expense-stats/:username', async (req, res) => {
  const { username } = req.params;

  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Compare income and expense route
app.get('/compare-stats/:username', async (req, res) => {
  const { username } = req.params;

  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to fetch total income of all members
app.get('/total-income/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const totalIncome = user.members.reduce((acc, member) => {
      return acc + member.incomes.reduce((sum, income) => sum + income.amount, 0);
    }, 0);

    res.status(200).json({ totalIncome });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to fetch total expense of all members
app.get('/total-expense/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const totalExpense = user.members.reduce((acc, member) => {
      return acc + member.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }, 0);

    res.status(200).json({ totalExpense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to fetch list of changes
app.get('/changes/:username?', async (req, res) => {
  const { username } = req.params;

  try {
    // Find changes, optionally filtering by username
    const query = username ? { username } : {};
    const changes = await Change.find(query).sort({ date: -1 });
    res.status(200).json(changes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Route to fetch members for a given username
app.get('/members/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    res.status(200).json(user.members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(port, () => console.log(`Server running on port ${port}`));
