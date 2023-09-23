const express=require('express');
const router= express.Router();
const authenticateUser= require('../middleware/authenticationUser');
const { addLeave, fetchLeavesWithUserData, approveLeave, getLeave } = require('../controllers/Leave');

router.post('/addLeave',authenticateUser,addLeave);
router.get('/getLeaves',fetchLeavesWithUserData)
router.put('/approveLeave',approveLeave)
router.post('/getUserLeave',getLeave)
module.exports= router;