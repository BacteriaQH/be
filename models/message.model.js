import { Schema, model } from "mongoose";


export const messageSchema = new Schema({
    type: {
        type: String,
        content: String,
        required: true,
    },
    chatrooID: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    }
}, { timestamps: true });


const Message = model("Message", messageSchema);
export default Message;