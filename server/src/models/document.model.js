import mongoose, { Schema } from "mongoose";

const documentSchema = new Schema(
    {
        fileName: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        filePublicId: {
            type: String,
            required: true,
        },
        fileType: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            required: true,
        },
        uploadedBy: {
            type: Schema.Types.Mixed,
            required: true,
        },
        uploadedFor: {
            type: Schema.Types.Mixed,
            required: true,
        },
        roomId: {
            type: String,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['pending', 'downloaded', 'completed'],
            default: 'pending',
        },
        description: {
            type: String,
            default: '',
        }
    },
    {
        timestamps: true
    }
);

export const Document = mongoose.model("Document", documentSchema);