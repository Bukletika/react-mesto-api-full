const cors = require('cors');

const corsOptions = {
  origin: ['http://bukletika.nomoredomains.club', 'http://localhost:3000'],
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);