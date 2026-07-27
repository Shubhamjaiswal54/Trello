import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({

    orgId :{
        type : mongoose.Types.ObjectId,
        ref : 'Organization',
    },
    
    name : {
        type : String , 
        required : true,
    },

});

const departmentModel = mongoose.model("Department" , departmentSchema);
export default departmentModel;

