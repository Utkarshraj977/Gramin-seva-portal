import mongoose, {Schema} from "mongoose";


const studentSchema = new Schema(
    {
        class:{
            type:String,
            required: true,
        },
        subject:{
            type:String,
            required: true,
        },

        board:{   
            type:String,
            required: true,
        },

        isStudent:{
            type:Boolean,
            required: true,
        },

        userInfo:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        StudentKey:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:false
        },
        massage:{
            type:String,
            required:false
        }
        
    },
    {
        timestamps: true
    }
)

export const Student = mongoose.model("Student", studentSchema)