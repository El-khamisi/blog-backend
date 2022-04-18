const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const user = require('./services/user/user.routes');
const article = require('./services/article/article.routes');
const paper = require('./services/paper/paper.routes');
const video = require('./services/video/video.routes');
const category = require('./services/category/category.routes');

module.exports = (app) => {
  // Middlewares

  /*        
      app.use(passport.initialize());
      app.use(passport.session());
      */

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  //Routers
  app.use(morgan('dev'));

  app.use(user);
  app.use(article);
  app.use(paper);
  app.use(video);
  app.use(category);
};
