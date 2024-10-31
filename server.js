require('dotenv').config();

const express = require('express');
const app = express();
const router = require('./routes/index');
const morgan = require('morgan');
const passport = require('./lib/passport');
const cors = require('cors');
const swaggerJSON = require('./swagger.json')
const swaggerUI = require('swagger-ui-express');

const { PORT = 5000 } = process.env;

app.use(cors({ origin: ['http://localhost:5000'] }));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON));

app.use(morgan('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

module.exports = app;