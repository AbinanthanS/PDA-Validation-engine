const express = require('express');
const bodyparser = require('body-parser');
const validateRoute = require('./routes/validate');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyparser.json());

app.use('/validate', validateRoute);







//to check if body parser is working
/*
app.post('/data',(req,res) => {
  console.log(req.body);
  res.send("data received")
});
*/

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;