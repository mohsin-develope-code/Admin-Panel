const express = require('express');
const { handleAdmin, handleAuthentication, handleGetAllQuestion, handleDeleteQuestion, handleUpdate, handleLogout } = require('../Controller/AdminController');
const checkAuth = require('../Middleware/checkAuth');


const router = express.Router()



router.post('/auth', handleAuthentication)

router.post('/add-topic', checkAuth , handleAdmin)

router.get('/all-questions', checkAuth, handleGetAllQuestion)

router.delete('/delete-que', checkAuth, handleDeleteQuestion);

router.patch('/update-topic', checkAuth, handleUpdate);

router.get('/logout', checkAuth, handleLogout)





module.exports  = router;  