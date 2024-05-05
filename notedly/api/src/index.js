// index.js
// This is the main entry point of our application
require('dotenv').config();

const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const db = require('./db');

// .env 파일에 명시된 포트 or 포트4000에서 서버 실행
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

let notes = [
    { id: '1', content: 'This is a note', author: 'Adam Scott'},
    { id: '2', content: 'This is another note', author: 'Harlow Everly'},
    { id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison'},
]

// 그래프QL 스키마 언어로, 스키마 구성
const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }

    type Query {
        hello: String
        notes: [Note!]!
        note(id: ID!): Note!
    }
    type Mutation {
        newNote(content: String!): Note!
    }
`;

// 스키마 필드를 위한 리졸버 함수 제공
const resolvers = {
    Query: {
        hello: () => "Hello World!",
        notes: () => notes,
        note: (parent, args) => {
            return notes.find(note => note.id === args.id);
        }
    },
    Mutation: {
        newNote: (parent, args) => {
            let newNoteObject = {
                id: String(notes.length + 1),
                content: args.content,
                author: "Adam Scott"
            }
            notes.push(newNoteObject);

            return newNoteObject;
        }
    }
};

const app = express();

// db에 애플리케이션 연결
db.connect(DB_HOST);

// 아폴로 서버 설정
const server = new ApolloServer({ typeDefs, resolvers });

// async/await를 사용하여 server.start() 호출
async function startApolloServer() {
    // Error: You must `await server.start()` before calling `server.applyMiddleware()` : 버전 업데이트 이후 좀 바뀐 듯?
    await server.start();
    // 아폴로 그래프QL 미들웨어를 적용하고 경로를 /api로 설정
    server.applyMiddleware({ app, path: '/api'});
}

startApolloServer().then(() => {
    app.listen({ port }, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));
});