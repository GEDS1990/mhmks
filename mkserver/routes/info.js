var express = require('express');
var router = express.Router();

var infoDao = require('../dao/infoDao');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function (req, res, next) {
  console.log('info :' + JSON.stringify(req.body));
  if (req.body.command == "getstorearea") {
    console.log('getstorearea');
    infoDao.getStoreArea(req, res, next);
  } else if (req.body.command == "getstorebasic") {
    console.log('getstorebasic');
    infoDao.getStoreBasic(req, res, next);
  } else if (req.body.command == "getstorecontacts") {
    console.log('getstorecontacts');
    infoDao.getStoreContacts(req, res, next);
  } else if (req.body.command == "getstoredisplay") {
    console.log('getstoredisplay');
    infoDao.getStoreDisplay(req, res, next);
  } else if (req.body.command == "getproduct") {
    console.log('getproduct');
    infoDao.getProduct(req, res, next);
  } else if (req.body.command == "getproductprice") {
    console.log('getproductprice');
    infoDao.getProductPrice(req, res, next);
  } else if (req.body.command == "getproductstock") {
    console.log('getproductstock');
    infoDao.getProductStock(req, res, next);
  }
});

module.exports = router;
