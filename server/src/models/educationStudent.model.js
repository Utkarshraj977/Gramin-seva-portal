import mongoose, {Schema} from "mongoose";


const studentSchema = new Schema(
    {
        clas:{
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

        userInfo: {
        type: Schema.Types.Mixed,
        required: true
        },
        StudentKey:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:false
        },
        message: { type: String, default: "" }
        
    },
    {
        timestamps: true
    }
)

export const Student = mongoose.model("Student", studentSchema)