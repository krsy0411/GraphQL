import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`

`
const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
});