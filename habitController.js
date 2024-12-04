const db = require('../database/db');

// Add Habit
exports.addHabit = (req, res) => {
  const { name, dailyGoal } = req.body;
  if (!name || !dailyGoal) {
    return res.status(400).json({ status: "error", message: "Name and daily goal are required" });
  }
  db.run(
    "INSERT INTO habits (name, dailyGoal, completion) VALUES (?, ?, '{}')",
    [name, dailyGoal],
    function (err) {
      if (err) return res.status(500).json({ status: "error", message: err.message });
      res.status(201).json({ status: "success", data: { id: this.lastID, name, dailyGoal } });
    }
  );
};

// Update Habit
exports.updateHabit = (req, res) => {
  const { id } = req.params;
  const today = new Date().toISOString().split('T')[0];

  db.get("SELECT * FROM habits WHERE id = ?", [id], (err, habit) => {
    if (err || !habit) return res.status(404).json({ status: "error", message: "Habit not found" });

    const completion = JSON.parse(habit.completion || "{}");
    completion[today] = true;

    db.run(
      "UPDATE habits SET completion = ? WHERE id = ?",
      [JSON.stringify(completion), id],
      (err) => {
        if (err) return res.status(500).json({ status: "error", message: err.message });
        res.json({ status: "success", message: "Habit marked complete for today." });
      }
    );
  });
};

// Get Habits
exports.getHabits = (req, res) => {
  db.all("SELECT * FROM habits", [], (err, rows) => {
    if (err) return res.status(500).json({ status: "error", message: err.message });
    res.json({ status: "success", data: rows });
  });
};

// Weekly Report
exports.getWeeklyReport = (req, res) => {
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  db.all("SELECT * FROM habits", [], (err, rows) => {
    if (err) return res.status(500).json({ status: "error", message: err.message });

    const report = rows.map((habit) => {
      const completion = JSON.parse(habit.completion || "{}");
      const completedDays = last7Days.filter((date) => completion[date]);
      return { name: habit.name, completionRate: `${(completedDays.length / 7) * 100}%` };
    });

    res.json({ status: "success", data: report });
  });
};
