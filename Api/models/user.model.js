import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
      
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    
   
  
}, {timestamps: true});

// Create a model class

const User = mongoose.model('User', userSchema);


// Export the model
export default User;