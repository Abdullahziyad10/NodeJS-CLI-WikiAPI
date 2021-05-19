const cors = require('cors');
const express = require('express');

const search = require('./search.js');
const history = require('./history.js')

const app = express();
const port = 8888;

// apply our application level middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    const { headers, method, url } = req;

    console.log(`METHOD: ${method} ${url} from user-agent ${headers['user-agent']}`, '\n');

    res.header('Cache-control', 'no-store');
    next();
});

// use the prefix /search
// add the search router to the express application
app.use('/search', search);

// // use the prefix /history
// // add the history router to the express application
app.use('/history', history.router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
