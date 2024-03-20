import { ApolloServer, gql } from "apollo-server";

// User라는 커스텀 타입을 만들고, Tweet은 author에 User타입을 갖도록 함
// Tweet이라는 커스텀 타입을 만들고, allTweets는 Tweet타입의 원소를 갖는 배열(list)을 반환
const typeDefs = gql`
    type User {
        id: ID
        username: String
    }
    type Tweet {
        id: ID
        text: String
        author: User
    }
    type Query {
        allTweets: [Tweet]
        tweet(id: ID): Tweet
    }
`;
const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
});