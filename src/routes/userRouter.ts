import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// GET запрос будет доступен по адресу: http://localhost:5000/user
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany(); 
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST запрос будет доступен по адресу: http://localhost:5000/user
router.post('/', async (req, res) => {
  const { email, name, bio } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        profile: bio ? {
          create: { bio }
        } : undefined
      },
    });
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;