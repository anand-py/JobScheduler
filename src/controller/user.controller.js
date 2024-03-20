const User = require('../model/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        
        if (!user) {
            return res.status(403).send({ message: "User not found" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(403).send({ message: "Invalid Password" });
        }
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(200).send({
            id: user._id,
            username: user.username,
            accessToken: token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.signup = async(req,res)=>{
    try{
        const { username, password, role} = req.body
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await User.create({
            username,
            password : hashedPassword,
            role 
        });
        res.status(201).send({
            username : newUser.username,
            role : newUser.role
        })

    }catch (error) {
    res.status(500).json({ error: error.message });
  }
}