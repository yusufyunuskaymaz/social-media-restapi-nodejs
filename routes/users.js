const route = require("express").Router()

route.get("/",(req,res)=>{
    res.send("user route page")
})

module.exports = route