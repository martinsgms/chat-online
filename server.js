const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (request, response) => {
    response.render('index.html');
});

let messages = [];
let users = [];

io.on('connection', socket => {
    console.log(`socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);
    socket.emit('usersOnline', users);
    
    socket.on('newUser', user => {
        users.push(user);
        socket.broadcast.emit('newUserOnline', user);
    })

    socket.on('sendMessage', message => {
        messages.push(message);
        socket.broadcast.emit('receivedMessage', message);
    })

    socket.on('writing', writer => {
        let whoIsWriting = `${writer} está digitando...`;
        socket.broadcast.emit('someoneWriting', whoIsWriting);
    })

    socket.on('endWriting', () => {
        socket.broadcast.emit('someoneEndWriting');
    })

})

server.listen(3000);