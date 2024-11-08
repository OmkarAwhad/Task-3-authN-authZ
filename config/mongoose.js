const mongoose = require('mongoose')
require('dotenv').config();

exports.connect = () => {
     mongoose.connect(process.env.DB_URL)
     .then(()=> console.log("DB Connected"))
     .catch((e) => {
          console.log("Error in DB connection");
          console.log(e);
          process.exit(1);
     })
}