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

let eventStreamReses: Response[] = []

const writeJson = (payloadObject: any, res: Response) => {
    res.write('data: {\n')
    Object.keys(payloadObject).forEach(key => {
        res.write(`data: "${key}": "${payloadObject[key]}"`)
    })
    res.write('data: }\\n\\n')
}

app.get('/message', (req, res) => {
    console.log('ggg')
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })
    eventStreamReses.push(res)
})

app.post('/message', (req, res) => {
    const payload: IncomingMessageRequestPayload = req.body
    const { user, message } = payload
    const responsePayload: IncomingMessageResponsePayload = {
        user,
        message,
        time: new Date().toDateString(),
    }

    if (eventStreamReses.length > 0) {
        eventStreamReses.forEach( eventStreamRes => {
            writeJson(responsePayload, eventStreamRes)
        })
    }

    res.send()
})

app.listen('3030', () => {
    console.log('server start at port 3030')
})
