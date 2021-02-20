import express, { Response } from 'express'
import * as bodyparser from 'body-parser'

interface IncomingMessageRequestPayload {
    user: string
    message: string
}

interface IncomingMessageResponsePayload {
    user: string
    message: string
    time: string
}

const app = express()
app.use(bodyparser.json())

let eventStreamRes: Response

const writeJson = (payloadObject: any, res: Response) => {
    res.write('data: {\n')
    Object.keys(payloadObject).forEach(key => {
        res.write(`data: "${key}": "${payloadObject[key]}"`)
    })
    res.write('data: }\\n\\n')
}

app.get('/message', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })
    eventStreamRes = res
})

app.post('/message', (req, res) => {
    const payload: IncomingMessageRequestPayload = req.body
    const { user, message } = payload
    const responsePayload: IncomingMessageResponsePayload = {
        user,
        message,
        time: new Date().toDateString(),
    }

    if (eventStreamRes !== undefined) {
        writeJson(responsePayload, eventStreamRes)
    }
})

app.listen('3030', () => {
    console.log('server start at port 3030')
})
