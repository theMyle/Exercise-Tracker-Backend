const cors = require('cors');
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

// bind middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);

app.get('/', (req, res) => { res.sendFile(__dirname + '/views/index.html') });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on: PORT ${listener.address().port}`)
})
