import type { FastifyInstance } from 'fastify';

import authRoutes from '@/app/modules/auth/infrastructure/routes/auth.routes';
import { authExceptAuthModule } from '@/core/middleware/middleware';

export default function routesV1(route: FastifyInstance, options: any, done: () => void) {
	route.addHook('preHandler', authExceptAuthModule);

	route.get('/', async () => ({
		message: 'Login API v1 OK!'
	}));

	route.register(authRoutes, { prefix: 'auth' });

	done();
}
