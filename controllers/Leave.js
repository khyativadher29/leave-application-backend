const mongoose= require('mongoose')
const Leave = require('../models/LeaveModel')
const addLeave = async (req, res) => {
    try {
        const { _id } = req.user;
        const { leaveType, startDate, endDate, reason } = req.body;
        const addLeave = await new Leave({
            user: _id,
            leaveType: leaveType,
            startDate: startDate,
            endDate: endDate,
            reason: reason,
            isApprove: false
        });
        await addLeave.save();
        res.status(200).json({
            message: "added succesfully"
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const fetchLeavesWithUserData = async (req, res) => {
    try {
        const leavesWithUserData = await Leave.aggregate([
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'user',
                    'foreignField': '_id',
                    'as': 'userData'
                }
            }, {
                '$unwind': {
                    'path': '$userData',
                    'preserveNullAndEmptyArrays': false
                }
            }
        ]);
        if (leavesWithUserData != null) {
            res.status(200).send(leavesWithUserData);
        }
    } catch (error) {
        console.error(error);
    }
};

const approveLeave =async(req,res)=>{
    try {
        const leaveId = req.body.leaveId;
        console.log(leaveId);
        const updatedLeave = await Leave.findByIdAndUpdate(
          leaveId,
          { isApprove: true },
          { new: true } 
        );
        if (!updatedLeave) {
          return res.status(404).json({ message: 'Leave not found' });
        }
        res.status(200).json({ message: 'Leave approved', leave: updatedLeave });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

const getLeave=async(req, res)=>{
try{
    const userId= req.body.userId;
    const id= new mongoose.Types.ObjectId(userId);
    const leaveData=await Leave.aggregate([
        {
          '$match': {
            'user': id
          }
        }, {
          '$group': {
            '_id': '$leaveType', 
            'leaveType': {
              '$first': '$leaveType'
            }, 
            'total': {
              '$sum': {
                '$cond': [
                  {
                    '$eq': [
                      '$leaveType', '$leaveType'
                    ]
                  }, 12, 0
                ]
              }
            }, 
            'applied': {
              '$sum': {
                '$cond': [
                  {
                    '$eq': [
                      '$isApprove', true
                    ]
                  }, 1, 0
                ]
              }
            }
          }
        }, {
          '$project': {
            '_id': 0, 
            'leaveType': 1, 
            'total': 1, 
            'applied': 1, 
            'available': {
              '$subtract': [
                '$total', '$applied'
              ]
            }
          }
        }, {
          '$match': {
            'total': {
              '$gt': 0
            }
          }
        }
      ]);
      if(leaveData!=null){
        res.status(200).send(leaveData)
      }
}catch(error){
    console.log(error)
}
}
module.exports = {
    addLeave,
    fetchLeavesWithUserData,
    approveLeave,
    getLeave
}