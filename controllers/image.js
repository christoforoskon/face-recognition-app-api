const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "32efda695ffd48c299dc071f0e387f50",
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data)
    })
    .catch(err => res.status(400).json('unable to work with API'))
}



const handleImage = (req, res, db) => {
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
}

// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// }

module.exports = {
  handleImage,
  handleApiCall
}