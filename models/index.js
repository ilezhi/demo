const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/meizu', function(err) {
  if (err) {
    process.exit(1);
  }

  var bandwidthModel = mongoose.model('BandWidth');
  bandwidthModel.findOne(function(err, bw) {
    if (!bw) {
      var bandwidth = new bandwidthModel();
      bandwidth.bandwidth = 10;
      bandwidth.save();
    }
  })
});

require('./bandwidth');

exports.BandWidth = mongoose.model('BandWidth');
