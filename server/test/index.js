import request from 'supertest';

import MyApp from '../app';

const apiPath = '/core';
const doSearch = path => `${apiPath}${path}?page=1&limit=30`;

const runTest = up => () => {
  request(up.app)
    .get(doSearch('/accounts'))
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if (err) throw err;
    });
};

const initTest = up => setTimeout(runTest(up), 1000);

MyApp(initTest);
