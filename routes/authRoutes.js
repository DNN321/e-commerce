const express = require ('express')
const router = express.Router()
const {register,login,logout,deleteUser,getAllUsers} = require ('../contollers/authController')

router.post('/register',register)
router.post('/login',login)
router.get('/logout',logout).get('/',getAllUsers)
router.delete('/delete/:id',deleteUser)



module.exports = router