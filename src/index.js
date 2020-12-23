const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const path = require('path')

const app = express();

app.use(cors());
app.use(express.static(path.resolve(__dirname, ".." , "temp")))
app.use(express.json( ));
app.use(routes);
app.listen(process.env.PORT || 3333);
