import express, {} from 'express'
import * as bodyparser from 'body-parser'

const app = express()
app.use(bodyparser.json())

app.post('/message', (req, res) => {
    //
})

app.get('/message', (req, res) => {
    //
})

app.listen('3030', () => {
    console.log('server start at port 3030')
})
