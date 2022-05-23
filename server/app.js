const http = require('http');
const express = require('express');
const path = require('path');
const config = require('config');
const up = require('universal-pattern');
const bodyParser = require('body-parser');
const debug = require('debug')('microservice-core');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const lodash = require('lodash');
const helmet = require('helmet');
const vgMongo = require('vg-mongo');

const hooks = require('./hooks');
const controllers = require('./controllers');
const Boot = require('./boot');

const port = config.get('publicport') !== 80 ? `:${config.get('publicport')}` : '';
const app = express();
const server = http.createServer(app);

let db = null;

db = vgMongo(process.env.MONGODB_URL, process.env.MONGODB_NAME);

app.use(express.json({ limit: 10485760 }));
app.use(express.static('assets'));

app.use(helmet({
  noSniff: false,
}));

const Notify = async (action, from = 0, to, message) => {
  debug('notify called: ', action, from, to, message);
  return new Promise((resolve) => {
    redisClient.publish('notifications', JSON.stringify({
      action,
      from,
      to,
      data: message,
    }), resolve);
  });
};

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: false }));
app.use(bodyParser.text());

app.use(cookieParser());
app.use(morgan('dev'));

app.disable('view cache');

app.use((req, res, next) => {
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range, apikey, x-access-token');
  res.header('Content-Security-Policy', 'default-src \'self\' data: gap: https://ssl.gstatic.com \'unsafe-eval\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; media-src *; img-src \'self\' data: content:;');
  if (req.method === 'OPTIONS') return res.sendStatus(200);

  if (req.headers && req.headers['x-forwarded-for']) {
    const parts = req.headers['x-forwarded-for'].split(',');
    req.realip = parts.shift();
  } else {
    req.realip = req.ip;
  }
  return next();
});


app.use((req, res, next) => {
  const toSave = {
    method: req.method,
    path: req.url,
    body: {
      ...req.body,
    },
    query: {
      ...req.query,
    },
    added: new Date(),
    ip: req.realip,
    headers: req.headers,
  };

  if (toSave.body && toSave.body.password) {
    delete toSave.body.password;
  }

  if (req.userData) {
    toSave.user = {
      _id: req.userData._id,
      email: req.userData.email,
    };
  }

  if (db) db.auditlog.asyncInsert(toSave);
  next();
});

const MyApp = (cb) => {
  up(app, {
    swagger: {
      baseDoc: config.get('basePath'),
      host: `${config.get('host')}${port}`,
      folder: path.join(process.cwd(), 'swagger'),
      info: {
        version: 10.0,
        title: 'Github Extension Counter',
        termsOfService: 'https://somedomain.com/terms-conditions/',
        contact: {
          email: 'info@github.com',
        },
        license: {
          name: 'Apache License',
          url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
        },
      },
    },
    compress: true,
    cors: true,
    production: process.env.NODE_ENV === 'production',
    database: {
      uri: process.env.MONGODB_URL,
      name: process.env.MONGODB_NAME,
    },

    routeController: (req, res, next, props) => {
      req.endpoint = {
        protected: props['x-swagger-protected'],
        protectedLevel: props['x-swagger-protected-level'],
        publicFields: props['x-swagger-protected-public-fields'],
        skipFields: props['x-swagger-skip-fields'],
      };

      if (props['x-swagger-protected']) {
        if (!req.userData) {
          return res.end('Invalid access token');
        }

        if (req.userData.level < parseInt(props['x-swagger-protected-level'], 10)) {
          return res.end('Invalid userLevel');
        }
      }

      if (props['x-swagger-update-protected-level']) {
        let dale = true;
        const protectedProps = props['x-swagger-update-protected-level'];
        if (req.swagger.params?.modeldata?.value) {
          Object.keys(req.swagger.params.modeldata.value).forEach((key) => {
            if (protectedProps[key]) {
              if (req.userData.level < protectedProps[key]) {
                dale = false;
              }
            }
          });
        }
        if (!dale) return res.status(500).end('Invalid user level');
      }

      return next();
    },
  })
    .then((upInstance) => {

      upInstance.Notify = Notify;
      upInstance.config = config;
      hooks(upInstance);
      upInstance.controllers = controllers(upInstance);
      cb(upInstance);

      Boot(upInstance);
      return Promise.resolve();
    })
    .catch(err => console.error('Error initializing ', err));
};

if (require.main === module) {
  console.info('is main module');
  MyApp(() => server.listen(config.listenport, () => console.info(`listen *:${config.listenport}`)));
}

module.exports = MyApp;
