const router = require('express').Router();

const collection = require('../db/collection');

// Route to get all keywords stored in the collection 

router.get('/search', (req, res) => {
    try {
      
        let results = [];
        results = collection.search();
        if(results){
        // respond with 200 and JSON =
        res.json(results);
    } else {
        res.status(500).json({ error: error.toString() });
    }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = {
    router
}