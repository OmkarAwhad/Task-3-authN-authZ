const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 4000

app.use(express.json())

const routes = require('./routes/user.routes')
app.use('/api/v1',routes)

require('./config/mongoose').connect()

app.listen(PORT, ()=> console.log(`Server running at PORT ${PORT}`))
