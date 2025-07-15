import { Channel, connect, Connection } from 'amqplib'
import express from 'express'

let channel: Channel;
const messages: RabbitMessage[] = []


const initConnection = async () => {
    try {
        const conn = await connect({
            hostname: 'localhost',
            username: 'guest',
            password: 'guest',
            port: 5672
        })

        channel = await conn.createChannel()
    } catch (err) {
        console.error('Error on connect amqp', err)
    }
}

const consumeEvents = (data: any) => {
    try {
        console.log('Sou o consumidor dois e recebi: \n')
        const msg: RabbitMessage = JSON.parse(data.content.toString())
        console.log(msg)
        messages.push(msg)
        channel.ack(data)
    } catch (error) {
        console.error("Erro ao consumir evento")
        console.error(error)
    }
}

const initQueues = async () => {
    await channel.assertQueue('q1.events.client2')
}

const app = express()

app.use('/', (req, res) => {
    res.send(messages)
})

app.listen(5005, async () => {
    console.log('listenning on 5005')
    await initConnection()
    await channel.consume('q.events.client2', consumeEvents);
})

type RabbitMessage = {
    message: string
}