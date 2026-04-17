import { Router } from 'express';
import healthCheck from './health-check.js';
import integratedAiRouter from './integrated-ai.js';
import designsRouter from './designs.js';
import ordersRouter from './orders.js';
import authRouter from './auth.js';
import searchRouter from './search.js';
import couponsRouter from './coupons.js';
import deliveryRouter from './delivery.js';
import notificationsRouter from './notifications.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/integrated-ai', integratedAiRouter);
    router.use('/designs', designsRouter);
    router.use('/orders', ordersRouter);
    router.use('/auth', authRouter);
    router.use('/search', searchRouter);
    router.use('/coupons', couponsRouter);
    router.use('/delivery', deliveryRouter);
    router.use('/notifications', notificationsRouter);

    return router;
};