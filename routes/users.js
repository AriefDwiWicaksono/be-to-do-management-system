var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Get all users
router.get('/get-all', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users.length ? users : 'No user found');
});

// Get User by ID
router.get('/get-user/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
  res.json(user || `User with ID ${id} not found`);
});

// Create User
router.post('/create', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username) return res.json('Please fill username');
  if (!email) return res.json('Please fill email');
  if (!password) return res.json('Please fill password');

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashPassword,
    },
  });
  res.json(user);
});

// Update User
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  if (!username) return res.json('Please fill the name field');
  if (!email) return res.json('Please fill the email field');
  if (!password) return res.json('Please fill the password field');

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      username,
      email,
      password: hashPassword,
    },
  });
  res.json(user);
});

// Delete User
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
  if (!user) return res.json(`User with ID ${id} not found`);

  await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  res.json(`User with ID ${id} deleted successfully`);
});

module.exports = router;
