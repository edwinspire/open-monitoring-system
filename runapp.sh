#!/bin/sh
/bin/node --max-old-space-size=8192 -r dotenv/config __sapper__/build
