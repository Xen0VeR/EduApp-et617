const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const clickstreamPath = path.join(__dirname, 'clickstream.csv');
fs.ensureFileSync(clickstreamPath);

// ensure header row exists
const header = 'timestamp,username,action,details,client_ip\n';
const stats = fs.statSync(clickstreamPath);
if (stats.size === 0) fs.appendFileSync(clickstreamPath, header);

function logClickstream(data, req) {
  const timestamp = new Date().toISOString();
  const username = (data.user || data.username || 'anonymous').toString().replace(/,/g, ' ');
  const action = (data.action || data.type || '').toString().replace(/,/g, ' ');
  const details = (data.details || data.payload || '').toString().replace(/,/g, ' ');
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const row = `${timestamp},${username},${action},${details},${ip}\n`;
  fs.appendFileSync(clickstreamPath, row);
}

let users = []; // simple in-memory user store (not for production)

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'username and password required' });
  if (users.find(u => u.username === username)) return res.status(400).json({ success: false, message: 'user exists' });
  users.push({ username, password });
  logClickstream({ user: username, action: 'REGISTER', details: 'User registered' }, req);
  res.json({ success: true });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username && u.password === password)) {
    logClickstream({ user: username, action: 'LOGIN', details: 'User logged in' }, req);
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post('/track', (req, res) => {
  try {
    logClickstream(req.body, req);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error' });
  }
});
// Endpoint to view clickstream logs
app.get("/view-logs", (req, res) => {
  const filePath = path.join(__dirname, "clickstream.csv");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading log file.");
    res.type("text/plain").send(data);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));
