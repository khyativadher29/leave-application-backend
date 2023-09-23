const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  leaveType: {
    type: String,
    enum: ['casual', 'sick', 'emergency'], 
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
 reason:{
    type:String
 },
 isApprove:{
    type:Boolean
 }
});

module.exports = mongoose.model('Leave', leaveSchema);
