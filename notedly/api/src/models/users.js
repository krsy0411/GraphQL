const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            index: { unique: true }
        },
        email: {
            type: String,
            required: true,
            index: { unique: true}
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String
        }
    },
    {
        // Date 자료형 : createdAt, updatedAt 필드 할당
        timestamps: true
    }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;