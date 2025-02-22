var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get All Users Task
router.get('/get-all', async (req, res) => {
  try {
    const userTasks = await prisma.userTask.findMany();
    res.json(userTasks.length ? userTasks : 'No user tasks found');
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ error: 'Failed to fetch user tasks' });
  }
});

// Get User Task by ID
router.get('/get-user-task/:user_id/:task_id', async (req, res) => {
  const { user_id, task_id } = req.params;
  try {
    const userTask = await prisma.userTask.findUnique({
      where: {
        user_id_task_id: {
          user_id: parseInt(user_id),
          task_id: parseInt(task_id),
        },
      },
    });
    res.json(userTask || 'User task not found');
  } catch (error) {
    console.error('Error fetching user task:', error);
    res.status(500).json({ error: 'Failed to fetch user task' });
  }
});

// Create User Task
router.post('/create', async (req, res) => {
  const { user_id, task_id } = req.body;
  try {
    const userTask = await prisma.userTask.create({
      data: {
        user_id: parseInt(user_id),
        task_id: parseInt(task_id),
      },
    });
    res.json(userTask);
  } catch (error) {
    console.error('Error creating user task:', error);
    res.status(500).json({ error: 'Failed to create user task' });
  }
});

// Update User Task
router.put(
  '/update-user-task/:user_id_param/:task_id_param',
  async (req, res) => {
    const { user_id_param, task_id_param } = req.params;
    const { user_id, task_id } = req.body;
    try {
      const userTask = await prisma.userTask.update({
        where: {
          user_id_task_id: {
            user_id: parseInt(user_id_param),
            task_id: parseInt(task_id_param),
          },
        },
        data: {
          user_id: parseInt(user_id),
          task_id: parseInt(task_id),
        },
      });
      res.json(userTask);
    } catch (error) {
      console.error('Error updating user task:', error);
      res.status(500).json({ error: 'Failed to update user task' });
    }
  }
);

// Delete User
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json(user);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
