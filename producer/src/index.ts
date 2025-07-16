import { Channel, connect } from "amqplib"


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

type RabbitMessage = {
    message: string
}