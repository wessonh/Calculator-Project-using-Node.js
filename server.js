const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware
app.use(helmet());

// Use Morgan middleware with the Winston stream
app.use(morgan('combined', { stream: logger.stream }));

app.use(express.static('public', { 'extensions': ['html', 'htm', 'css'] }));
app.use(express.urlencoded({ extended: true }));

// routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/views/404.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});