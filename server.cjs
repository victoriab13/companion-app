const express = require('express');
const cors = require('cors');
// Correct way to use node-fetch v3 in CommonJS:
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variables for security
const API_KEY = process.env.API_KEY;
const AGENT_ID = process.env.AGENT_ID;

app.post('/api/vapi', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch('https://api.vapi.ai/v1/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        agent_id: AGENT_ID,
        query: message
      })
    });
    const data = await response.json();
    console.log('Vapi.ai response:', data); // Log the full response for debugging
    res.json(data);
  } catch (err) {
    console.error('Error in /api/vapi:', err); // Log the error for debugging
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));