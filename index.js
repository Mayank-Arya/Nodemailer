const express = require('express')
require('dotenv').config()
const {userRouter} = require('./routes/user.routes')
const { connection } = require('./db')
const app = express()
app.use(express.json())

app.get('/',(req,res) => {
    res.send("Home Page")
})

app.use('/user',userRouter)

app.listen(process.env.PORT, async()=>{
    try{
        await connection
        console.log("Connected to DB")
    }
    catch(err){
        console.log(err.message)
    }
    console.log(`Running on port ${process.env.PORT}`)
})


