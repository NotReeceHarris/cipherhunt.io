import getPuzzle from '$lib/server/utils/getPuzzle';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

let TYPE: 'daily' | 'weekly' | 'monthly' = 'daily';
let EDGE_CACHE: any = null;

export const load = async ({ locals }) => {

    let puzzle = EDGE_CACHE;

    if (!puzzle) {
        const kv_cache = await locals.kv.get(TYPE, {
            type: 'json'
        });
        
        puzzle = kv_cache;

        if (!puzzle) {
            puzzle = await getPuzzle(new Date(), TYPE).catch((error) => {
                console.error('Error fetching puzzle:', error);
                return null; // Return null or handle the error as needed
            });

            if (puzzle) {
                await locals.kv.put(TYPE, JSON.stringify(puzzle), {
                    expirationTtl: 60 * 60
                });
            }
        }
    }

    EDGE_CACHE = puzzle;

    return {
        puzzle: {
            id: puzzle?.id || 'unknown',
            ciphertext: puzzle?.ciphertext || 'Unable to load puzzle.'
        }
    };

}

export const actions = {
    default: async ({ request, locals }) => {

        const formData = await request.formData();
        const decoded = formData.get('decoded') as string;
        const turnstileToken = formData.get('cf-turnstile-response') as string;

        if (!turnstileToken) {
            error(400, 'CAPTCHA token is missing');
        }

        if (!decoded) {
            return {
                success: false,
                message: 'Please enter a solution before submitting.'
            };
        }

        const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                secret: env.TURNSTILE_SECRET_KEY,
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

        return {
            success: true,
            message: 'Solution submitted successfully! (Note: This is a placeholder response.)'
        }

    }
}