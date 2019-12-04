import { ApolloError } from 'apollo-server-express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendMail from '../utils'
import User from '../models/User'

const Query = {
  findUser: async (_, args) => {
    try {
      const user = await User.findById(args.id)
      return user
    } catch (err) {
      throw new ApolloError(err)
    }
  },
  findUsers: async () => {
    try {
      return await User.find({})
    } catch (err) {
      throw new ApolloError(err)
    }
  },
}

const Mutation = {
  login: async (root, args, context) => {
    try {
      const Authorization = context.req.get('Authorization')
      if (!Authorization) {
        throw new ApolloError('Unauthorize connection! Please log in')
      }
      const { user } = jwt.verify(Authorization, 'mySecret')
      const dbUser = await User.findOne({ jwtToken: user })
      if (!dbUser) {
        throw new ApolloError('Unable to find user')
      }
      return {
        isSignedIn: true,
      }
    } catch (err) {
      throw new ApolloError(err)
    }
  },
  createUser: async (root, args) => {
    try {
      // might wants to validate input before creating User
      const { email } = args.input
      const hashedValue = await bcrypt.hash(email, 8)
      const jwtToken = jwt.sign({ email }, 'mySecret', { expiresIn: 60 * 60 })
      const user = await User.findOne({ hashedValue })
      if (user) {
        return {
          isEmailVerified: user.isEmailVerified,
        }
      }
      const newUser = new User({
        hashedValue,
        jwtToken,
        isEmailVerified: false,
      })
      newUser.save()
      sendMail(email, `http://localhost:3000/user/${hashedValue}`)
      return {
        isEmailVerified: false,
      }
    } catch (err) {
      throw new ApolloError(err)
    }
  },
  verify: async (root, args) => {
    try {
      const user = await User.findOne({ hashedValue: args.hashedValue })
      if (!user) {
        throw new ApolloError('Unable to find user')
      }
      jwt.verify(user.jwtToken, 'mySecret')
      const token = jwt.sign({ user: user.jwtToken }, 'mySecret')
      user.isEmailVerified = true
      user.save()
      return {
        token,
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        User.deleteOne({ hashedValue: args.hashValue })
      }
      throw new ApolloError(err)
    }
  },
}

const resolvers = {
  Query,
  Mutation,
}

export default resolvers
