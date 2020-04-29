const morgan = require('morgan')
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const config = require('config')
const MongoDbStore = require('connect-mongodb-session')(session)

// Personal Imports
const { bindUserWithRequiest } = require('./authMiddleware');
const setLocals = require('./setLocals')


const MONGODB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster0-dyvoa.mongodb.net/finalProject?
retryWrites=true&w=majority`
const store = new MongoDbStore({
    uri:MONGODB_URI,
    collection:'sessions',
    expires:1000*60*60*2
})

const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({extended:true}),
    express.json(),
 
    session({
        secret:config.get('secret')||'SECRET_KEY',
        resave:false,
        saveUninitialized:false,
        store:store,
        cookie:{
            maxAge:60*60*2*1000
        }
    }),
    flash(),
    bindUserWithRequiest(),
    setLocals()    
]
module.exports=app=>{
    middleware.forEach(m=>{
        app.use(m)
    })
}