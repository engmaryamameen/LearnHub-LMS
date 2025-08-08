import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import { stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import connectCloudinay from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';

// initialize express 
const app = express();

// connect to db
await connectDB();
await connectCloudinay();

// middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req,res)=>{res.send("LearnHub API is working fine!")})
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks);

// port
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`);
})