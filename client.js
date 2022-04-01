const dgram = require('dgram')
const EventEmitter = require('events').EventEmitter

const Client = function(params){
  let udp = this
  if(params) Object.fromEntries(Object.entries(params).map(([k, v]) => {
    return [udp[k] = v]
  }))
  udp.server = params.server
  udp.port = params.port
  udp.type = params.type

  let events = new EventEmitter()
  udp.on = events.on.bind(events)
  udp.once = events.once.bind(events)
  udp.off = events.off.bind(events)
  udp.emit = events.emit.bind(events)

  const client = dgram.createSocket('udp4')
  udp.close = client.close.bind(client)

  client.on('listening', () => {
    let address = client.address()
    udp.emit('listen', address)
  })

  let interval
  client.on('message', (data, info) => {
    if(data.toString()==='connect'){
      udp.emit('connect')
      clearInterval(interval)
      return
    }
    udp.emit('data', data)
  })

  interval = setInterval(()=>{
    client.send('connect', udp.port, udp.address, (error, bytes) => {
      if(error){
        console.log(error)
        udp.emit('error', error)
        client.close()
        process.exit(1)
      }
    })
  }, 500)

  udp.send = (data) => {
    data = Buffer.from(data)
    client.send(data, udp.port, udp.server, error => {
      if (error) {
        console.log(error)
        udp.emit('error', error)
        client.close()
      }
    })
  }
}

module.exports = Client