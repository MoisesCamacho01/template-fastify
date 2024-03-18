import { FastifyInstance } from 'fastify';

import userRoutes from './routes/user.routes';

export default function routesV1(route: FastifyInstance, options: any, done: () => void) {

    route.register(userRoutes, { prefix: 'users' } );

    done();
}
