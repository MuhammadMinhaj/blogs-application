require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')


const setMiddleware = require('./middleware/middleware')
const setRoutes = require('./routes/routes')


const MONGODB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster0-dyvoa.mongodb.net/finalProject?
retryWrites=true&w=majority`

const app = express()
// Setup View Enginse
app.set('view engine','ejs')
app.set('views','views')


// Using Middleware from middleware directory
setMiddleware(app)
// Using Routes from Routes directory 
setRoutes(app)


app.use((req,res,next)=>{
    let error = new Error('404 Not Found')
    error.status = 404
    next(error)
})
app.use((error,req,res,next)=>{
    if(error.status ===404){
        return res.render('pages/error/404',{flashMessage:{}}) 
    }
    console.log(error)
    res.render('pages/error/500',{flashMessage:{}})

})

mongoose 
    .connect(MONGODB_URI,{
        useCreateIndex:true,
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false
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
