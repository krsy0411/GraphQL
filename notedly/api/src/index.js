// index.js
// This is the main entry point of our application
require('dotenv').config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const db = require('./db');
// 스키마 작성 내용을 별도의 파일로 분리
const typeDefs = require("./schema");
// 기본적으로 폴더 내 index.js를 우선적으로 import 해옴
const models = require('./models');
// 기본적으로 폴더 내 index.js를 우선적으로 import 해옴
// 스키마 필드를 위한 리졸버 함수
const resolvers = require("./resolvers");

// .env 파일에 명시된 포트 or 포트4000에서 서버 실행
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();

// db에 애플리케이션 연결
db.connect(DB_HOST);

// 아폴로 서버 설정
const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: () => {
        // context에 db models 추가
        return { models };
    }
});

// async/await를 사용하여 server.start() 호출
async function startApolloServer() {
    await server.start();
    // 아폴로 그래프QL 미들웨어를 적용하고 경로를 /api로 설정
    server.applyMiddleware({ app, path: '/api'});
}

startApolloServer().then(() => {
    app.listen({ port }, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));
});