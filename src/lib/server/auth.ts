import { betterAuth } from 'better-auth/minimal';
import { username } from "better-auth/plugins"
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { env as envPublic } from '$env/dynamic/public';
import { getRequestEvent } from '$app/server';
import { getDb } from '$lib/server/db';
import { captcha } from "better-auth/plugins"; 
import * as schema from '$lib/server/db/schema';

const authConfig = {
	appName: "cipherhunt.io",
	baseURL: envPublic.PUBLIC_ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	emailAndPassword: { enabled: true },
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET
		}
	},
	user: {
		deleteUser:{
			enabled: true,
		}
	},
	plugins: [
		username({
			usernameNormalization: (username) => {
                return username.toLowerCase().trim().replace(/\s+/g, '-').padEnd(3, 'x');
            }
		}), // adds username support to email/password authentication
		captcha({ 
            provider: "cloudflare-turnstile",
            secretKey: env.TURNSTILE_SECRET_KEY
        }), 
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	],
	databaseHooks: {
		account: {
			create: {
				after: async (account, ctx) => {

					const isUsernameTaken = async (username: string) => {
						const taken = await ctx?.context.adapter.findOne({
							model: ctx.context.tables.user.modelName,
							where: [
								{
									field: 'username',
									value: username,
									operator: 'eq'
								}
							]
						})
						.then((result) => !!result)
						.catch((err) => {
							console.error('Error fetching user after GitHub account creation:', err);
							return false;
						});

						return taken;
					}

					if (ctx && account.providerId === 'github') {

						const user = await ctx.context.adapter.findOne({
							model: ctx.context.tables.user.modelName,
							where: [
								{
									field: 'id',
									value: account.userId,
									operator: 'eq'
								}
							]
						}).catch((err) => {
							console.error('Error fetching user after GitHub account creation:', err);
							return null;
						});

						if (!user) {
							console.error('User not found after GitHub account creation');
							return;
						}

						const githubResponse = await fetch('https://api.github.com/user', {
							headers: {
								Authorization: `token ${account.accessToken}`
							}
						}).catch((err) => {
							console.error('Failed to fetch GitHub user data:', err);
							return null;
						});

						if (!githubResponse) {
							return;
						}

						const githubData = await githubResponse.json<{ login: string }>().catch((err) => {
							console.error('Failed to parse GitHub user data:', err);
							return null;
						});

						if (!githubData || !githubData.login) {
							return;
						}

						let username = githubData.login.toLowerCase().trim().replace(/\s+/g, '-');

						let i = 0;
						while (await isUsernameTaken(username)) {

							if (i > 15) {
								username = `${githubData.login}${(Math.random() * 10000000).toString().substring(2, 8)}`.toLowerCase().trim().replace(/\s+/g, '-');
							} else {
								username = `${githubData.login}${i}`.toLowerCase().trim().replace(/\s+/g, '-');
								i++;
							}

						}

						await ctx.context.adapter.update({
							model: ctx.context.tables.user.modelName,
							where: [
								{
									field: 'id',
									value: account.userId,
									operator: 'eq'
								}
							],
							update: {
								username,
								displayUsername: username
							}
						}).catch((err) => {
							console.error('Failed to update user with GitHub username:', err);
						});

					}

				}
			}
		},
		user: {
			create: {
				before: async (user, ctx) => {

					const isUsernameTaken = async (username: string) => {
						const taken = await ctx?.context.adapter.findOne({
							model: ctx.context.tables.user.modelName,
							where: [
								{
									field: 'username',
									value: username,
									operator: 'eq'
								}
							]
						})
						.then((result) => !!result)
						.catch((err) => {
							console.error('Error fetching user after GitHub account creation:', err);
							return false;
						});

						return taken;
					}

					if (ctx?.params?.id === 'github') {
						let username = `anonymous${(Math.random() * 10000000).toString().substring(2, 8)}`
						while (await isUsernameTaken(username)) {
							username = `anonymous${(Math.random() * 10000000).toString().substring(2, 8)}`
						}
						user.username = user.displayUsername = username;
					}

					return {
						data: user
					}

				}
			}
		}
	}
} satisfies Omit<Parameters<typeof betterAuth>[0], 'database'>;

export const createAuth = (d1: D1Database) =>
	betterAuth({
		...authConfig,
		database: drizzleAdapter(
			getDb(d1), 
			{ 
				provider: 'sqlite',
				schema
			})
	});

/**
 * DO NOT USE!
 *
 * This instance is used by the `better-auth` CLI for schema generation ONLY.
 * To access `auth` at runtime, use `event.locals.auth`.
 */
export const auth = createAuth(null!);
