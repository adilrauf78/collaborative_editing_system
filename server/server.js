// server.js
const express = require('express');
const colors = require('colors');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const conncetDatabase = require('./config/database');
const multer = require('multer');
const upload = multer();

dotenv.config();

const app = express();

// Connect to DB only if not testing
if (process.env.NODE_ENV !== 'test') {
  conncetDatabase();
}

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// routes
app.use('/api/v1/auth', upload.none(), require('./routes/authRoutes'));
app.use('/api/v1/', upload.none(), require('./routes/userRoutes'));
app.use("/api/v1/documents", require('./routes/documentRoutes'));
app.use("/api/v1/version", require('./routes/versionRoutes'));

app.get('/test1', (req, res) => {
    res.status(200).send('Server is working!');
});

// HTTP server create
if (process.env.NODE_ENV !== 'test') {
  const http = require("http");
  const server = http.createServer(app);

  // SOCKET.IO load
  const io = require("socket.io")(server, {
    cors: { origin: "*" },
  });

  // socket.js ko call
  require("./socket/socket")(io);

  const PORT = process.env.PORT || 8000;
  server.listen(PORT, () => {
    console.log(`Server is Working on ${PORT}`.bgMagenta);
  });
}

module.exports = app; // ✅ export app for tests
