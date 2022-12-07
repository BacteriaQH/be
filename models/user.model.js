import { Schema, model } from 'mongoose';
import { agentSchema } from './qrcode.model.js';
const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        isMale: Boolean,
        dob: Date,
        address: String,
        isAdmin: {
            type: Boolean,
            default: false,
        },
        agent: [agentSchema],
    },
    { timestamps: true },
);

const User = model('User', userSchema);

export default User;
