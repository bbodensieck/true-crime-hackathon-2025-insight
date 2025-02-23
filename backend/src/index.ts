import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;
const prisma = new PrismaClient();

app.use(cors());

app.use(express.json());

app.post('/api/markers', async (req, res) => {
  try {
    const task = await prisma.marker.create({
      data: req.body,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create marker' });
  }
});

app.put('/api/markers/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const updatedMarker = await prisma.marker.update({
      where: { id: Number(id) },
      data: { title },
    });
    res.json(updatedMarker);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update marker title' });
  }
});

app.delete('/api/markers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.marker.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete marker' });
  }
});

app.get('/api/markers', async (req, res) => {
  try {
    const tasks = await prisma.marker.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch markers' });
  }
});

app.post('/api/ranges', async (req, res) => {
  try {
    const task = await prisma.range.create({
      data: req.body,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create range' });
  }
});

app.delete('/api/ranges/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.range.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete range' });
  }
});

app.get('/api/ranges', async (req, res) => {
  try {
    const tasks = await prisma.range.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ranges' });
  }
});

app.post('/api/video-clips', async (req, res) => {
  try {
    const task = await prisma.videoClip.create({
      data: req.body,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create video clip' });
  }
});

app.delete('/api/video-clips/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.videoClip.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video clip' });
  }
});

app.get('/api/video-clips', async (req, res) => {
  try {
    const tasks = await prisma.videoClip.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video clips' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});


