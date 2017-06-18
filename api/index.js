var mongoose = require('mongoose');
var BandWidth = require('../models').BandWidth;
mongoose.Promise = global.Promise;

// 根据时间筛选带宽值列表
exports.index = function(req, res, next) {
  BandWidth.findOne(function(err, data) {
    if (err) {
      return next();
    }

    console.log('aa', data);
    res.json({
      code: 200,
      msg: 'success',
      data: data
    });
  });
};


exports.create = function(req, res, next) {
  var data = req.body;
  console.log(data.bandwidth);
  res.json({
    code: 200,
    msg: 'success'
  });
}
