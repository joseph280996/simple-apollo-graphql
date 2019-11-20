import { ApolloError } from 'apollo-server-express'
import User from '../models/User'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

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
  createUser: async (root, args) => {
    try {
      // might wants to validate input before creating User
      const password = await bcrypt.hash(args.input.password, 8);
      
      const newUser = new User({
        ...args.input, password
      })
      return await newUser.save()
    } catch (err) {
      throw new ApolloError(err)
    }
  },
  logIn: async (_, args) => {
    try {
      const user = await User.findOne({ email: args.email});
      if(!user){
        throw new ApolloError('Unable to find user');
      }

      const isMatch = await bcrypt.compare(args.password, user.password);
      if(!isMatch) {
        throw new ApolloError ('Incorrect password');
      }

      const token = jwt.sign({userId: user.id}, 'mySecret');
      return {
        token,
        user,
      }
    } catch(err) {
      throw new ApolloError (err)
    }
  },
  updateUser: async (root, args, context) => {
    try {
      const Authorization = context.req.get('Authorization');
      if(!Authorization){
        throw new ApolloError('Unauthorize connection! Please log in');
      }
      const { userId } = jwt.verify(Authorization, 'mySecret');
      const user = await User.findByIdAndUpdate(userId, {...args.input}, {new: true, runValidators: true});
      return user;
    } catch (err) {
      throw new ApolloError(err);
    }
  }
}

const resolvers = {
  Query,
  Mutation,
}

export default resolvers
