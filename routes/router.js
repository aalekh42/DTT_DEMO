const express = require('express');
const path = require('path');
const { getDailyData, 
        getMpanData, 
        getMonthlyData, 
        getWeeklyData, 
        deleteCollections, 
        putDaily,
        postTranformData,
        getUpdatedMonthly,
        invalidRoute
      } = require('../controllers/controller');
const { upload } = require('../utils/genric');
const router = express.Router();

router.get('/', (req,res) => {res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));})
router.get('/getDaily', getDailyData);
router.get('/getMpans', getMpanData);
router.post('/postTransformData', upload.array('File'), postTranformData);
router.get('/getMonthly', getMonthlyData);
router.get('/getWeekly', getWeeklyData);
router.get('/getUpdMonthly', getUpdatedMonthly);
router.put('/editDaily', putDaily);
router.delete('/deleteUserData', deleteCollections);
router.all('*', invalidRoute);

module.exports = router;
