const route = require("express").Router();
const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
//REGISTER
route.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    console.log(salt, "salt");
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = await new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
});

//LOGIN

route.post("/login", async (req, res) => {
  try {
    //Check email
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("kullanıcı bulunamadı");

    //Check password
    const validPassword = await bcrypt.compare(req.body.password,user.password)
    !validPassword && res.status(400).json({error:"Wrong password"})

    res.status(200).json(user)
  } catch (error) {
    console.log(error);
    res.status(400).json(error)
  }
});

module.exports = route;
