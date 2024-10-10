import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"


export const signUp = async(req, res) => {
    // Implement user registration logic here
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10)
    const newUser = new User({username, email, password:hashedPassword})
   
    // Return a success message to the client
    try {
        await newUser.save();
    res.status(201).json( "User registered successfully!");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
   
    
}