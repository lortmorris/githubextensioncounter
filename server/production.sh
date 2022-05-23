#!/bin/sh
export NODE_ENV="production"
export DEBUG="github*"
export MONGODB_URL="mongodb://127.0.0.1"
export MONGODB_NAME="githubextensionscounter"
node app.js
