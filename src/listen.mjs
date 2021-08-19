import express from 'express'
import {logger} from './logger.mjs'
import {start} from './service.mjs'

const app = express()
const APP_PORT = 8080
const port = process.env.PORT || APP_PORT;

// app.use(express.static('temp')) // Temporary files
app.use(express.static('public')) // Static files
app.use(express.json()) // Body Parser. Useful for POST requests.

start(app) // Start Services
app.listen(port) // Accept client requests

logger.info(`Listening on ${port}`)