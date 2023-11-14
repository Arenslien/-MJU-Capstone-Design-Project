console.log("[app.js is started]");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

require('dotenv').config();

const app = express();

app.use(morgan("combined"));
app.use(express.json()); // Body-Parser 대용, Express에 body-parser가 내장됨.
app.use(cors());

// Swagger Setting
const { swaggerUI, swaggerSpec } = require("../config/swagger.js");

app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// MySQL Initial Setting with Sequelize.
const { sequelize } = require('../models/index.js');
sequelize.sync({ forc: false })
  .then(() => {
    console.log('[SUCCESS] Database Connected.');
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT;
const BASE_URI = process.env.BASE_URI;

// GET
app.use('/', express.static(path.join(__dirname, '../../client/dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
})

// routes
// require("../routes/auth.routes.js")(BASE_URI, app)
require("../routes/user.routes.js")(BASE_URI, app)

app.get(BASE_URI + 'auth/login', (req, res) => {
    console.log("[GET] auth/login : START");
    res.send('[200] Just A Moment');

    console.log("[GET] auth/login : END");
});

app.listen(port, () => console.log(`Listening on port ${port}`));