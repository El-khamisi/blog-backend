const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const user = require('./services/user/user.routes');
const article = require('./services/article/article.routes');
const paper = require('./services/paper/paper.routes');
const video = require('./services/video/video.routes');
const category = require('./services/category/category.routes');
const serieses = require('./services/video_series/video_series.routes');
const Subscription = require('./services/subscription/subscription.routes');

module.exports = (app) => {
  // Middlewares

  /*        
      app.use(passport.initialize());
      app.use(passport.session());
      */

  // app.use(
  //   cors({
  //     origin: true,
  //     credentials: true,
  //   })
  // );
  app.use((req, res, next)=>{
    const allowedOrigins = ['http://localhost:3000', 'http://46.101.189.190'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
  })

  app.use(express.json());
  app.use(cookieParser());

  //Routers
  app.use(morgan('dev'));

  app.use(user);
  app.use(article);
  app.use(paper);
  app.use(video);
  app.use(category);
  app.use(serieses);
  app.use(Subscription);
};
