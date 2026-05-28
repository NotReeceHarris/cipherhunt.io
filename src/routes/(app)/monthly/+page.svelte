<script lang="ts">

    import moment from 'moment';
    import { onMount, onDestroy } from 'svelte';
    import { between } from '$lib/utils/random';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
    import { formatDuration } from '$lib/utils/time';
    import { getContext } from 'svelte';
    import { splitIntoParagraphs } from '$lib/utils/typography';

    const { data } = $props();
    let answer: string = $state('');
    let key: number = $state(0);
    let interval: NodeJS.Timeout | null = $state(null);
    let captchaKey: number = $state(0);

    let cipher = $derived(data.puzzle.ciphertext || 'Unable to load puzzle.');
    let hint = $derived(data.puzzle.hint || 'No hint available.');

    let solvers = $derived(data.stats.solvedCount || 0);
    let avgTime = $derived(formatDuration(data.stats.avgTime || 0));
    let firstSolver = $derived(data.stats.firstSolver || 'Unsolved');

    let showHintModal: boolean = $state(false);

    const loginModal = getContext<{
		open: boolean;
		openModal: () => void;
		closeModal: () => void;
	}>('login_modal');

    async function loadTurnstile() {

		const existing = document.querySelector('#cf-turnstile-submit');
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

        turnstile.render('#cf-turnstile-submit', {
            sitekey: data.TURNSTILE_SITE_KEY,
            theme: 'dark',
            size: 'flexible',
            appearance: 'interaction-only',
            callback: function(token) {
                console.log('Success:', token);
            }
        });
    }

	$effect(() => {
        if (captchaKey) loadTurnstile();
    })

    $effect(() => {
        answer = answer.toLowerCase();
    });

    onMount(async () => {
        interval = setInterval(() => key = key === 1 ? 0 : 1, 1000);
        loadTurnstile();
    })

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });

</script>

