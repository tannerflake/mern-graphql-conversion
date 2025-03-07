var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
export const resolvers = {
    Query: {
        me(_, __, context) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!context.user) {
                    throw new AuthenticationError('You need to be logged in!');
                }
                return yield User.findById(context.user._id);
            });
        },
    },
    Mutation: {
        addUser(_1, _a) {
            return __awaiter(this, arguments, void 0, function* (_, { username, email, password }) {
                const user = yield User.create({ username, email, password });
                const token = signToken(user);
                return { token, user };
            });
        },
        login(_1, _a) {
            return __awaiter(this, arguments, void 0, function* (_, { email, password }) {
                const user = yield User.findOne({ email });
                if (!user) {
                    throw new AuthenticationError('No user found with this email');
                }
                const correctPw = yield user.isCorrectPassword(password);
                if (!correctPw) {
                    throw new AuthenticationError('Incorrect credentials');
                }
                const token = signToken(user);
                return { token, user };
            });
        },
        saveBook(_1, _a, context_1) {
            return __awaiter(this, arguments, void 0, function* (_, { input }, context) {
                if (!context.user) {
                    throw new AuthenticationError('You need to be logged in!');
                }
                return yield User.findByIdAndUpdate(context.user._id, { $addToSet: { savedBooks: input } }, { new: true });
            });
        },
        removeBook(_1, _a, context_1) {
            return __awaiter(this, arguments, void 0, function* (_, { bookId }, context) {
                if (!context.user) {
                    throw new AuthenticationError('You need to be logged in!');
                }
                return yield User.findByIdAndUpdate(context.user._id, { $pull: { savedBooks: { bookId } } }, { new: true });
            });
        },
    },
};
