// Copyright (c) Nodezoo Ltd. USED UNDER LICENSE.

const Path = require('path')

const { EnvLambda } = require('@voxgig/build')

// TODO: should output to src as ts file
const folder = Path.join(__dirname,'..','src','handler')
const envFolder = Path.join('..','env','lambda')

module.exports = async function(model, build) {
  EnvLambda.srv_handler(model, {
    folder,
    start: 'lambda',
    env: {
      folder: envFolder,
    },
    lang: 'ts',
  })
}
