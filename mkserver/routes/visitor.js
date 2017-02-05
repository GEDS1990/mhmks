var express = require('express');
var router = express.Router();

var visitorDao = require('../dao/visitorDao');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function (req, res, next) {
  console.log('visitor :' + JSON.stringify(req.body));
  if (req.body.command == "getpath") {
    console.log('getpath');
    visitorDao.getPath(req, res, next);
  } else if (req.body.command == "getpathdetail") {
    console.log('getpathdetail');
    visitorDao.getPathDetail(req, res, next);
  }
});

module.exports = router;