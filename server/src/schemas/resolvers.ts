import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { BookInput } from '../types';

export const resolvers = {
  Query: {
    async me(_: any, __: any, context: any) {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      return await User.findById(context.user._id);
    },
  },

  Mutation: {
    async addUser(_: any, { username, email, password }: { username: string; email: string; password: string }) {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    async login(_: any, { email, password }: { email: string; password: string }) {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    async saveBook(_: any, { input }: { input: BookInput }, context: any) {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      return await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: input } },
        { new: true }
      );
    },

    async removeBook(_: any, { bookId }: { bookId: string }, context: any) {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      return await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};