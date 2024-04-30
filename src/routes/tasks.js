// routes/tasks.js

const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const verifyAuth = require('../middleware/authMiddleware')

// Get all tasks
router.get('/', verifyAuth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId });
        console.log('All task ', tasks);
        
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Create a new task
router.post('/', verifyAuth, async (req, res) => {
    const { description } = req.body;
    console.log('create new task with ', description);
    const userId = req.userId;
    try {
      const newTask = new Task({ userId, description });
      await newTask.save();
      res.status(201).json({ success: true, message: 'Task created successfully', code: 201 });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update a task
router.put('/:id', verifyAuth, async (req, res) => {
    const { id } = req.params;
    const { description, status } = req.body;
  
    try {
      const task = await Task.findByIdAndUpdate(id, { description, status }, { new: true });
  
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
  
      res.status(200).json({ success: true, message: 'Task updated successfully', data: task, code: 200 });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Delete a task
router.delete('/:id', verifyAuth, async (req, res) => {
    const { id } = req.params;
    try {
      const task = await Task.findByIdAndDelete(id);
  
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
  
      res.status(200).json({ success: true, message: 'Task deleted successfully', code: 200 });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
