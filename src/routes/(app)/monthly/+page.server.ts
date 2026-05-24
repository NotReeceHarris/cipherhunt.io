import getPuzzle from '$lib/server/utils/getPuzzle';

let TYPE: 'daily' | 'weekly' | 'monthly' = 'monthly';
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