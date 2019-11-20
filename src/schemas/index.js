import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    findUser(id: ID!): User
    findUsers: [User]
  }
  type AuthPayload {
    token: String
    user: User
  }

  type Mutation {
    logIn(email: String!, password: String!): AuthPayload
    createUser(input: UserInput!): User
    updateUser(input: UserInput): User
  }

  type User {
    _id: ID!
    name: String
    email: String!
    password: String!
    date: String
  }


  input UserInput {
    name: String
    email: String
    password: String
  }
`

export default typeDefs
