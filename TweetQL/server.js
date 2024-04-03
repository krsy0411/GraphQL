import { ApolloServer, gql } from "apollo-server";

let tweets = [
    {
        id: "1",
        text: "first one"
    },
    {
        id: "2",
        text: "second one"
    }
]

// User라는 커스텀 타입을 만들고, Tweet은 author에 User타입을 갖도록 함
// Tweet이라는 커스텀 타입을 만들고, allTweets는 Tweet타입의 원소를 갖는 배열(list)을 반환
const typeDefs = gql`
    type User {
        id: ID!
        username: String!
    }
    type Tweet {
        id: ID!
        text: String
        author: User!
    }
    type Query {
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
    }
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`;

const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        },
        tweet(root, args) {
            return args;
        }
    },
    Mutation : {
        postTweet(_, { text, userId }) {
            const newTweet = {
                id: tweets.length + 1,
                text: text,
            }
            tweets.push(newTweet);

            return newTweet;
        },
        deleteTweet(_, { id }) {
            const tweet = tweets.find(tweet => tweet.id === id);

            if(!tweet) {
                return false;
            }

            tweets = tweets.filter(tweet => tweet.id !== id);
            
            return true;
        }
    }
}

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
});