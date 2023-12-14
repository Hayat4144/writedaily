import 'dotenv/config';
import logger from '@utils/logger';
import express from 'express';
import cors from 'cors';
import ErrorMiddleware from 'middleware/ErrorMiddleware';
import authrouter from 'routes/authroutes';
import blogsroutes from 'routes/blogroutes';

const app = express();
const port = process.env.PORT || 8080;

// app configuration
app.use(
    cors({
        origin:
            process.env.NODE_ENV === 'production'
                ? [process.env.FRONTEND_URL as string]
                : ['http://localhost:3000'],
        credentials: true,
        optionsSuccessStatus: 200,
    }),
);
app.use(express.json());

//app routes
app.use(authrouter);
app.use(blogsroutes);
app.use(ErrorMiddleware);

app.listen(port, async () => {
    logger.info(`Sever is running at http://localhost:${port}`);
});
