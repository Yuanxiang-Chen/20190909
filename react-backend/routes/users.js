var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("in");
  $.getJSON('/data/lda$5$2018@sjyj.json', data => {
    res.json(data);
    console.log(data);
  });
});

module.exports = router;
