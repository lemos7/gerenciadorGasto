const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../services/fileService');

const router = express.Router();

router.get('/', async (req, res) => {
  const data = await readData();
  res.json(data);
});

router.post('/', async (req, res) => {
  const gastos = await readData();
  const novo = { id: uuidv4(), ...req.body };
  gastos.push(novo);
  await writeData(gastos);
  res.status(201).json(novo);
});

router.put('/:id', async (req, res) => {
  const gastos = await readData();
  const index = gastos.findIndex(g => g.id === req.params.id);
  if (index === -1) {
    return res.sendStatus(404);
  }
  gastos[index] = { ...gastos[index], ...req.body };
  await writeData(gastos);
  res.json(gastos[index]);
});

router.delete('/:id', async (req, res) => {
  const gastos = await readData();
  const index = gastos.findIndex(g => g.id === req.params.id);
  if (index === -1) {
    return res.sendStatus(404);
  }
  const removed = gastos.splice(index, 1)[0];
  await writeData(gastos);
  res.json(removed);
});

module.exports = router; 