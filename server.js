const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: "pg",
    connection: {
        host: "127.0.0.1",
        port: 5432,
        user: "postgres",
        password: "admin",
        database: "face-recognition",
    },
});

db.select("*").from("users").then(data => {
    console.log(data);
});

const app = express();

app.use(express.json());
app.use(cors());

const database = {
    users: [{
        id: "123",
        name: "John",
        email: "john@gmail.com",
        password: "cookies",
        entries: 0,
        joined: new Date(),
    },
    {
        id: "124",
        name: "Sally",
        email: "sally@gmail.com",
        password: "bananas",
        entries: 0,
        joined: new Date(),
    },
    ],
    login: [{
        id: "987",
        hash: "",
        email: "john@gmail.com",
    },],
};

app.get("/", (req, res) => {
    res.send(database.users);
});

//dependency injection
app.post("/signin", (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get("/profile/:id", (req, res) => { handleProfileGet(req, res, db) });
app.put("/image", (req, res) => { image.handleImage(req, res, db) });
app.post("/imageUrl", (req, res) => { image.handleApiCall(req, res) });


//bash:   DATABASE_URL=3000 node server.js
// const DATABASE_URL = process.env.DATABASE_URL;
// app.listen(PORT, () => {
//     console.log(`app is running on port ${DATABASE_URL}`);
// });


app.listen(3000, () => {
    console.log("app is running on port 3000");
});

/*

/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = users

*/