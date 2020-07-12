const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');

const app = express();


mongoose.connect(config.database, {useMongoClient: true}, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to the database');
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const teacherRoutes = require('./routes/teacher');
const courseSearchRoutes = require('./routes/course-search');

app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/search', courseSearchRoutes);


app.listen(config.port, err => {
  console.log('Magic happens on port awesome ' + config.port);
});
