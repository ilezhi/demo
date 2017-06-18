var express = require('express');
var router = express.Router();
var api = require('../api');

router.get('/bandwidth', api.index);

router.post('/create', api.create);


module.exports = router;
