// index.js
// This is the main entry point of our application
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const db = require('./db');
// 스키마 작성 내용을 별도의 파일로 분리
const typeDefs = require('./schema');
// 기본적으로 폴더 내 index.js를 우선적으로 import 해옴
const models = require('./models');
// 기본적으로 폴더 내 index.js를 우선적으로 import 해옴
// 스키마 필드를 위한 리졸버 함수
const resolvers = require('./resolvers');

// .env 파일에 명시된 포트 or 포트4000에서 서버 실행
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();

// db에 애플리케이션 연결
db.connect(DB_HOST);

// JWT에서 사용자 정보 가져오기
const getUser = (token) => {
  if (token) {
    try {
      // 토큰에서 얻은 사용자 정보 반환
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // 토큰에 문제 있을시, 에러 반환
      throw new Error('Session invalid');
    }
  }
};

// 아폴로 서버 설정
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization; // 헤더에서 사용자 토큰 가져오기
    const user = getUser(token); // 토큰에서 사용자 얻기 : payload를 포함한 객체 반환

    console.log(user); // 콘솔에 사용자 정보 출력

    // context에 db models & user 추가
    return { models, user };
  },
});

// async/await를 사용하여 server.start() 호출
async function startApolloServer() {
  await server.start();
  // 아폴로 그래프QL 미들웨어를 적용하고 경로를 /api로 설정
  server.applyMiddleware({ app, path: '/api' });
}

startApolloServer().then(() => {
  app.listen({ port }, () =>
    console.log(
      `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`,
    ),
  );
});
