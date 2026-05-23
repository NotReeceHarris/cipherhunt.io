import { env } from '$env/dynamic/private';

export const load = async ({ locals, request }) => {

    const session = await locals.auth.api.getSession({
        headers: request.headers
    })

    return {
        TURNSTILE_SITE_KEY: env.TURNSTILE_SITE_KEY,
        user: session?.user ? {
            name: session.user.name,
            username: session.user.username,
            email: session.user.email,
            image: session.user.image
        } : null
    }

}