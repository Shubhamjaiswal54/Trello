import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required: true,
    },

    orgId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Organization',
    }
    
} ,{timestamps: true});

const userModel = mongoose.model("User", userSchema);
export default userModel;

