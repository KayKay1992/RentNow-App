import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import {errorHandler} from "../utils/error.js"


export const signUp = async(req, res, next) => {
    // Implement user registration logic here
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10)
    const newUser = new User({username, email, password:hashedPassword})
   
    // Return a success message to the client
    try {
        await newUser.save();
    res.status(201).json( "User registered successfully!");
    } catch (error) {
       next(error)
    }

    
}

export const signIn = async(req, res, next) => {
    // Implement user login logic here
    const {email, password} = req.body;
    try{
        const validUser = await User.findOne({email});
        if (!validUser) 
            return next(errorHandler(404, "User not found"));
        // Compare hashed passwords
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Invalid credentials"));
        } 
        // If passwords match, generate and send JWT token
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const {password: pass, ...rest} = validUser._doc;
        res.cookie('access_token', token, {httpOnly: true, }).status(200).json(rest)
        // Return a success message to the client
        
    } catch (error) {
        next(error);
    }
   
}