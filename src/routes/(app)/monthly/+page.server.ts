import getPuzzle from '$lib/server/utils/getPuzzle';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { solved, user } from '$lib/server/db/schema';
import { getDb } from '$lib/server/db';
import { puzzleStartDate } from '$lib/utils/generateId';
import { count, eq, sql, asc } from 'drizzle-orm';

let TYPE: 'daily' | 'weekly' | 'monthly' = 'monthly';
let PUZZLE_EDGE_CACHE: any = null;
let STATS_EDGE_CACHE: any = null;

async function loadPuzzle(locals: App.Locals) {
    let puzzle = PUZZLE_EDGE_CACHE;

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

    PUZZLE_EDGE_CACHE = puzzle;

    return puzzle;
}

export const load = async ({ locals }) => {

    let puzzle = await loadPuzzle(locals).catch((error) => {
        console.error('Error loading puzzle:', error);
        return null; // Return null or handle the error as needed
    });

    let stats = STATS_EDGE_CACHE;

    if (!stats) {
        const kv_cache = await locals.kv.get(`${TYPE}-stats`, {
            type: 'json'
        });

        stats = kv_cache;

        if (!stats) {
            const db = getDb(locals.db);
            const figures = await db.select({
                count: count(solved.id),
                avgTime: sql<number>`AVG(solved.solvedAt - solved.cipherStartDate)`.as('avgTime'),
            }).from(solved)
                .where(eq(solved.cipherId, parseInt(puzzle.id)))
                .catch((e) => {
                    console.error('Error fetching puzzle stats:', e);
                    return [{ count: 0, avgTime: 0 }];
                });

            const firstSolver = await db.select({
                username: user.username
            }).from(solved)
                .innerJoin(user, eq(solved.userId, user.id))
                .where(eq(solved.cipherId, parseInt(puzzle.id)))
                .orderBy(asc(solved.solvedAt))
                .limit(1)
                .catch((e) => {
                    console.error('Error fetching first solver:', e);
                    return [{ username: 'unknown' }];
                });

            stats = {
                solvedCount: figures[0]?.count || 0,
                avgTime: figures[0]?.avgTime || 0,
                firstSolver: firstSolver[0]?.username || 'unsolved'
            };

            await locals.kv.put(`${TYPE}-stats`, JSON.stringify(stats), {
                expirationTtl: 60 * 30
            });
        }
    }

    STATS_EDGE_CACHE = stats;

    return {
        stats: {
            solvedCount: stats?.solvedCount || 0,
            avgTime: stats.avgTime || 0,
            firstSolver: stats.firstSolver || 'Unsolved'
        },
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

        let puzzle = await loadPuzzle(locals).catch((error) => {
            console.error('Error loading puzzle:', error);
            return null; // Return null or handle the error as needed
        });

        if (!puzzle) {
            error(500, 'Failed to load puzzle for verification');
        }

        if (decoded.trim().toLowerCase() === puzzle.plaintext.toLowerCase()) {

            const session = await locals.auth.api.getSession({
                headers: request.headers
            });

            if (session && session.user) {
                const db = getDb(locals.db);
                await db.insert(solved).values({
                    cipherId: parseInt(puzzle.id),
                    userId: session.user.id,
                    cipherDuration: TYPE,
                    cipherStartDate: puzzleStartDate(new Date(), TYPE),
                    solvedAt: new Date()
                })
            }

            return {
                success: true,
                message: 'Congratulations! Your solution is correct.'
            }
        } else {
            return {
                success: false,
                message: 'Sorry, that solution is incorrect. Please try again.'
            }
        }

    }
}