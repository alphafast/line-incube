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
app.use(express.static('public'))
app.use(bodyparser.json())

let messagesStore: IncomingMessageResponsePayload[] = []
let eventStreamResponses: Response[] = []

const writeJson = (payloadObject: any, res: Response) => {
    res.write('data: ' + JSON.stringify(payloadObject, null) + '\n\n')
}

app.get('/message', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })
    messagesStore.forEach(message => {
        writeJson(message, res)
    })
    eventStreamResponses.push(res)
})

app.post('/message', (req, res) => {
    const payload: IncomingMessageRequestPayload = req.body
    const { user, message } = payload
    const responsePayload: IncomingMessageResponsePayload = {
        user,
        message,
        time: new Date().toLocaleTimeString(),
    }
    messagesStore.push(responsePayload)

    if (eventStreamResponses.length > 0) {
        eventStreamResponses.forEach( eventStreamRes => {
            writeJson(responsePayload, eventStreamRes)
        })
    }

    res.send()
})

app.listen('3030', () => {
    console.log('server start at port 3030')
})
