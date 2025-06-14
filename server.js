const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/morning/approve', (req, res) => {
  const newEntry = req.body;

  if (!newEntry.serviceId || !newEntry.user || !newEntry.status) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  fs.readFile('data.json', 'utf8', (err, data) => {
    const json = data ? JSON.parse(data) : [];
    json.push({ ...newEntry, time: new Date().toISOString() });

    fs.writeFile('data.json', JSON.stringify(json, null, 2), (err) => {
      if (err) {
        console.error('Error saving file:', err);
        return res.status(500).json({ error: 'Failed to save data' });
      }
      res.json({ message: 'saved' });
    });
  });
});

app.get('/data.json', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read file' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});
app.get('/', (req, res) => {
  res.send('API is running');
}) 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
