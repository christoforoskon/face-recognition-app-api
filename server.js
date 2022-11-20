const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

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

app.post("/signin", (req, res) => {
    bcrypt.compare(
        "apples",
        "$2a$10$Ie7FfpcV4a6RHw5LlxL5g.KxnqIVR9BPL8PbxjKIdNRWMKfDbMG6S",
        function (err, res) {
            // res == true
            console.log("first guess", res);
        }
    );
    bcrypt.compare(
        "veggies",
        "$2a$10$Ie7FfpcV4a6RHw5LlxL5g.KxnqIVR9BPL8PbxjKIdNRWMKfDbMG6S",
        function (err, res) {
            // res == true
            console.log("second guess", res);
        }
    );
    if (
        req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password
    ) {
        res.json(database.users[0]);
    } else {
        res.status(400).json("error logging in");
    }
});

app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash);
    // });

    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        }).then(user => {
            res.json(user[0]);
        })
        .catch(err => {
            res.status(400).json('Unable to register')
        })

    // database.users.push({
    //     id: "125",
    //     name: name,
    //     email: email,
    //     entries: 0,
    //     joined: new Date(),
    // });
    // res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    // let found = false;
    db.select('*').from('users').where({ id }).then(user => {
        // console.log(user[0]);
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json('Error getting the user');
        }
    })
        .catch(err => res.status(400).json('Not Found!'))
    // database.users.forEach((user) => {
    //     if (user.id === id) {
    //         found = true;
    //         return res.json(user);
    //     }
    // });
    // if (!found) {
    //     res.status(404).json("Not found!");
    // }
});

app.put("/image", (req, res) => {
    const { id } = req.body;

    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('Unable to get count.'))

    // let found = false;
    // database.users.forEach((user) => {
    //     if (user.id === id) {
    //         found = true;
    //         user.entries++;
    //         return res.json(user.entries);
    //     }
    // });
    // if (!found) {
    //     res.status(404).json("Not found!");
    // }
});

// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
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