const { Console } = require('console');
const express = require('express');
const app = express();
const path = require('path')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// leer archivo movies.json
const fs = require('fs');
let rawdata = fs.readFileSync('./movies.json');
let movies = JSON.parse(rawdata);

// Leer archivo goodwords

let words = fs.readFileSync('goodwords.txt').toString().split(",");

console.log(words)
// variables

let timer = 30;

let PeliActual = [];

let card1 = 0;
let Listacard1 = [];

let card2 = 0;
let Listacard2 = [];


app.use(express.static('web'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/web/index.html');
});

NewRound();

setInterval(NewRound, 30000);
setInterval(countdown, 999);

io.on('connection', (socket) => {

    socket.username = '';

    socket.on('this movies', () => {
        socket.emit('Ronda actual', PeliActual[0], PeliActual[1]);
    })

    socket.on('disconnect', () => {

        if (socket.voto == 1) {
            card1--;
            let cambioArray = Listacard1.filter((item) => item !== socket.username);
            Listacard1 = cambioArray;
        } else if (socket.voto == 2) {
            card2--;
            let cambioArray = Listacard1.filter((item) => item !== socket.username);
            Listacard2 = cambioArray;
        }
    });


    socket.on('chat message', (msg) => {
        let result;
        for (let i in words) {
            if (msg.includes(words[i])) {
                result = msg.replace(words[i], "******");
                msg = result;
                socket.emit('alert', 3, words[i]);
            };
        };

        io.emit('chat message', socket.username + ': ' + msg);
    });

    socket.on('username', (input) => {
        socket.username = input;
        io.emit('new user', 2, socket.username);
    });


    socket.on('voting', (voto) => {
        if (voto == 1) {
            card1++;
            Listacard1.push(socket.username);
            socket.voto = 1;

            console.log(1 + "   " + socket.id);
            socket.emit('voted', 1, PeliActual[0].nombre);
        } else {
            card2++;
            Listacard2.push(socket.username);
            socket.voto = 2;

            console.log(2 + "   " + socket.id);
            socket.emit('voted', 1, PeliActual[1].nombre);
        };
    });
});

server.listen(3000, () => {
    console.log('listening on *:443');
});

// funciones

function RandomMovie() {

    let pelis = [];
    let lastmovie = 99;

    for (let i = 0; i < 2; i++) {
        let random = Math.floor(Math.random() * 27);

        if (random != lastmovie) {
            pelis[i] = movies.movies[random];
            lastmovie = random;
        } else if (random == lastmovie) {
            while (random == lastmovie) {
                random = Math.floor(Math.random() * 27);
            }
            pelis[i] = movies.movies[random];
        }

        PeliActual[i] = pelis[i];
    }
    io.emit('newmovie', pelis[0], pelis[1]);
}

function NewRound() {

    Ganador();

    card1 = 0;
    card2 = 0;

    Listacard1 = [];
    Listacard2 = [];

    RandomMovie();

};

function Ganador() {

    if (card1 > card2) {
        io.emit('Ganador', PeliActual[0], Listacard1)
    } else if (card2 > card1) {
        io.emit('Ganador', PeliActual[1], Listacard2)
    } else {
        io.emit('Ganador', 'Empate', '')
    };
};

function countdown() {
    timer--;

    if (timer <= 0) {
        timer = 30;
    };
    io.emit('timer', timer)
};
