const router = require('express').Router();
const wikiapi = require('wikiapi');
const collection = require('../db/collection');


// Get endpoint for Searching by keyword
router.get('/',async (req,res)=>{
    try{

        // const { keyword } = req.params;
        const keyword = req.query.keyword;
        const data = await  wikiapi._searchByKeyWord(keyword);

        const TotalResults = data.totalResults;
    // Saves keyword, timestamp and number of matching results in local file
        const body = req.body;
        body.created = Date.now();
        collection.add({keyword,"searchedAt": Date.now(),TotalResults});
        res.json({ data});
    } catch(error){
        res.status(500).json({ error: error.toString() });
    }
});



router.post('/', async (req,res)=>{
    try{
        const { id } = req.body;
        const data = await  wikiapi._wikipediaApiSearchByID(id);
        res.json(data);
    } catch(error){
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;