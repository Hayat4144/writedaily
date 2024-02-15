import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import ErrorMiddleware from 'middleware/ErrorMiddleware';
import authrouter from 'routes/authroutes';
import blogsroutes from 'routes/blogroutes';
import commentroutes from 'routes/commentroutes';
import likeroutes from 'routes/likeroutes';
import followroutes from 'routes/followroutes';
import topicRoutes from 'routes/topicroutes';
import readinglistRoutes from 'routes/readinglistroutes';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import logger from '@utils/logger';
import { httpStatusCode } from './types';
import { cpus } from 'os';
import cluster from 'cluster';
import CloudinaryConfiguration from '@config/cloudinaryConfig';
import userRoutes from 'routes/userroutes';

const numCPUs = cpus().length;

const StartServer = () => {
    const app = express();
    const port = process.env.PORT || 8080;
    CloudinaryConfiguration();

    // app configuration
    const limiter = rateLimit({
        windowMs: 10 * 60 * 1000,
        max: 100,
        message: 'You have exceeded the 100 requests in 10 minute limit!',
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use(helmet());
    app.use(limiter);

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

    app.use(cors());
    app.use(express.json());
    app.use(hpp());
    app.disable('x-powered-by');

    //app routes
    app.get('/', (req, res) => {
        return res.status(httpStatusCode.OK).json({ data: 'Hello developers' });
    });
    app.use(userRoutes);
    app.use(authrouter);
    app.use(blogsroutes);
    app.use(commentroutes);
    app.use(likeroutes);
    app.use(followroutes);
    app.use(topicRoutes);
    app.use(readinglistRoutes);
    app.use(ErrorMiddleware);

    app.listen(port, async () => {
        logger.info(`Sever is running at port ${port}`);
    });
};

process.env.NODE_ENV === 'production'
    ? cluster.isPrimary
        ? (() => {
              logger.info(`The primary process id is ${process.pid}`);

              for (let index = 0; index < numCPUs; index++) {
                  const worker = cluster.fork();

                  worker.on('exit', (code, signal) => {
                      if (signal) {
                          logger.info(`worker was killed by signal: ${signal}`);
                      } else if (code !== 0) {
                          logger.info(`worker exited with error code: ${code}`);
                      } else {
                          console.info('worker success!');
                      }
                  });
              }
          })()
        : StartServer()
    : StartServer();