<div class="relative bg-surface rounded-xs pt-6.5 px-7.5 pb-5.5 mt-10">

    <div style="top: {between(-1, 3)}px;left: {between(-30, -34)}px;transform: rotate({between(-39, -32)}deg);" class="absolute w-27.5 h-6.5 origin-[center_center_0px] bg-tape"></div>
    <div style="top: {between(-1, 3)}px;right: {between(-30, -34)}px;transform: rotate({between(39, 32)}deg);" class="absolute w-27.5 h-6.5 origin-[center_center_0px] bg-tape"></div>

    <div class="font-mono text-[11px] font-normal text-muted tracking-[0.12em] uppercase">
        <span>
            monthly
        </span>
    </div>

    <pre class="mt-4.5 mb-5.5 font-mono font-bold text-[25px] leading-tight tracking-wider text-text whitespace-pre-wrap wrap-break-word">{cipher}</pre>

    <hr class="border-t-px border-border m-0">

    <div class="flex justify-between items-center pt-3 font-mono text-[10.5px] text-muted tracking-[0.06em]">
        {#key key}
            <span>{moment().startOf('month').format('Do MMM YYYY').toLowerCase()} · 00:00 utc</span>
            <span>resets in {moment().endOf('month').diff(moment(), 'days')}d {moment().endOf('day').diff(moment(), 'hours') % 24}h {moment().endOf('day').diff(moment(), 'minutes') % 60}m {moment().endOf('day').diff(moment(), 'seconds') % 60}s</span>
        {/key}
    </div>

</div>

<div class="flex flex-col gap-3">

    {#if !data.user}
        <div class="font-sans font-light text-[13px] text-muted leading-normal">
            <span>Solves count toward the leaderboard once you</span>
            <button onclick={loginModal.openModal} class="appearance-none cursor-pointer bg-transparent border-b border-border-strong p-0 text-text">
                sign in
            </button>
            <span>.</span>
        </div>
    {/if}

    <form class="flex flex-col gap-2" method="POST" use:enhance={async () => {
        return async ({ result }) => {

            captchaKey++

            if (result.type === "success") {
                toast.success('Correct! Your solve has been submitted.')
                await invalidateAll()
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

        {#key captchaKey}
            <div id="cf-turnstile-submit" class="w-full max-h-16.25 bg-card rounded-xs"></div>
        {/key}

        <div class="flex items-center gap-2 bg-surface border border-border rounded-xs px-4.5">
            <input type="text" name="decoded" id="decoded" bind:value={answer} placeholder="type the decoded plaintext..." class="flex-[1_1_0%] min-w-0 appearance-none outline-none border-0 bg-transparent py-4 font-mono font-normal text-[14px] text-text tracking-[0.02em]">
            <button disabled={!answer} class="{!!answer ? 'text-[#dcbb6e]' : 'text-muted opacity-80'} appearance-none bg-transparent border-0 pt-4 pr-0 pb-4 pl-3 cursor-pointer font-mono font-bold text-[13px] tracking-[0.06em] whitespace-nowrap">
                submit →
            </button>
        </div>

        <div class="min-h-4.5 font-mono text-[11px] text-muted tracking-[0.04em]">
            <span>↵ enter to submit · case-insensitive</span>
        </div>

    </form>

    <div class="font-sans font-light text-[13px] text-muted leading-normal mt-3">
        <span>
            Need a hint? The hint won't give away the solution, but it may help nudge you in the right direction.
        </span>
        <button onclick={() => showHintModal = true} class="appearance-none cursor-pointer bg-transparent border-b border-border-strong p-0 text-text">
            Show hint
        </button>
        <span>.</span>
    </div>

</div>

<div class="grid grid-cols-3 border-y border-border gap-x-6 mt-auto">

    <div class="flex flex-col gap-1.5 py-4.5">
        <span class="font-mono text-[11px] text-muted tracking-[0.12em] uppercase">
            Solvers
        </span>
        <span class="font-mono text-[16px] font-normal text-text tracking-[0.02em] line-clamp-1 wrap-break-word text-ellipsis overflow-hidden">
            {solvers.toLocaleString()}
        </span>
    </div>

    <div class="flex flex-col gap-1.5 py-4.5 pl-6 border-l border-border">
        <span class="font-mono text-[11px] text-muted tracking-[0.12em] uppercase">
            AVG Time
        </span>
        <span class="font-mono text-[16px] font-normal text-text tracking-[0.02em]">
            {avgTime}
        </span>
    </div>

    <div class="flex flex-col gap-1.5 py-4.5 pl-6 border-l border-border">
        <span class="font-mono text-[11px] text-muted tracking-[0.12em] uppercase">
            First to solve
        </span>
        {#if solvers === 0}
            <span class="font-mono text-[16px] font-normal text-text/70 tracking-[0.02em] line-clamp-1 wrap-break-word text-ellipsis overflow-hidden">
                unsolved
            </span>
        {:else}
            <span class="font-mono text-[16px] font-normal text-text tracking-[0.02em] line-clamp-1 wrap-break-word text-ellipsis overflow-hidden">
                {firstSolver}
            </span>
        {/if}
    </div>

</div>

{#if showHintModal}
    <div class="w-screen h-screen top-0 left-0 fixed inset-0 z-1000 flex items-center justify-center p-6">
		<button onclick={() => showHintModal = false} class="w-screen h-screen top-0 left-0 fixed inset-0 bg-[rgba(20,20,20,0.62)] backdrop-blur-sm">
			<span class="sr-only">close modal</span>
		</button>

		<div style="animation: modal-in .25s ease-out both;" class="w-full max-w-130 bg-surface border-[0.5px] border-border rounded-xs max-h-[calc(100vh-48px)] flex flex-col overflow-hidden">

			<div class="flex items-center justify-between py-4 px-4.5 border-b-[0.5px] border-border">
				
				<div class="text-[11px] font-normal tracking-widest uppercase text-muted">
					<span>
                        Hint
                    </span>
				</div>

				<button onclick={() => showHintModal = false} class="hover:text-text text-muted appearance-none bg-transparent border-[0.5px] border-border rounded-xs size-7 inline-flex items-center justify-center cursor-pointer">
					<span class="sr-only">close modal</span>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:335:9:3"><path d="M6 6l12 12M18 6L6 18" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:1658:43:5"></path></svg>
				</button>

			</div>

			<div class="p-5 overflow-y-auto max-h-[60vh] markdown-body">
                {#each splitIntoParagraphs(hint) as  paragraph}
                    <p class="text-text text-[14px] font-normal tracking-[0.02em] mb-2 last:mb-0">
                        {paragraph}
                    </p>
                {/each}
            </div>

		</div>

	</div>
{/if}