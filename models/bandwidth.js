var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BWSchema = new Schema({
  date: { type: Date, default: Date.now },
  bandwidth: { type: Number, default: 0},
});

BWSchema.index({date: 1});

mongoose.model('BandWidth', BWSchema);
