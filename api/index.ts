const express = require('express');
const router = express.Router();



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello from Dummy API');
});

const PORT = 5003;
app.listen(PORT, () => {
    console.log(`Dummy API is running on http://localhost:${PORT}`);
});

