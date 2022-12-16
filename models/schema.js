const mongoose = require('mongoose');

const halfHourlySchema = new mongoose.Schema({
  cc: {
    type: String,
  },
  day: {
    type: String
  },
  my: {
    type: String
  },
  date: {
    type: String
  },
  m: {
    type: String
  },
  y: {
    type: String
  },
  tv: {
    type: Number
  },
  pv: {
    type: Number
  },
  dv: {
    type: Number
  },
  wv: {
    type: Number
  },
  opv: {
    type: Number
  },
  wn: {
    type: Number
  },
  du: {
    type: String,
  },
  createdAt: {
    type: Date,
    expires: '180m'
  }
});

const mpanSchema = new mongoose.Schema({
  du: {
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  isChecked: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    expires: '180m'
  }
});

const optiSchema = new mongoose.Schema({
  du: {
    type: String,
  },
  cc: {
    type: String
  },
  y: {
    type: String
  },
  m: {
    type: String
  },
  pvi: {
    type: [Number]
  },
  dvi: {
    type: [Number]
  },
  opvi: {
    type: [Number]
  },
  wvi: {
    type: [Number]
  },
  createdAt: {
    type: Date,
    expires: '180m'
  }
});

// mpanSchema.index( { "expireAt": 1 }, { expireAfterSeconds: 30 } );
const Mpan = mongoose.model('Mpan',mpanSchema);
const Daily = mongoose.model('Daily',halfHourlySchema);
const OptiMap = mongoose.model('OptiMap',optiSchema);


module.exports = {
  Mpan,
  Daily,
  OptiMap,
};