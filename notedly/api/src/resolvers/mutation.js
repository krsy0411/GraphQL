// 해싱, 솔팅을 위한 패키지
const bycrypt = require('bcrypt');
// jwt 패키지
const jwt = require('jsonwebtoken');
// 아폴로 서버의 유틸리티 함수
const {
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');
const gravatar = require('../util/gravatar');
const mongoose = require('mongoose');

// dotenv 라이브러리를 사용하여 환경 변수 파일(.env)에 정의된 변수를 Node.js 애플리케이션에서 사용할 수 있도록 설정
require('dotenv').config();

module.exports = {
  newNote: async (parent, args, { models, user }) => {
    // context에 user가 없으면 인증 에러 반환
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a note');
    }

    return await models.Note.create({
      content: args.content,
      // author의 몽고ID 참조
      author: new mongoose.Types.ObjectId(user.id),
    });
  },
  updateNote: async (parent, { content, id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to update a note');
    }

    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permission to update the note");
    }

    // mongoose의 findOneAndUpdate메소드에 3가지 옵션 내용 인자로 전달
    return await models.Note.findOneAndUpdate(
      // 조건 객체(filter) : _id가 id와 일치하는 데이터를 찾아냄 : 인자로 받은 id를 데이터 서칭에 사용
      { _id: id },
      // 수정 객체(update) : 업데이트할 내용을 정의
      {
        // $set 연산자 : 필드를 업데이트할 값을 지정 : 이번 예시엔 content를 업데이트
        $set: {
          content,
        },
      },
      // 옵션 객체(options) : 업데이트 작업의 옵션을 정의 -> new: true를 설정하여 업데이트된 문서를 반환하도록 지정
      // 기본적으로 findOneAndUpdate() 메서드는 업데이트 이전의 문서를 반환
      { new: true },
    );
  },
  deleteNote: async (parent, { id }, { models, user }) => {
    // user가 아니면 인증 에러 반환
    if (!user)
      throw new AuthenticationError('You must be signed in to delete a note');

    const note = await models.Note.findById(id);

    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permission to delete the note");
    }

    try {
      // mongoose에서 findOneAndRemove가 사라진건가? : findOneAndRemove는 함수가 아니라고 로그 찍힘
      // 참고 : https://how-can-i.tistory.com/81

      // 문제가 없으면 note 삭제
      await note.remove();
      return true;
    } catch (error) {
      return false;
    }
  },
  signUp: async (parent, { username, email, password }, { models }) => {
    // 이메일 주소 스트링 처리
    email = email.trim().toLowerCase();
    // 비밀번호 해싱
    const hashed = await bycrypt.hash(password, 10);
    // gravatar URL 생성
    const avatar = gravatar(email);

    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed,
      });

      // JWT 생성
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (error) {
      console.log(error);
      throw new Error('Error creating account');
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) {
      email = email.trim().toLowerCase();
    }

    // DB에서 사용자 찾기
    const user = await models.User.findOne({
      // or 연산자를 사용하여 이메일 또는 사용자 이름으로 사용자 찾기
      $or: [{ email }, { username }],
    });

    if (!user) {
      throw new AuthenticationError('Error signing in');
    }

    // 사용자가 있는 경우, 비밀번호 일치여부 확인 : 사용자가 입력한 비밀번호와 DB에 저장된 비밀번호 비교
    const valid = await bycrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Error signing in');
    }

    // JWT 생성 및 반환
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
  toggleFavorite: async (parent, { id }, { models, user }) => {
    // 1. 전달된 user context가 없으면 에러 던지기
    if (!user) {
      throw new AuthenticationError();
    }

    // 2. 사용자가 노트를 이미 즐겨찾기했는지 확인
    let noteCheck = await models.Note.findById(id);
    const hasUser = noteCheck.favoritedBy.indexOf(user.id); // favoritedBy 배열에서 사용자 ID를 찾아보기

    // 사용자가 즐겨찾기 목록에 있는 경우
    if (hasUser >= 0) {
      // favoriteCount를 1 줄이고, favoritedBy 배열에서 사용자 ID를 제거
      return await models.Note.findByIdAndUpdate(
        // note의 ID로 찾기
        id,
        {
          // 업데이트 연산자 : 배열에서 특정 값을 제거
          $pull: {
            favoritedBy: new mongoose.Types.ObjectId(user.id),
          },
          // 업데이트 연산자 : 숫자 필드의 값을 증가 또는 감소
          $inc: {
            favoriteCount: -1,
          },
        },
        {
          // 업데이트된 문서를 반환하도록 설정(default는 false)
          new: true,
        },
      );
    } else {
      // 사용자가 목록에 없는 경우 : favoriteCount를 1 증가시키고, favoritedBy 배열에 사용자 ID 추가
      return await models.Note.findByIdAndUpdate(
        id,
        {
          // 업데이트 연산자: 배열에 새로운 요소를 추가
          $push: {
            favoritedBy: new mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            favoriteCount: 1,
          },
        },
        {
          new: true,
        },
      );
    }
  },
};
