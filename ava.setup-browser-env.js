const browserEnv = require('browser-env')
const tf = require('@tensorflow/tfjs-node')

browserEnv(['window', 'document', 'Image'], {resources: 'usable'})

// expose globals
global.tf = tf