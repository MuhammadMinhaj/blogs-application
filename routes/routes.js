const authRoutes = require('./authRoute');
const dashboardRoutes = require('./dashboardRoutes');
const playgroundRoutes = require('../playground/play')
const uploadRoutes = require('./uploadRoutes')
const postRoute = require('./postRoute')
const apiRoutes = require('../api/routes/apiRoutes')
const exploreRoutes = require('./exploreRoutes')
const searchRoute = require('./searchRoute')
const authorRoutes = require('./authorRoutes')

const router = [
    {
        path:'/auth',
        handler:authRoutes
    },
    {
        path:'/dashboard',
        handler:dashboardRoutes
    },
    {
        path:'/uploads',
        handler:uploadRoutes
    },
    {
        path:'/posts',
        handler:postRoute
    },
    {
        path:'/api',
        handler:apiRoutes
    },
    {
        path:'/explorer',
        handler:exploreRoutes
    },
    {
        path:'/search',
        handler:searchRoute
    },
    {
        path:'/author',
        handler:authorRoutes
    },
    {
        path:'/playground',
        handler:playgroundRoutes
    },
   
    {
        path:'/',
        handler:(req,res)=>{
            res.redirect('/explorer')
        }
    }
    
]
 
module.exports = app=>{
    router.forEach(r=>{
        if(r.path==='/'){
            app.get(r.path,r.handler)
        }else{
            app.use(r.path,r.handler)
        }
    })
}