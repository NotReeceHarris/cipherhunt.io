<script lang="ts">
	import '../layout.css';
	import moment from 'moment';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { authClient } from '$lib/client/auth';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner'
	import { goto, invalidateAll } from '$app/navigation';

	let { data, children } = $props();

	let timeUntilMidnight = $state(getTimeUntilMidnight());
	let showModal: null | 'leaderboard' | 'solution' | 'settings' | 'login' | 'register' = $state(null);
	let key = $state(0);
	let loading = $state({
		login: false,
		register: false
	});
	
	let currentCipherId = 142
	let lastCipherId = 141
	let solvers = 847;

	let leaderboard = [
		{
			username: 'crypto_king',
			solveTime: '00:05:23',
			attempts: 1
		},
		{
			username: 'cipher_queen',
			solveTime: '00:07:45',
			attempts: 2
		},
		{
			username: 'puzzle_master',
			solveTime: '00:10:12',
			attempts: 3
		},
		{
			username: 'enigmatic_solver',
			solveTime: '00:12:34',
			attempts: 4
		},
		{
			username: 'mystery_cracker',
			solveTime: '00:15:20',
			attempts: 5
		},
		{
			username: 'riddle_expert',
			solveTime: '00:18:45',
			attempts: 6
		},
		{
			username: 'code_breaker',
			solveTime: '00:22:10',
			attempts: 6
		},
		{
			username: 'cipher_sleuth',
			solveTime: '00:25:30',
			attempts: 6
		},
		{
			username: 'puzzle_prodigy',
			solveTime: '00:30:00',
			attempts: 6
		},
		{
			username: 'enigmatic_solver',
			solveTime: '00:35:45',
			attempts: 6
		}
	]

	function getTimeUntilMidnight() {
		const now = moment();
		const midnight = moment().endOf('day').add(1, 'ms'); // Next 00:00:00
		const duration = moment.duration(midnight.diff(now));

		const hours = String(Math.floor(duration.asHours())).padStart(2, '0');
		const minutes = String(duration.minutes()).padStart(2, '0');
		const seconds = String(duration.seconds()).padStart(2, '0');

		return `${hours}:${minutes}:${seconds}`;
	}

	async function loadTurnstile() {

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

		const interval = setInterval(() => {
			timeUntilMidnight = getTimeUntilMidnight();
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" defer></script>
    <link rel="preconnect" href="https://challenges.cloudflare.com" />
</svelte:head>

{#snippet navButton(title: string = 'Navigation Button', svg: string = '', modal: typeof showModal = null)}
	<button onclick={() => showModal = modal} class="appearance-none bg-transparent border-[0.5px] border-border rounded-md text-muted size-8 inline-flex items-center justify-center cursor-pointer transition-colors duration-150 hover:bg-sky/8 hover:text-text">
		{@html svg}
		<span class="sr-only">{title}</span>
	</button>
{/snippet}

<div class="min-h-screen flex flex-col items-center px-5 pb-20">
	<div class="w-full max-w-180 flex flex-col">

		<nav class="grid grid-cols-[1fr_auto_1fr] items-center pt-4.5 px-1 pb-5.5 gap-3">

			<a href="https://cipherhunt.io" class="font-mono font-medium text-[15px] tracking-[-0.01em] justify-self-start">
				<span>cipher</span><span class="text-mint">hunt</span><span class="text-muted">.io</span>
			</a>

			<div class="justify-self-center">
				<div class="inline-flex items-center gap-1.5 py-1.25 px-2.5 bg-sky/8 border-[0.5px] border-sky/22 rounded-md text-sky font-mono text-[12px] font-normal tracking-[0.04em] whitespace-nowrap">
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:335:9:3"><circle cx="12" cy="12" r="9" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:638:19:5"></circle><path d="M12 7v5l3 2" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:675:20:5"></path></svg>
					<span>{timeUntilMidnight}</span>
				</div>
			</div>

			<div class="flex gap-2 justify-self-end items-center">

				{@render navButton('Leaderboard', '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:335:9:3"><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:762:26:5"></path><path d="M8 6H5v1a3 3 0 0 0 3 3" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:805:27:5"></path><path d="M16 6h3v1a3 3 0 0 1-3 3" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:845:28:5"></path><path d="M10 16h4v3h-4z"></path><path d="M8 20h8"></path></svg>', 'leaderboard')}
				{@render navButton('Last Challenge Solution', '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:335:9:3"><path d="M3 12a9 9 0 1 0 3-6.7" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:2266:76:5"></path><path d="M3 4v5h5" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:2305:77:5"></path><path d="M12 7v5l3 2"></path></svg>', 'solution')}
				{@render navButton('Settings', '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:335:9:3"><circle cx="12" cy="12" r="3" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:1003:36:5"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" "></path></svg>', 'settings')}

				{#if data.user}
					<button title={data.user.username || data.user.email} class="appearance-none cursor-pointer inline-flex items-center gap-1.5 bg-mint/12 border-[0.5px] border-mint/32 rounded-md px-3 h-8 text-mint text-[12px] font-medium font-mono tracking-[0.02em] transition-colors">
						{#if data.user.image}
							<div class="size-4.5 rounded-md overflow-hidden">
								<img src={data.user.image} alt={data.user.name} class="size-full object-cover" />
							</div>
						{/if}
						<span class="max-w-20 line-clamp-1 break-all text-ellipsis">
							{data.user.username || data.user.email}
						</span>
					</button>
				{:else}
					<button onclick={() => (showModal = 'login')} class="appearance-none cursor-pointer inline-flex items-center gap-1.5 bg-mint/12 border-[0.5px] border-mint/32 rounded-md px-3 h-8 text-mint text-[12px] font-medium font-mono tracking-[0.02em] transition-colors">
						<span>sign in</span>
					</button>
				{/if}

			</div>

		</nav>

		<div class="h-[0.5px] bg-border mb-6 -mx-5"></div>

		<main class="flex flex-col gap-5.5">
			{@render children()}

			<footer class="flex justify-between pt-4 text-[11px] text-muted">
				<span>
					cipherhunt.io &copy; {new Date().getFullYear()}. All rights reserved.
				</span>
				<span>
					<a href="/privacy" class="underline hover:text-mint/80">privacy policy</a> 
					· 
					<a href="/terms" class="underline hover:text-mint/80">terms of service</a>
				</span>
			</footer>

		</main>
	</div>
</div>

{#if showModal}

	<div class="w-screen h-screen top-0 left-0 fixed inset-0 z-1000 flex items-center justify-center p-6">
		<button onclick={() => showModal = null} class="w-screen h-screen top-0 left-0 fixed inset-0 bg-[rgba(20,20,20,0.62)] backdrop-blur-sm">
			<span class="sr-only">close modal</span>
		</button>

		<div style="animation: modal-in .25s ease-out both;" class="w-full max-w-130 bg-surface border-[0.5px] border-border rounded-md max-h-[calc(100vh-48px)] flex flex-col overflow-hidden">

			<div class="flex items-center justify-between py-4 px-4.5 border-b-[0.5px] border-border">
				
				<div class="text-[11px] font-medium tracking-widest uppercase text-muted">
					{#if showModal === 'leaderboard'}
						<span>
							Leaderboard · cipher #{currentCipherId}
						</span>
					{:else if showModal === 'solution'}
						<span>
							Yesterday's cipher · #{lastCipherId}
						</span>
					{:else if showModal === 'settings'}
						<span>
							Settings
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

				<button onclick={() => showModal = null} class="hover:text-text text-muted appearance-none bg-transparent border-[0.5px] border-border rounded-md size-7 inline-flex items-center justify-center cursor-pointer">
					<span class="sr-only">close modal</span>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:335:9:3"><path d="M6 6l12 12M18 6L6 18" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:1658:43:5"></path></svg>
				</button>

			</div>

			{#if showModal === 'leaderboard'}
				<div class="pt-3.5 px-4.5 pb-2.5 flex justify-between items-baseline">
					<div class="text-[13px] text-text">
						<span class="text-[13px] text-text">
							Today's Top Solvers
						</span>
					</div>
					<div class="text-[11px] text-muted">
						<span>
							Sorted by attempts · then time
						</span>
					</div>
				</div>

				<div class="pt-0 px-4.5 pb-4.5">
					<div class="grid grid-cols-[36px_1fr_76px_56px] gap-[12px] py-[8px] px-[12px] text-[10px] tracking-[0.08em] uppercase text-muted border-b-[0.5px] border-border">
						<span>
							#
						</span>
						<span>
							Username
						</span>
						<span class="text-right">
							Solved in
						</span>
						<span class="text-right">
							Att.
						</span>
					</div>
					<div class="max-h-[46vh] overflow-y-auto mt-0">
						{#each leaderboard as user, i}
							<div class="grid grid-cols-[36px_1fr_76px_56px] gap-3 p-3 border-b-[0.5px] border-border bg-transparent items-center">
								<span class="text-muted font-mono text-[12px]">
									{(i + 1).toString().padStart(2, '0')}
								</span>
								<span class="inline-flex items-center gap-2 min-w-0 text-[13px] text-text font-normal">
									{user.username}
								</span>
								<span class="font-mono text-[12px] text-sky text-right">
									{user.solveTime}
								</span>
								<span class="font-mono text-[12px] text-sky text-right">
									{user.attempts}/6
								</span>
							</div>
						{/each}
					</div>
					<div class="pt-3 px-4.5 border-t-[0.5px] border-border flex justify-between items-center text-[11px] text-muted gap-2.5">
						<span>
							Sign in to post your time
						</span>
						<span>
							{solvers} solvers today
						</span>
					</div>
				</div>
			{:else if showModal === 'solution'}
			{:else if showModal === 'settings'}
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
					}} class="appearance-none cursor-pointer w-full bg-card border-[0.5px] border-border-strong rounded-md py-2.75 px-3.5 text-text text-[13px] font-medium inline-flex items-center justify-center gap-2.5 transition-colors">
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
							<input type="email" name="email" id="email" class="appearance-none outline-none bg-card border-[0.5px] border-border-strong rounded-md py-2.5 px-3 font-mono text-[14px] text-text tracking-[0.02em]" placeholder="john@cipherhunt.io">
						</label>

						<label for="password" class="flex flex-col gap-1.5">
							<span class="text-[11px] tracking-[0.08em] uppercase text-muted font-medium">
								Password
							</span>
							<input type="password" name="password" id="password" class="appearance-none outline-none bg-card border-[0.5px] border-border-strong rounded-md py-2.5 px-3 font-mono text-[14px] text-text tracking-[0.02em]" placeholder="••••••••">
						</label>

						{#key `${showModal}${key}`}
							<div id="cf-turnstile" class="w-full h-16.25 bg-card border-[0.5px] border-border-strong rounded-md animate-pulse"></div>
						{/key}

						<button class="mt-2 appearance-none cursor-pointer w-full bg-card border-[0.5px] border-border-strong rounded-md py-2.75 px-3.5 text-text text-[13px] font-medium inline-flex items-center justify-center gap-2.5 transition-colors">
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
					}} class="appearance-none cursor-pointer w-full bg-card border-[0.5px] border-border-strong rounded-md py-2.75 px-3.5 text-text text-[13px] font-medium inline-flex items-center justify-center gap-2.5 transition-colors">
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
							<input type="email" name="email" id="email" class="appearance-none outline-none bg-card border-[0.5px] border-border-strong rounded-md py-2.5 px-3 font-mono text-[14px] text-text tracking-[0.02em]" placeholder="john@cipherhunt.io">
						</label>

						<label for="username" class="flex flex-col gap-1.5">
							<span class="text-[11px] tracking-[0.08em] uppercase text-muted font-medium">
								Username
							</span>
							<input type="text" name="username" id="username" class="appearance-none outline-none bg-card border-[0.5px] border-border-strong rounded-md py-2.5 px-3 font-mono text-[14px] text-text tracking-[0.02em]" placeholder="john_doe">
						</label>

						<label for="password" class="flex flex-col gap-1.5">
							<span class="text-[11px] tracking-[0.08em] uppercase text-muted font-medium">
								Password
							</span>
							<input type="password" name="password" id="password" class="appearance-none outline-none bg-card border-[0.5px] border-border-strong rounded-md py-2.5 px-3 font-mono text-[14px] text-text tracking-[0.02em]" placeholder="••••••••">
						</label>

						{#key `${showModal}${key}`}
							<div id="cf-turnstile" class="w-full h-16.25 bg-card border-[0.5px] border-border-strong animate-pulse rounded-md"></div>
						{/key}

						<button class="appearance-none cursor-pointer w-full bg-card border-[0.5px] border-border-strong rounded-md py-2.75 px-3.5 text-text text-[13px] font-medium inline-flex items-center justify-center gap-2.5 transition-colors">
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