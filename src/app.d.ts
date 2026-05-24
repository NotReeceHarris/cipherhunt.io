import type { User, Session } from 'better-auth/minimal';
import { createAuth } from '$lib/server/auth';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user?: User;
			session?: Session;
			auth: ReturnType<typeof createAuth>;
			db: D1Database;
			kv: KVNamespace;
		}

		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			cf?: IncomingRequestCfProperties;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
