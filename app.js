require ('dotenv').config()
require ('express-async-errors')

//EXPRESS
const express = require ('express')
const app = express()
const port = process.env.PORT || 5000

//REST OF THE PACKAGES
const morgan = require ('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require ('express-fileupload')
const rateLimiter = require ('express-rate-limit')
const helmet = require ('helmet')
const xss = require ('xss-clean')
const cors  = require ('cors')
const mongoSanitize = require('express-mongo-sanitize') 

//DATABASE
const connectDB = require ('./db/connect')

//ROUTERS
const authRouter = require ('./routes/authRoutes')
const authUser = require ('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes')

//middleware
const notFoundMiddleware = require('./middleware/not-found')
const erroHnadlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy',1)
app.use (rateLimiter({
    windowsMs: 15 * 60 * 1000,
    max:60
}))

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(fileUpload())



app.get ('/',(req,res)=>{
    res.send('ecommerce-API')
}) 

app.get ('/api/v1',(req,res)=>{
   //console.log(req.cookies)
   console.log(req.signedCookies)
    res.send('ecommerce-API')
})

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',authUser)
app.use('/api/v1/products',productRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/orders',orderRouter)



app.use(notFoundMiddleware)
app.use(erroHnadlerMiddleware)



const start = async (req,res)=>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen (port,()=>{console.log(`listening to port, ${port}`)})
    } catch (error) {
        console.log(error)
    }
}

start()