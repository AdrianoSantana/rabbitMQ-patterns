import { Channel, connect, Connection } from 'amqplib'
import express from 'express'

let channel: Channel;
const messages: RabbitMessage[] = []

const initConnection = async () => {
    try {
        const conn = await connect({
            hostname: 'rabbitmq-estudos',
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
        console.log('Sou o consumidor um e recebi: \n')
        const msg: RabbitMessage = JSON.parse(data.content.toString())
        console.log(msg)
        messages.push(msg)
        channel.ack(data)
    } catch (error) {
        console.error("Erro ao consumir evento")
        console.error(error)
    }
}

const app = express()

app.use('/', (req, res) => {
    res.send(messages)
})

app.listen(5004, async () => {
    console.log('listenning on 5004')
    await initConnection()
    await channel.consume('q.events.client1', consumeEvents);
})

type RabbitMessage = {
    message: string
}