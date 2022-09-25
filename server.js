const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));
app.use(express.static("public/images"));

let rand = Math.floor(Math.random() * (75 - 1) + 1);

let numbers = [];

let shuffled_num_list = () => {
    for (let i = 1; i <= 75; i++) {
        numbers.push(i);
    }
    return shuffle_array(numbers);
};

let shuffle_array = (array) => {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
};

shuffled_num_list();

let users = [];

io.on("connection", (socket) => {
    socket.join("room1");

    setTimeout(() => {
        socket.on("set-username", function (nickname) {
            socket.nickname = nickname;
            users.push([socket.nickname, socket.id]);
            console.log("hello", nickname);
            // console.log(users[0]);
        });
    }, 1000);

    // let inter = setInterval(() => {
    setTimeout(() => {
        socket.emit("number", numbers[0]);
    }, 1000);

    // }, 10000);

    socket.on("bingo", (bingo) => {});

    socket.on;

    socket.in("room1").emit("connectToRoom", "You are in room1");
    // console.log("a user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});
