require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const config = require('config')
const chalk = require('chalk')
// Import Routes
const authRoutes= require('./routes/authRoute')
const dashboardRoutes = require('./routes/dashboardRoutes')

// Import Middleware
const { bindUserWithRequiest } = require('./middleware/authMiddleware')
const setLocals = require('./middleware/setLocals')

// Environment Setup
// let DB_ADMIN = process.env.DB_ADMIN;
// let DB_PASSWORD = process.env.DB_PASSWORD;


// const MONGODB_URI = `mongodb+srv://${DB_ADMIN}:${DB_PASSWORD}@cluster0-dyvoa.mongodb.net/finalProject?
// retryWrites=true&w=majority`


const MONGODB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster0-dyvoa.mongodb.net/finalProject?
retryWrites=true&w=majority`



const store = new MongoDbStore({
    uri:MONGODB_URI,
    collection:'sessions',
    expires:60*60*2*1000

})





const app = express()
// Setup View Enginse
app.set('view engine','ejs')
app.set('views','views')

// const config = require('config')
// console.log(config.get('contact.email'))
// console.log(config.get('name'))
// console.log(config.get('email'))


// Development Mode
// console.log(process.env.NODE_ENV)
// const config = require('./config/config')

// if(app.get('env').toLowerCase()==='development'){
//     console.log(config.dev.name)

    
// }

// if(app.get('env').toLowerCase()==='production'){
//     console.log(config.prod.name)
// }



// Middleware Array
const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({extended:true}),
    express.json(),
 
    session({
        // secret:process.env.SECRET||'SECRET_KEY',
        secret:config.get('secret')||'SECRET_KEY',
        resave:false,
        saveUninitialized:false,
        store:store,
        cookie:{
            maxAge:60*60*2*1000
        }
    }),
    bindUserWithRequiest(),
    setLocals(),
    flash()
     
]

app.use(middleware);

// Global Routes in to imported
app.use('/auth',authRoutes)
app.use('/dashboard',dashboardRoutes)


// Playground
// const playgroundRoutes = require('./playground/validator')
// app.use('/playground',playgroundRoutes)


app.get('/',(req,res)=>{

    // req.flash('Fail','Something Error')
    // req.flash('success','Successfully')

    // console.log(req.flash('Fail'))
    res.json({
        massage:'Hello World'
    })
})

mongoose 
    .connect(MONGODB_URI,{
        useCreateIndex:true,
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log('Database connection Established')
        const PORT = process.env.PORT||8080;
        app.listen(PORT,()=>{
            console.log(chalk.yellow.inverse(`Server is runnning on PORT ${PORT}`))
        })

    })
    .catch(err=>{
        console.log(`Connection Filed ${err}`)
    })
