const Client = require('../index').Client

let client = new Client({server: 'localhost', port: 30210, type: 'udp4'})

client.on('listen', data => {
  console.log('UDP Client Listening', data)
})

client.on('connect', ()=> {
  console.log('Connected')
})

// Simple chat app
client.on('data', data => {
  console.log(data.toString())
})
process.stdin.on('data', data => {
  client.send(data)
})

// Close the connection
//client.close()