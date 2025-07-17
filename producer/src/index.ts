import { Channel, connect } from "amqplib"


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


const initExchanges = async () => {
    try {
        await channel.assertExchange('ex.hash', 'x-modulus-hash')
    } catch (error) {
        console.error('error on create exchanges', error)
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

initConnection().then(() => {
    initExchanges().then(async () => {
        var numbers: string [] = [
            '558700011000',
            '5581995020101',
            '551134210122',
            '5581994326173',
            '5581984316174',
            '551134210125',
            '5581995029086',
            '5599992056087',
            '5511993019488',
            '5521993321009',
            'drikons@gmail.com',
            'ans3@cin.ufpe.br',
            '887123',
            '7712345'
        ]

        for (var index = 0; index < 200; index++) {
            const number = numbers[index % numbers.length]
            console.log(`Enviando mensagem para: ${number}`)
            const message = JSON.stringify({ message: `Mensagem enviada para o number: ${number} - ${new Date(Date.now()).toISOString()}`})
            channel.publish('ex.hash', number, Buffer.from(message))
            await sleep(1500)
        }

        console.log('Finishing....')
    })
})

type RabbitMessage = {
    message: string
}