const path = require('path');
const express = require('express');
const gastosRouter = require('./routes/gastos');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/gastos', gastosRouter);

const distPath = path.resolve(__dirname, '../frontend');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT); 