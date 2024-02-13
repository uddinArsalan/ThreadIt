require("dotenv").config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors')

const app = express();
const PORT = process.env.port || 3001;

app.use(cors());

app.get('/proxy/:hashnodeLink', async (req, res) => {
  try {
    const hashnodeLink = req.params.hashnodeLink;
    const response = await fetch(hashnodeLink);
    const data = await response.text();
    // console.log(data)
    res.send(data);
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).send('Error while fetching data');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
