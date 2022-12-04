const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }

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
  // if (
  //     req.body.email === database.users[0].email &&
  //     req.body.password === database.users[0].password
  // ) {
  //     res.json(database.users[0]);
  // } else {
  //     res.status(400).json("error logging in");
  // }

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            console.log(user);
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("Unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
};

module.exports = {
  handleSignin: handleSignin,
};