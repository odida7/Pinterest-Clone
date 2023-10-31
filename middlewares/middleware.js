// middlewares/middleware.js
import nextConnect from 'next-connect';
//import database from './database';
import connectDB from "@utils/database";


const middleware = nextConnect();
//await connectDB()

middleware.use(connectDB);

export default middleware;
