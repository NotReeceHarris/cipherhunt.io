<script lang="ts">
	import '../layout.css';
	import moment from 'moment';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { authClient } from '$lib/client/auth';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner'
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';

	let { data, children } = $props();

	let showModal: null | 'leaderboard' | 'archive' | 'login' | 'register' = $state(null);
	let key = $state(0);
	let loading = $state({
		login: false,
		register: false
	});

	let leaderboardView: 'solves' | 'avg' = $state('solves');
	let leaderboard = $derived(data.leaderboard.topSolvers.map((user)=>{
		return {
			username: user.username,
			avg: moment.utc(moment.duration(user.avg, 'milliseconds').asMilliseconds()).format('HH:mm:ss'),
			solves: user.solved,
			streak: user.streak
		}
	}))

	$effect(() => {
		leaderboard = leaderboardView === 'solves' 
			? data.leaderboard.topSolvers.map((user)=>{
				return {
					username: user.username,
					avg: moment.utc(moment.duration(user.avg, 'milliseconds').asMilliseconds()).format('HH:mm:ss'),
					solves: user.solved,
					streak: user.streak
				}
			})
			: data.leaderboard.topAvg.map((user)=>{
				return {
					username: user.username,
					avg: moment.utc(moment.duration(user.avg, 'milliseconds').asMilliseconds()).format('HH:mm:ss'),
					solves: user.solved,
					streak: user.streak
				}
			})
	})

	async function loadTurnstile() {

		const existing = document.querySelector('#cf-turnstile');
		if (!existing) return;

        let attempts = 0;
        let turnstile: any = null;
        
        while (attempts < 10) {
            if (window['turnstile']) {
                turnstile = window['turnstile'];
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }

        turnstile.render('#cf-turnstile', {
            sitekey: data.TURNSTILE_SITE_KEY,
            theme: 'dark',
            size: 'flexible',
            callback: function(token) {
                console.log('Success:', token);
            }
        });

		document.querySelectorAll('#cf-turnstile')?.forEach(el => el.classList.remove('animate-pulse'));
    }

	$effect(() => {
        if (key || showModal) loadTurnstile();
    })

	onMount(() => {
		loadTurnstile();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" defer></script>
    <link rel="preconnect" href="https://challenges.cloudflare.com" />
</svelte:head>

{#snippet navButton(title: string = 'Navigation Button', modal: typeof showModal = null)}
	<button onclick={() => showModal = modal} class="appearance-none bg-transparent border-medium p-0 font-mono text-[11px] text-muted tracking-[0.04em] uppercase cursor-pointer transition-colors hover:text-text">
		<span>{title}</span>
	</button>
{/snippet}

{#snippet tabButton(title: string = 'Navigation Button', href: string = '#', route: typeof page.route.id = null)}
	<a href={href} class="appearance-none cursor-pointer bg-transparent border {page.route.id === route ? 'border-text text-text' : 'border-border text-muted'} rounded-xs py-1.75 px-3.25 font-mono font-normal text-[11px] tracking-wider inline-flex items-center gap-1.75 transition-colors hover:border-border-strong hover:text-text">
		<span>{title}</span>
	</a>
{/snippet}

<div class="min-h-screen flex flex-col items-center px-5">
	<div class="w-full max-w-170 flex flex-col gap-4.5 min-h-screen">

		<header class="flex items-center justify-between pt-6 pb-2">

			<a href="https://cipherhunt.io" class="font-mono font-normal text-[13px] tracking-[0.02em]">
				<span>cipherhunt</span><span class="text-muted">.io</span>
			</a>

			<div class="flex gap-5.5 items-center">

				{@render navButton('Leaderboard', 'leaderboard')}
				{@render navButton('Archive', 'archive')}

				{#if data.user}
					<button title={data.user.username || data.user.email} class="appearance-none bg-transparent border-medium p-0 font-mono text-[11px] text-muted tracking-[0.04em] uppercase cursor-pointer transition-colors hover:text-text flex items-center gap-2">
						<span class="max-w-25 line-clamp-1 break-all text-ellipsis">
							{data.user.username || data.user.email}
						</span>

						{#if data.user.image}
							<div class="size-4.5 rounded-xs overflow-hidden">
								<img src={data.user.image} alt={data.user.name} class="size-full object-cover" />
							</div>
						{/if}
					</button>
				{:else}
					<button onclick={() => (showModal = 'login')} class="appearance-none bg-transparent border-medium p-0 font-mono text-[11px] text-muted tracking-[0.04em] uppercase cursor-pointer transition-colors hover:text-text">
						<span>sign in</span>
					</button>
				{/if}

			</div>

		</header>

		<main class="flex flex-col gap-5.5 grow">

			<div class="flex gap-1.5 py-1">
				{@render tabButton('daily', '/', '/(app)/(daily)')}
				{@render tabButton('weekly', '/weekly', '/(app)/weekly')}
				{@render tabButton('monthly', '/monthly', '/(app)/monthly')}
			</div>

			<div class="grow flex flex-col gap-5.5">
				{@render children()}
			</div>

		</main>

		<footer class="flex justify-between py-4 text-[11px] text-muted">
			<span>
				cipherhunt.io &copy; {new Date().getFullYear()}. All rights reserved.
			</span>
			<span>
				<a href="/privacy" class="underline hover:text-mint/80">privacy policy</a> 
				· 
				<a href="/terms" class="underline hover:text-mint/80">terms of service</a>
			</span>
		</footer>

	</div>
</div>

{#if showModal}

	<div class="w-screen h-screen top-0 left-0 fixed inset-0 z-1000 flex items-center justify-center p-6">
		<button onclick={() => showModal = null} class="w-screen h-screen top-0 left-0 fixed inset-0 bg-[rgba(20,20,20,0.62)] backdrop-blur-sm">
			<span class="sr-only">close modal</span>
		</button>

		<div style="animation: modal-in .25s ease-out both;" class="w-full max-w-130 bg-surface border-[0.5px] border-border rounded-xs max-h-[calc(100vh-48px)] flex flex-col overflow-hidden">

			<div class="flex items-center justify-between py-4 px-4.5 border-b-[0.5px] border-border">
				
				<div class="text-[11px] font-normal tracking-widest uppercase text-muted">
					{#if showModal === 'leaderboard'}
						<span>
							Leaderboard
						</span>
					{:else if showModal === 'archive'}
						<span>
							Archive
						</span>
					{:else if showModal === 'login'}
						<span>
							Sign In
						</span>
					{:else if showModal === 'register'}
						<span>
							Register
						</span>
					{/if}
				</div>

				<button onclick={() => showModal = null} class="hover:text-text text-muted appearance-none bg-transparent border-[0.5px] border-border rounded-xs size-7 inline-flex items-center justify-center cursor-pointer">
					<span class="sr-only">close modal</span>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:335:9:3"><path d="M6 6l12 12M18 6L6 18" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:1658:43:5"></path></svg>
				</button>

			</div>

			{#if showModal === 'leaderboard'}
				<div class="py-3.5 px-5 border-t-[0.5px] border-border flex justify-between items-center gap-4">
					<span class="font-mono text-[10px] text-muted tracking-[0.12em] uppercase">
						top 10 · all tracks
					</span>
					<div class="flex items-center gap-4">
						<button onclick={() => leaderboardView = 'solves'} class="appearance-none cursor-pointer bg-transparent border-0 border-b {leaderboardView === 'solves' ? 'text-text border-text' : 'border-transparent text-muted'} py-1 font-mono text-[11px] tracking-[0.06em] hover:text-text">
							most solves
						</button>
						<button onclick={() => leaderboardView = 'avg'} class="appearance-none cursor-pointer bg-transparent border-0 border-b {leaderboardView === 'avg' ? 'text-text border-text' : 'border-transparent text-muted'} py-1 font-mono text-[11px] tracking-[0.06em] hover:text-text">
							fastest avg
						</button>
					</div>
				</div>

				<div class="pt-0">
					<div class="grid grid-cols-[40px_1fr_70px_80px_60px] px-5 py-3 text-[10px] tracking-[0.08em] uppercase text-muted font-mono border-y-[0.5px] border-border">
						<span>
							#
						</span>
						<span>
							Username
						</span>
						<span class="text-right">
							Solved
						</span>
						<span class="text-right">
							Avg
						</span>
						<span class="text-right">
							Streak
						</span>
					</div>
					<div class="max-h-[46vh] overflow-y-auto mt-0">
						{#each leaderboard as user, i}
							<div class="grid grid-cols-[40px_1fr_70px_80px_60px] px-5 py-3 {i!=leaderboard.length-1 ? 'border-b-[0.5px] border-border': ''} bg-transparent items-center">
								<span class="text-muted font-mono text-[12px]">
									{(i + 1).toString().padStart(2, '0')}
								</span>
								<span class="inline-flex items-center gap-2 min-w-0 text-[13px] text-text font-normal font-mono">
									{user.username}
								</span>
								<span class="font-mono text-[12px] text-text text-right">
									{user.solves}
								</span>
								<span class="font-mono text-[12px] text-muted text-right">
									{user.avg}
								</span>
								<span class="font-mono text-[12px] text-muted text-right">
									{user.streak}
								</span>
							</div>
						{/each}
					</div>
				</div>
			{:else if showModal === 'archive'}
			{:else if showModal === 'login'}
				
				<div class="pt-4.5 px-5.5 pb-5.5 flex flex-col gap-4">
					
					<div class="flex flex-col gap-1">
						<span class="font-mono font-medium text-[18px] text-text tracking-[-0.005em]">
							welcome back
						</span>
						<span class="text-[12px] text-muted leading-6">
							Sign in to save your progress and post to the daily leaderboard.
						</span>
					</div>

					<button onclick={async ()=>{
						const data = await authClient.signIn.social({
							provider: 'github'
						})
					}} class="appearance-none cursor-pointer w-full bg-card border-[0.5px] border-border-strong rounded-xs py-2.75 px-3.5 text-text text-[13px] font-medium inline-flex items-center justify-center gap-2.5 transition-colors">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="display: block; flex-shrink: 0; color: var(--text);" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:2640:96:3"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.17a11 11 0 0 1 5.78 0c2.2-1.48 3.17-1.17 3.17-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:2776:98:5"></path></svg>
						<span>Sign in with Github</span>
					</button>

					<div class="flex items-center gap-2.5 text-muted text-[11px] tracking-[0.08em] uppercase">
						<div class="flex-[1_1_0%] h-px bg-border"></div>
						<span>
							or
						</span>
						<div class="flex-[1_1_0%] h-px bg-border"></div>
					</div>

					<form class="flex flex-col gap-3"  method="POST" action="/api/login" use:enhance={async () => {
						return async ({ result }) => {
							key++

							if (result.type === "success") {
								toast.success('Successfully signed in!')
								await invalidateAll()
								showModal = null
							} else if (result.type === "error") {
								toast.error(result.error.message || 'An error occurred while creating your account.')
								await invalidateAll()
							} else if (result.type === "redirect") {
								toast.info('Redirecting...')
								await goto(result.location)
							} else {
								toast.error('An unexpected response was received.')
								console.warn('Unexpected response:', result)
							}

						}
					}}>

						<label for="email" class="flex flex-col gap-1.5">
							<span class="text-[11px] tracking-[0.08em] uppercase text-muted font-medium">
								Email address
							</span>
							<input type="email" name="email" id="email" class="appearance-none outline-none bg-card border-[0.5px] border-border-strong rounded-xs py-2.5 px-3 font-mono text-[14px] text-text tracking-[0.02em]" placeholder="john@cipherhunt.io">
						</label>

						<label for="password" class="flex flex-col gap-1.5">
							<span class="text-[11px] tracking-[0.08em] uppercase text-muted font-medium">
								Password
							</span>
							<input type="password" name="password" id="password" class="appearance-none outline-none bg-card border-[0.5px] border-border-strong rounded-xs py-2.5 px-3 font-mono text-[14px] text-text tracking-[0.02em]" placeholder="••••••••">
						</label>

						{#key `${showModal}${key}`}
							<div id="cf-turnstile" class="w-full h-16.25 bg-card border-[0.5px] border-border-strong rounded-xs animate-pulse"></div>
						{/key}

						<button class="mt-2 appearance-none cursor-pointer w-full bg-card border-[0.5px] border-border-strong rounded-xs py-2.75 px-3.5 text-text text-[13px] font-medium inline-flex items-center justify-center gap-2.5 transition-colors">
							<span>Sign in</span>
							{#if loading.login}
								<svg class="size-3.25 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
							{:else}
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:335:9:3"><path d="M5 12h14M13 6l6 6-6 6" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:1994:62:5"></path></svg>
							{/if}
						</button>

					</form>

					<div class="text-[12px] text-muted">
						<p>
							New to cipherhunt?
							<button onclick={() => (showModal = 'register')} class="text-text ml-px cursor-pointer">
								Create an account
							</button>
						</p>
						
					</div>

				</div>

			{:else if showModal === 'register'}
			
				<div class="pt-4.5 px-5.5 pb-5.5 flex flex-col gap-4">
					
					<div class="flex flex-col gap-1">
						<span class="font-mono font-medium text-[18px] text-text tracking-[-0.005em]">
							join the hunt
						</span>
						<span class="text-[12px] text-muted leading-6">
							Save your streak, climb the leaderboard, and unlock the daily archive.
						</span>
					</div>

					<button onclick={async ()=>{
						const data = await authClient.signIn.social({
							provider: 'github'
						})
					}} class="appearance-none cursor-pointer w-full bg-card border-[0.5px] border-border-strong rounded-xs py-2.75 px-3.5 text-text text-[13px] font-medium inline-flex items-center justify-center gap-2.5 transition-colors">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="display: block; flex-shrink: 0; color: var(--text);" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:2640:96:3"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.17a11 11 0 0 1 5.78 0c2.2-1.48 3.17-1.17 3.17-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:2776:98:5"></path></svg>
						<span>Continue with Github</span>
					</button>

					<div class="flex items-center gap-2.5 text-muted text-[11px] tracking-[0.08em] uppercase">
						<div class="flex-[1_1_0%] h-px bg-border"></div>
						<span>
							or
						</span>
						<div class="flex-[1_1_0%] h-px bg-border"></div>
					</div>

					<form class="flex flex-col gap-3" method="POST" action="/api/register" use:enhance={async () => {

						loading.register = true

						return async ({ result }) => {

							key++
							loading.register = false

							if (result.type === "success") {
								toast.success('Account created successfully!')
								await invalidateAll()
								showModal = null
							} else if (result.type === "error") {
								toast.error(result.error.message || 'An error occurred while creating your account.')
								await invalidateAll()
							} else if (result.type === "redirect") {
								toast.info('Redirecting...')
								await goto(result.location)
							} else {
								toast.error('An unexpected response was received.')
								console.warn('Unexpected response:', result)
							}

						}
					}}>

						<label for="email" class="flex flex-col gap-1.5">
							<span class="text-[11px] tracking-[0.08em] uppercase text-muted font-medium">
								Email address
							</span>
							<input type="email" name="email" id="email" class="appearance-none outline-none bg-card border-[0.5px] border-border-strong rounded-xs py-2.5 px-3 font-mono text-[14px] text-text tracking-[0.02em]" placeholder="john@cipherhunt.io">
						</label>

						<label for="username" class="flex flex-col gap-1.5">
							<span class="text-[11px] tracking-[0.08em] uppercase text-muted font-medium">
								Username
							</span>
							<input type="text" name="username" id="username" class="appearance-none outline-none bg-card border-[0.5px] border-border-strong rounded-xs py-2.5 px-3 font-mono text-[14px] text-text tracking-[0.02em]" placeholder="john_doe">
						</label>

						<label for="password" class="flex flex-col gap-1.5">
							<span class="text-[11px] tracking-[0.08em] uppercase text-muted font-medium">
								Password
							</span>
							<input type="password" name="password" id="password" class="appearance-none outline-none bg-card border-[0.5px] border-border-strong rounded-xs py-2.5 px-3 font-mono text-[14px] text-text tracking-[0.02em]" placeholder="••••••••">
						</label>

						{#key `${showModal}${key}`}
							<div id="cf-turnstile" class="w-full h-16.25 bg-card border-[0.5px] border-border-strong animate-pulse rounded-xs"></div>
						{/key}

						<button class="appearance-none cursor-pointer w-full bg-card border-[0.5px] border-border-strong rounded-xs py-2.75 px-3.5 text-text text-[13px] font-medium inline-flex items-center justify-center gap-2.5 transition-colors">
							<span>Create account</span>
							{#if loading.register}
								<svg class="size-3.25 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
							{:else}
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:335:9:3"><path d="M5 12h14M13 6l6 6-6 6" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:1994:62:5"></path></svg>
							{/if}
						</button>

					</form>

					<div class="text-[12px] text-muted">
						<p>
							Already have an account?
							<button onclick={() => (showModal = 'login')} class="text-text ml-px cursor-pointer">
								Sign in
							</button>
						</p>
						
					</div>

				</div>

			{/if}

		</div>

	</div>

{/if}