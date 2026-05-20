<script lang="ts">
	import '../layout.css';
	import moment from 'moment';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	let { children } = $props();
	let timeUntilMidnight = $state(getTimeUntilMidnight());
	let showModal: null | 'leaderboard' | 'solution' | 'settings' = $state(null);

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

				{@render navButton('Leaderboard', '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:335:9:3"><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:762:26:5"></path><path d="M8 6H5v1a3 3 0 0 0 3 3" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:805:27:5"></path><path d="M16 6h3v1a3 3 0 0 1-3 3" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:845:28:5"></path><path d="M10 16h4v3h-4z"></path><path d="M8 20h8"></path></svg>')}
				{@render navButton('Last Challenge Solution', '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:335:9:3"><path d="M3 12a9 9 0 1 0 3-6.7" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:2266:76:5"></path><path d="M3 4v5h5" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:2305:77:5"></path><path d="M12 7v5l3 2"></path></svg>')}
				{@render navButton('Settings', '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:335:9:3"><circle cx="12" cy="12" r="3" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:1003:36:5"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" "></path></svg>')}

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
