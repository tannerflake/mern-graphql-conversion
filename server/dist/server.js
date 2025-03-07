var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';
import { typeDefs } from './schemas/typeDefs';
import { resolvers } from './schemas/resolvers';
import connectDB from './config/db';
import { authenticateToken } from './services/auth';
// Load environment variables
dotenv.config();
// Connect to MongoDB
connectDB();
// Initialize Express app
const app = express();
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// Create an HTTP server to support subscriptions (future-proofing)
const httpServer = http.createServer(app);
// Initialize Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const user = authenticateToken(req);
        return { user };
    },
});
function startApolloServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield server.start();
        server.applyMiddleware({ app });
        // Serve static assets in production
        if (process.env.NODE_ENV === 'production') {
            app.use(express.static(path.join(__dirname, '../client/build')));
            app.get('*', (_req, res) => {
                res.sendFile(path.join(__dirname, '../client/build/index.html'));
            });
        }
        // Start the server
        const PORT = parseInt(process.env.PORT || '5000', 10);
        httpServer.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🚀 GraphQL available at http://localhost:${PORT}${server.graphqlPath}`);
        });
    });
}
// Start the server
startApolloServer().catch((error) => {
    console.error('Error starting Apollo Server:', error);
});
