<script lang="ts">

    import moment from 'moment';
    import { onMount, onDestroy } from 'svelte';
    import { between } from '$lib/utils/random';

    const { data } = $props();
    let answer: string = $state('');
    let key: number = $state(0);
    let interval: NodeJS.Timeout | null = $state(null);

    let cipherId = data.puzzle.id;
    let cipher = data.puzzle.ciphertext;
    let solvers = 8732;
    let avgTime = '14:08';
    let firstSolver = 'cryptic_carl';

    $effect(() => {
        answer = answer.toLowerCase();
    });

    onMount(async () => {
        interval = setInterval(() => key = key === 1 ? 0 : 1, 1000);
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
            weekly
        </span>
    </div>

    <pre class="mt-4.5 mb-5.5 font-mono font-bold text-[25px] leading-tight tracking-wider text-text whitespace-pre-wrap wrap-break-word">{cipher}</pre>

    <hr class="border-t-px border-border m-0">

    <div class="flex justify-between items-center pt-3 font-mono text-[10.5px] text-muted tracking-[0.06em]">
        {#key key}
            <span>{moment().startOf('isoWeek').format('Do MMM YYYY').toLowerCase()} · 00:00 utc</span>
            <span>resets in {moment().endOf('isoWeek').diff(moment(), 'days')}d {moment().endOf('day').diff(moment(), 'hours') % 24}h {moment().endOf('day').diff(moment(), 'minutes') % 60}m {moment().endOf('day').diff(moment(), 'seconds') % 60}s</span>
        {/key}
    </div>

</div>

<div class="flex flex-col gap-3 pt-1.5">

    {#if !data.user}
        <div class="pt-0.5 font-sans font-light text-[13px] text-muted leading-normal">
            <span>Solves count toward the leaderboard once you</span>
            <button class="appearance-none cursor-pointer bg-transparent border-b border-border-strong p-0 text-text">
                sign in
            </button>
            <span>.</span>
        </div>
    {/if}

    <div class="flex flex-col gap-2">

        <div class="flex items-center gap-2 bg-surface border border-border rounded-xs px-4.5">
            <input type="text" name="decoded" id="decoded" bind:value={answer} placeholder="type the decoded plaintext..." class="flex-[1_1_0%] min-w-0 appearance-none outline-none border-0 bg-transparent py-4 font-mono font-normal text-[14px] text-text tracking-[0.02em]">
            <button disabled={!answer} class="{!!answer ? 'text-[#dcbb6e]' : 'text-muted opacity-80'} appearance-none bg-transparent border-0 pt-4 pr-0 pb-4 pl-3 cursor-pointer font-mono font-bold text-[13px] tracking-[0.06em] whitespace-nowrap">
                submit →
            </button>
        </div>

        <div class="min-h-4.5 font-mono text-[11px] text-muted tracking-[0.04em]">
            <span>↵ enter to submit · case-insensitive</span>
        </div>

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
        <span class="font-mono text-[16px] font-normal text-text tracking-[0.02em] line-clamp-1 wrap-break-word text-ellipsis overflow-hidden">
            {firstSolver}
        </span>
    </div>

</div>