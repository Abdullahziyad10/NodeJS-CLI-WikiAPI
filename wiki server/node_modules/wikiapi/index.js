// module.exports = Search;
const axios = require('axios');

// config file to hold the base url (and API key where applicable)
const config = require('./config.json');



const _api =  async (keyword) => {
  try{
    const response = await axios.get(`${config.url}`, {
      params: {
        action: "query",
        list: "search",
        origin: "*",
        format: "json",
        srsearch: keyword,
        sroffset: 50,
        srlimit: 50
      },
    });
    return response.data.query;
  }catch(error){
    return error;
  }
};

// function for searching by keyword. 

const _searchByKeyWord = async (keyword) => {
  try {
    const response = await _api(keyword);
    const  totalResults = response.searchinfo.totalhits;
    let _data;
    let _res = [];
     data = await response.search.map(({ title , pageid}) => {
      _data = {
        "id": pageid,
        "title": title
      }
      _res.push(_data)
     });
    return { _res , totalResults}
  } catch (error) {
    console.error(error);
  }

};

// RegExp to filter content
const removeExtraText = function (txt) {
  const uselessWordsArray = [
    "<",
    "/",
    "span",
    "class",
    "searchmatch",
    "</",
    ">",
    " ( ",
    ">)",
    "</span>",
    "<span>",
  ];

  const expStr = uselessWordsArray.join("|");
  return txt
    .replace(new RegExp("\\b(" + expStr + ")\\b", "gi"), " ")
    .replace(/\s{2,}/g, " ");
};


// function to get detial results from the id 
 const  _wikipediaApiSearchByID = async (id) => {
  try {
    let title;
    const response = await axios.get(`${config.url}`, {
      params: {
        action: "query",
        origin: "*",
        format: "json",
        pageids: id
      },
    });
    const res  = response.data.query.pages;
   
    for (const [key, value] of Object.entries(res)) {
      for (const [key1, value1] of Object.entries(value) ){
       
        if(key1 == 'title')
        title = value1;
      }
    }
    const _result  = await _api(title);

    const data = await _result.search.map(({ snippet }) => snippet);
    const size = await _result.search.map(({ size }) => size);
    const wordcount = await _result.search.map(({ wordcount }) => wordcount);
    const timestamp = await _result.search.map(({ timestamp }) => timestamp);
   
    let _size = size[2];
    let _wordcount = wordcount[2];
    let _timestamp = timestamp[2];
    const d1 = removeExtraText(data[2]);
  
    const _snippet = d1.replace(/[^a-zA-Z ]/g, "").replace(/  /g, "");
   
    return {_snippet ,_size ,_wordcount ,_timestamp  };
    
  } catch (error) {
    console.error(error);
  }
}


module.exports = {
  _searchByKeyWord,
  _wikipediaApiSearchByID
};
