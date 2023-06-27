const express = require('express')
const userRouter = express.Router()
const {userModel} = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')


userRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const isUserPresent = await userModel.findOne({ email });
      if (isUserPresent) {
        return res.send({ msg: 'User already exists, please login' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new userModel({ name, email, password: hashedPassword });
      await newUser.save();
      res.status(200).send('New User has been added');
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const isUserPresent = await userModel.findOne({ email });
      if (!isUserPresent) {
        return res.send({ msg: 'User is not registered, please register first' });
      }
      const isPasswordValid = await bcrypt.compare(password, isUserPresent.password);
      if (!isPasswordValid) {
        return res.status(401).send({ msg: 'Invalid password' });
      }
      const token = jwt.sign({ userId: isUserPresent._id, email }, 'your_secret_key');
      res.send({ msg: 'Login successful', token, userName: isUserPresent.name });
    } catch (err) {
      res.status(500).send(err.message);
    }
  });


userRouter.get('/email', async(req,res) => {
    const {email} = req.body
try{
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host:'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'divyansh2879@gmail.com',
        pass:  process.env.googlePass
    }
}))



var mailOptions = {
    from: 'divyansh2879@gmail.com',
    to: `${email}`,
    subject: 'Hello From Mayank',
    text: 'This is to inform you something xyz'
};


transporter.sendMail(mailOptions, function(err,info){
    if(err){
        console.log(err)
        res.status(400).send({err: err.message})
    }else{
        res.send({msg: "Email sent to the email:-",email})
    }
    
})
}

catch(err){
    console.log(err.message)
    res.status(400).send(err.message)
}
})

module.exports = {userRouter}

