var http = require('http')
var express = require('express')
var socketio = require('socket.io')
var app = express(server)
var server = http.Server(app)
var io = socketio(server)

io.on('connection',function(socket){
    socket.on('calculation_made',(data) => {
        console.log('calc ' + data)
        io.emit('calculation_made',data)
    })
})

server.listen(5000)