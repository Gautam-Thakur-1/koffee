import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    user: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Document = mongoose.model("Document", DocumentSchema);
export default Document