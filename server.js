const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ status: 'error', message: 'Invalid JSON format' });
    }
    next();
});

// Mock database for habits
let habits = [
    { id: 1, name: 'Exercise', dailyGoal: '30 minutes', completed: false },
    { id: 2, name: 'Read', dailyGoal: '20 pages', completed: false }
];

// Define your routes here
app.post('/habits', (req, res) => {
    const { name, dailyGoal } = req.body;
    if (!name || !dailyGoal) {
        return res.status(400).json({ status: 'error', message: 'Name and dailyGoal are required.' });
    }

    const newHabit = { id: habits.length + 1, name, dailyGoal, completed: false };
    habits.push(newHabit);

    res.status(201).json({ status: 'success', message: 'Habit created successfully!', habit: newHabit });
});

// Get all habits
app.get('/habits', (req, res) => {
    res.status(200).json(habits);
});

// Get habit by ID
app.get('/habits/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const habit = habits.find((h) => h.id === id);

    if (!habit) {
        return res.status(404).json({ error: 'Habit not found' });
    }

    res.status(200).json(habit);
});

// Update habit by ID
app.put('/habits/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const habit = habits.find((h) => h.id === id);

    if (!habit) {
        return res.status(404).json({ error: 'Habit not found' });
    }

    habit.completed = req.body.completed;
    res.status(200).json(habit);
});

// Delete habit by ID
app.delete('/habits/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const habitIndex = habits.findIndex((h) => h.id === id);

    if (habitIndex === -1) {
        return res.status(404).json({ error: 'Habit not found' });
    }

    habits.splice(habitIndex, 1);
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
