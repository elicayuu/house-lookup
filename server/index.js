
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rp = require('request-promise');
const parsePage = require('./util/parsePage');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.post('/api', (req, res) => {
  if (!req.body || !req.body.url) {
    return;
  }

  rp(req.body.url)
    .then(html => {
      const data = parsePage(html);
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.json(null);
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

