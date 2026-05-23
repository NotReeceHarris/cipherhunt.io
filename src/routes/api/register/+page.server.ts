import { error } from "@sveltejs/kit";
import { TURNSTILE_SECRET_KEY } from "$env/static/private";

export const actions = {
    default: async ({ request, locals }) => {
        
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const turnstileToken = formData.get('cf-turnstile-response') as string;

        if (!turnstileToken) {
            error(400, 'CAPTCHA token is missing');
        }

        if (!email || !username || !password) {
            error(400, 'All fields are required');
        }

        if (typeof email !== 'string' || typeof username !== 'string' || typeof password !== 'string') {
            error(400, 'Invalid form data');
        }

        const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                secret: TURNSTILE_SECRET_KEY,
                response: turnstileToken
            })
        }).then(async res => {
            if (!res.ok) {
                throw new Error(`Turnstile verification failed with status ${res.status}`);
            }
            const response = await res.json<{ success: boolean }>();
            return response.success;
        })
        .catch((err) => {
            console.error('Error verifying Turnstile token:', err);
            error(500, 'Failed to verify CAPTCHA');
        });

        if (!turnstileResponse) {
            error(400, 'CAPTCHA verification failed');
        }

        if (password.length < 8) {
            error(400, 'Password must be at least 8 characters long');
        }

        if (username.length < 3 || username.length > 20) {
            error(400, 'Username must be between 3 and 20 characters long');
        }

        const data = await locals.auth.api.signUpEmail({
            body: {
                name: username,
                email,
                username,
                password
            },
            headers: request.headers
        })
        .then((response) => ({
            type: "success",
            ...response
        }))
        .catch((err) => ({
            type: 'error',
            statusCode: err.statusCode || 500,
            body: {
                message: err.message || 'An error occurred during registration'
            }
        }));

        if (data.type === 'error') {
            error(data.statusCode, data.body.message || 'An error occurred during registration');
        }

        if (data.type !== 'success') {
            error(500, 'An unexpected response was received from the authentication service');
        }

        return {
            success: true
        }

    }
}