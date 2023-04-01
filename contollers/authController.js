const User = require ('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {attachCookiesToResponse,createTokenUser} = require ('../Utils')


const getAllUsers = async (req,res)=>{
    const getUsers = await User.find({})
    res.status(StatusCodes.CREATED).json({getUsers})

}

const register = async (req,res)=>{
    const {email,name,password} = req.body

    const emailAlreadyExists = await User.findOne({email})
    if (emailAlreadyExists){
        throw new CustomError.BadRequestError('Email already exists')
    }

    //first registered User is an Admin
    const isFirstAccount = await User.countDocuments({}) === 0;
    const role = isFirstAccount? 'admin' : 'user'
   
    const user = await User.create({name,email,password,role})
    
    //jwt token
    const tokenUser = createTokenUser(user)
    //const token = jwt.sign(tokenUser, 'jwtSecret',{expiresIn: '1d'})
    //const token = createJWT({payload: tokenUser})

    //cookie
    attachCookiesToResponse({res, user: tokenUser})

    res.status(StatusCodes.CREATED).json({Registereduser:tokenUser})
}

const login = async (req,res)=>{
    const {email,password} = req.body

    if (!email || !password){
        throw new CustomError.BadRequestError('Please provide correct email or password')
    }
    const user = await User.findOne({email})
    if (!user){
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    const tokenUser = createTokenUser(user)
    
    attachCookiesToResponse({res, user: tokenUser})

    res.status(StatusCodes.OK).json({Registereduser:tokenUser})

}

const logout = async (req,res)=>{
    res.cookie('token', 'logout',{
        httpOnly:true,
        expires:new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg:'user logged out'})
}


const deleteUser = async (req,res)=>{
    const {userId} = req.params.id

    const userDeleated = await User.findByIdAndDelete({_id:userId})

    res.status(StatusCodes.OK).json({userDeleated})
}

module.exports = {register,login,logout,deleteUser,getAllUsers}