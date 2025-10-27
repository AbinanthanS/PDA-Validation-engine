const express = require('express');
const validateRoute = require('./Routes/validate.js');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

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