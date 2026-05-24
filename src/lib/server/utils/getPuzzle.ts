import generateId from '$lib/utils/generateId';
import { env } from '$env/dynamic/private';

const API_URL = 'https://api.github.com/repos/NotReeceHarris/cipherhunt-ciphers/contents/puzzles/{}/metadata.json'

export default async function getPuzzle(date: Date, type: 'daily' | 'weekly' | 'monthly') {
    const id = generateId(date, type);

    const url = API_URL.replace('{}', id);

    console.log(url)

    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3.raw',
            'user-agent': 'Cipherhunt-Ciphers-App',
            'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
            'X-GitHub-Api-Version': '2026-03-10'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch puzzle metadata: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.id || !data.ciphertext) {
        throw new Error('Invalid puzzle data received');
    }

    return data;
}