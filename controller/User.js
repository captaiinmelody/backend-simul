import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import isset from "isset";
import empty from "is-empty";
import validator from "validator";


export const getUsers =  async(req, res) => {
    try{
        const users = await Users.findAll({
            attributes: ['id', 'username', 'email']
        });
        res.json(users);
    }catch(error){
        console.log(error);
    }
}

export const Register = async(req, res) => {
    const {username, email, password, confPassword} = req.body;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    if(isset(username) && !empty(username)
        && isset(email) && !empty(email)
        && isset(password) && !empty(password)
        && isset(confPassword) && !empty(confPassword)
    ){ 
        if (!validator.isEmail(email)) {
            return res.status(400).json({ msg: 'Invalid email format' });
        }
        if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password does not match!"});
    
        const existingUsername = await Users.findOne({ where: { username: username } });
        const existingEmail = await Users.findOne({ where: { email: email } });
        if(existingUsername){
            return res.status(409).send({ success: false, username: username,message: 'Username already exist'});
        }
        else if(existingEmail){
            return res.status(409).send({ success: false, email: email,message: 'Email already exist'});
        }
        try {
            await Users.create({ 
                username:username, 
                email: email, 
                password: hashPassword 
            });
            res.status(200).json({msg: "Register Success!"});
        } catch (error) {
            console.log(error);
        }
    }else{
        res.status(404).json({msg: "Field can not be empty!"})
    }
    try{
        
    }catch(e){
        console.log(e);
    }
}


export const Login = async(req, res) => {
    const {email, password} = req.body;
    try {
        if(isset(email) && !empty(email)
        && isset(password) && !empty(password)
    ){
        const users = await Users.findOne({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, users.password);
        if(!match) return res.status(400).json({msg: "Wrong password!"});
        const userId = users.id;
        const username = users.username;
        const email = users.email;

        const accessToken = jwt.sign({userId, username, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1m"
        });
        const refreshToken = jwt.sign({userId, username, email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "1d"
        });

        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });

        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({accessToken});
    }else{
        res.status(404).json({msg: "Field can not be empty!"})
    }
    } catch (error) {
        res.status(404).json({msg: "Email does not found!"})
    }

}

export const  Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findOne({where:{refresh_token: refreshToken}});
    if(!user)return res.sendStatus(204);
    const userId = user.id;
    await Users.update({refresh_token: null}, {where:{id: userId}});
    res.clearCookie('refreshToken');
    return res.tatus(200).json({msg: "Logout Successful"});
}