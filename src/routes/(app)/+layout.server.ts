import { env } from '$env/dynamic/private';
import { getDb } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { solved } from '$lib/server/db/schema';
import { count, eq, desc, sql } from 'drizzle-orm';

let leaderboard: { topSolvers: {username: string|null;solved: number;avg: number;streak: number;}[]; topAvg: {username: string|null;solved: number;avg: number;streak: number;}[] } | null = null;

export const load = async ({ locals, request }) => {
    
    const session = await locals.auth.api.getSession({
        headers: request.headers
    })

    if (!leaderboard) {

        const db = getDb(locals.db);

        const topSolvers = await db.select({
            username: user.username,
            solved: count(solved.id),
            avg: sql<number>`AVG(solved.solvedAt - solved.cipherStartDate)`.as('avg'),
            streak: sql<number>`(SELECT COUNT(DISTINCT cipherDuration) FROM (
                                SELECT DISTINCT cipherDuration, DATE(solvedAt / 1000, 'unixepoch') as solvedDate
                                FROM solved s2 WHERE s2.user_id = solved.user_id
                                AND s2.solvedAt >= DATE('now', '-30 days')
                                ORDER BY s2.solvedAt DESC
                                ))`.as('streak'),
        }).from(solved)
            .innerJoin(user, eq(solved.userId, user.id))
            .groupBy(solved.userId)
            .orderBy(desc(count(solved.id)))
            .limit(10)
        .catch((e) => {
            console.error('Error fetching top solvers:', e);
            return [];
        });

        const topAvg = await db.select({
            username: user.username,
            solved: count(solved.id),
            avg: sql<number>`AVG(solved.solvedAt - solved.cipherStartDate)`.as('avg'),
            streak: sql<number>`(SELECT COUNT(DISTINCT cipherDuration) FROM (
                                SELECT DISTINCT cipherDuration, DATE(solvedAt / 1000, 'unixepoch') as solvedDate
                                FROM solved s2 WHERE s2.user_id = solved.user_id
                                AND s2.solvedAt >= DATE('now', '-30 days')
                                ORDER BY s2.solvedAt DESC
                                ))`.as('streak'),
        }).from(solved)
        .innerJoin(user, eq(solved.userId, user.id))
            .groupBy(solved.userId)
            .orderBy(desc(sql`AVG(solved.solvedAt - solved.cipherStartDate)`))
            .limit(10)
        .catch((e) => {
            console.error('Error fetching top average solvers:', e);
            return [];
        });

        leaderboard = {
            topSolvers,
            topAvg
        };

    } else {
        console.log('Using cached leaderboard data');
    }

    return {
        TURNSTILE_SITE_KEY: env.TURNSTILE_SITE_KEY,
        leaderboard,
        user: session?.user ? {
            name: session.user.name,
            username: session.user.username,
            email: session.user.email,
            image: session.user.image
        } : null
    }

}