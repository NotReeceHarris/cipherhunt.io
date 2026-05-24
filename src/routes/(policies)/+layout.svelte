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
	<div class="w-full max-w-270 flex flex-col">

		<header class="flex items-center justify-between pt-6 pb-8">

			<a href="https://cipherhunt.io/policies" class="font-mono font-normal text-[13px] tracking-[0.02em]">
				<span>cipherhunt</span><span class="text-muted">.io/policies</span>
			</a>

			<a href="/" class="appearance-none bg-transparent border-medium p-0 font-mono text-[11px] text-muted tracking-[0.04em] uppercase cursor-pointer transition-colors hover:text-text">
				<span>back to cipher</span>
			</a>

		</header>

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
