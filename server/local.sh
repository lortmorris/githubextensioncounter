#!/bin/sh
export NODE_ENV=""
export DEBUG="*"
export MONGODB_URL="mongodb://127.0.0.1"
export MONGODB_NAME="githubextensionscounter"

nodemon .
