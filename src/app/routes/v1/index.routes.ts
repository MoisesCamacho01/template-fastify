import { FastifyInstance } from 'fastify';

import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

export default async function routesV1(route: FastifyInstance, options: any) {

    await route.register(authRoutes, { prefix: 'auth' } );
    await route.register(userRoutes, { prefix: 'users' } );
}
