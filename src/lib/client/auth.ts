import { createAuthClient } from "better-auth/svelte";
import { usernameClient } from "better-auth/client/plugins"
import { env } from '$env/dynamic/public';

export const authClient = createAuthClient({
    appName: "cipherhunt.io",
    baseURL: env.PUBLIC_ORIGIN,
    plugins: [ 
        usernameClient() 
    ] 
})