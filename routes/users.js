const route = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

route.get("/", (req, res) => {
  res.send("user route page");
});

// Updating User Info

route.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can update only your account");
  }
});

// Deleting User with id
 route.delete("/:id", async (req, res) => {
    if(req.body.id === req.params.id || req.body.isAdmin){
        try {
          const user = await User.findByIdAndDelete(req.params.id)
          res.status(200).json("Deleted successfully")
        } catch (error) {
          res.status(400).json(error)
        }
    }else{
      res.status(403).json("You can delete only your account")
    }
 })

 route.get("/:id", async(req,res)=>{
  try {
    const user = await User.findById(req.params.id)
    const {password,updatedAt,email, ...other} = user._doc
    res.status(200).json(other)
  } catch (error) {
    res.status(500).json(error)
  }
 })

 // Follow a user

 route.put("/:id/follow",async(req,res)=>{
  if(req.body.userId !== req.params.id){
    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)
      if(!user.follower.includes(req.body.userId)){
        await user.updateOne({$push:{follower:req.body.userId}})
        await currentUser.updateOne({$push:{followins:req.params.id}})
        res.status(200).json("User has been followed")
      }else{
        res.status(403).json("You already follow this guy")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }else{
    res.status(403).json("You cannot follow yourself")
  }
 })

 // Unfollowind
 route.put("/:id/unfollow",async(req,res)=>{
  if(req.body.userId !== req.params.id){
    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)
      if(user.follower.includes(req.body.userId)){
        await user.updateOne({$pull:{follower:req.body.userId}})
        await currentUser.updateOne({$pull:{followins:req.params.id}})
        res.status(200).json("User has been unfollowed")
      }else{
        res.status(403).json("You dont follow this guy")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }else{
    res.status(403).json("You cannot unfollow yourself")
  }
 })

module.exports = route;
