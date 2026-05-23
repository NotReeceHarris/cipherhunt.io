import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, request }) => {
    await locals.auth.api.signOut({
        headers: request.headers,
    });

    redirect(301, '/');
}