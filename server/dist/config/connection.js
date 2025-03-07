// filepath: /Users/tannerflake/mern-graphql-conversion/server/src/config/connection.ts
import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');
export default mongoose.connection;
