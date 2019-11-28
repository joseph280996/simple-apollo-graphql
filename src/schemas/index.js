import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    findUser(id: ID!): User
    findUsers: [User]
  }

  type Mutation {
    createUser(input: UserInput!): createUserPayload
    verify(hashValue: String!): AuthPayload
  }

  type createUserPayload {
    isEmailSent: Boolean
  }

  type AuthPayload {
    token: String
  }

  type User {
    _id: ID!
    email: String!
    date: String
  }

  input UserInput {
    email: String
  }
`

export default typeDefs
