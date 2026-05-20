<script lang="ts">
	import '../layout.css';
	import moment from 'moment';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { username } from 'better-auth/plugins';

	let { children } = $props();
	let timeUntilMidnight = $state(getTimeUntilMidnight());
	let showModal: null | 'leaderboard' | 'solution' | 'settings' = $state(null);
	
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

	onMount(() => {
		const interval = setInterval(() => {
			timeUntilMidnight = getTimeUntilMidnight();
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

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
			{/if}

		</div>

	</div>

{/if}