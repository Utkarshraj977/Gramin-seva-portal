import mongoose, {Schema} from "mongoose";


const educationSchema = new Schema(
    {
        
        Education_certificate: {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
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
        Start_time: {
        type: String, 
        required: true
         },
        End_time: {
        type: String,  
        required: true
        },
        isEducator:{
            type:Boolean,
            required: true,
        },
        student: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
        ],

        userInfo: {
        type: Schema.Types.Mixed,
        required: true
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