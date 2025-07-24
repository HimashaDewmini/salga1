const express = require('express');
const cors = require('cors');

// routers
const demoRouter = require('./routers/demoRouter')

const app = express();
const port = 3000;

app.use(cors(
    {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static file serving
app.use('/uploads', express.static('./uploads'));

// routes
app.use('/api', demoRouter);

app.listen(port,()=>{
    console.log(`Server running on ${port}`);
})
