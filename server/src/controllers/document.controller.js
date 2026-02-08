import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Document } from "../models/document.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

// Upload Document
const uploadDocument = asyncHandler(async (req, res) => {
    const { roomId, uploadedForId, description } = req.body;

    if (!roomId || !uploadedForId) {
        throw new ApiError(400, "Room ID and recipient ID are required");
    }

    const documentPath = req.files?.document?.[0]?.path;
    if (!documentPath) {
        throw new ApiError(400, "Document file is required");
    }

    const uploadedFile = await uploadOnCloudinary(documentPath);
    if (!uploadedFile) {
        throw new ApiError(500, "File upload failed");
    }

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    const recipient = await User.findById(uploadedForId);
    if (!recipient) throw new ApiError(404, "Recipient not found");

    const { password, refreshToken, ...uploaderData } = user.toObject();
    const { password: p2, refreshToken: r2, ...recipientData } = recipient.toObject();

    const newDocument = await Document.create({
        fileName: req.files.document[0].originalname,
        fileUrl: uploadedFile.url,
        filePublicId: uploadedFile.public_id,
        fileType: req.files.document[0].mimetype,
        fileSize: req.files.document[0].size,
        uploadedBy: uploaderData,
        uploadedFor: recipientData,
        roomId,
        description: description || '',
        status: 'pending'
    });

    return res.status(201).json(
        new ApiResponse(201, newDocument, "Document uploaded successfully")
    );
});

// Get Documents for a Room
const getRoomDocuments = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    if (!roomId) {
        throw new ApiError(400, "Room ID is required");
    }

    const documents = await Document.find({ roomId }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, documents, "Documents fetched successfully")
    );
});

// Update Document Status
const updateDocumentStatus = asyncHandler(async (req, res) => {
    const { documentId } = req.params;
    const { status } = req.body;

    if (!['pending', 'downloaded', 'completed'].includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    const document = await Document.findByIdAndUpdate(
        documentId,
        { status },
        { new: true }
    );

    if (!document) {
        throw new ApiError(404, "Document not found");
    }

    return res.status(200).json(
        new ApiResponse(200, document, "Document status updated")
    );
});

// Delete Document
const deleteDocument = asyncHandler(async (req, res) => {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
        throw new ApiError(404, "Document not found");
    }

    // Verify user is the uploader
    if (String(document.uploadedBy._id) !== String(req.user?._id)) {
        throw new ApiError(403, "You can only delete your own documents");
    }

    await Document.findByIdAndDelete(documentId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Document deleted successfully")
    );
});

export {
    uploadDocument,
    getRoomDocuments,
    updateDocumentStatus,
    deleteDocument
};