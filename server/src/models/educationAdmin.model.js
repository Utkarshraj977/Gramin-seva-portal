import mongoose, {Schema} from "mongoose";


const educationSchema = new Schema(
    {
        Education_certificate:{
            type:String,
            required: true,
        },
        
        fee:{
            type:String,
            required: true,
        },

        Experience:{
            type:String,
            required: true,
        },

        category:{   //subject
            type:String,
            required: true,
        },
        Start_time:{
            type:String,
            required: false,
        },
        End_time:{
            type:String,
            required: false,
        },
        isEducator:{
            type:Boolean,
            required: true,
        },
        student:[
            {
                type: Schema.Types.ObjectId,
                ref: "Student"
            }
        ],
        userInfo:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        EducatorKey:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:false
        }

    },
    {
        timestamps: true
    }
)

export const Education = mongoose.model("Education", educationSchema)