const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      // 인덱스를 설정하여 중복 사용자명을 방지 : 해당 필드에 대해 중복을 허용하지 않음
      index: { unique: true },
    },
    email: {
      type: String,
      required: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  {
    // Date 자료형 : createdAt, updatedAt 필드 할당
    timestamps: true,
  },
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
