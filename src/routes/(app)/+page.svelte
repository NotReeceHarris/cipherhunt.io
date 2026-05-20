<script lang="ts">

    import moment from 'moment';

    let todaysCipherId = 142;
    let todaysCipher = 'WKH RQOB WKLQJ ZH KDYH WRIHDU LV IHDU LWVHOI WKH RQOB WKLQJ ZH KDYH WRIHDU LV IHDU LWVHOI WKH RQOB WKLQJ ZH KDYH WRIHDU LV IHDU LWVHOI'
    let todaysSolvedCount = 847;
    let todaysStuckCount = 412;

    let todaysSolveRate = todaysSolvedCount > 0 ? ((todaysSolvedCount / (todaysSolvedCount + todaysStuckCount)) * 100).toFixed(0) : '0'

    let attempts = [
        { attempted: false, answer: '', correct: false },
        { attempted: false, answer: '', correct: false },
        { attempted: false, answer: '', correct: false },
        { attempted: false, answer: '', correct: false },
        { attempted: false, answer: '', correct: false },
        { attempted: false, answer: '', correct: false },
    ]

    let answer: string = $state('');

    $effect(() => {
        answer = answer.toLowerCase();
    });

</script>

{#snippet attempt(num: number = 0, attempted: boolean = false, anwser: string = "", correct: boolean = false)}
    <div class="flex items-center gap-2 border-[0.5px] {attempted ? 'bg-card  border-border' : 'border-dashed border-white/8'} rounded-md px-2.25 py-3.5 h-10.5">
        <div class="font-mono text-[10px] text-muted tracking-widest opacity-70 shrink-0">
            {num.toString().padStart(2, '0')}
        </div>
        {#if attempted}
            <div class="flex-[1_1_0%] font-mono text-[13px] {correct ? 'text-text' : 'text-muted'} whitespace-nowrap overflow-hidden text-ellipsis tracking-[0.02em]">
                {anwser}
            </div>
            <div class="shrink-0 inline-flex items-center gap-1.25 text-[11px] font-medium py-1 px-2.25 rounded-md border-[0.5px] {correct ? 'bg-mint/18 border-mint/36 text-mint' : 'bg-white/3 border-border text-muted'} font-sans tracking-[0.02em]">
                <span>{correct ? '✓' : '✗'}</span>
                <span>{correct ? 'correct' : 'wrong'}</span>
            </div>
        {:else}
            <div class="flex-[1_1_0%] h-px bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_4px,transparent_4px,transparent_8px)]"></div>
        {/if}
    </div>
{/snippet}

<section class="flex flex-col gap-2">

    <header class="flex items-baseline justify-between px-0.5">
        <div class="text-[11px] tracking-widest uppercase text-muted font-medium">
            <span>Today's cipher</span>
        </div>
        <div class="font-mono text-[11px] text-muted">
            <span>
                #{todaysCipherId}
            </span>
            <span>
                {moment().format(' · Do MMMM YYYY')}
            </span>
        </div>
    </header>

    <div class="bg-sky/5 border-[0.5px] border-sky/18 rounded-md p-5 font-mono font-normal text-[16px] text-mint tracking-[0.15em] leading-[1.85] overflow-x-hidden overflow-y-auto wrap-break-word">{todaysCipher}</div>

</section>

<div class="flex items-center justify-between gap-3.5 bg-surface border-[0.5px] border-border rounded-md px-2.5 py-3.5">
    
    <div class="flex items-center gap-4.5 flex-wrap">

        <div class="flex items-center gap-2 min-w-0">
            <span class="font-mono text-[13px] font-medium text-mint tracking-[0.02em]">
                ✓
            </span>
            <div class="flex flex-col leading-[1.15]">
                <span class="font-mono text-[13px] text-text font-medium tracking-[0.01em]">
                    {todaysStuckCount}
                </span>
                <span class="uppercase text-[10px] text-muted tracking-[0.06em]">
                    Solved today
                </span>
            </div>
        </div>

        <div class="w-px h-6 bg-border"></div>

        <div class="flex items-center gap-2 min-w-0">
            <span class="font-mono text-[13px] font-medium text-muted tracking-[0.02em]">
                ✗
            </span>
            <div class="flex flex-col leading-[1.15]">
                <span class="font-mono text-[13px] text-text font-medium tracking-[0.01em]">
                    {todaysSolvedCount}
                </span>
                <span class="uppercase text-[10px] text-muted tracking-[0.06em]">
                    Stuck today
                </span>
            </div>
        </div>

    </div>

    <div class="flex flex-col gap-0.75 min-w-0 w-30">
        <div class="font-mono text-[13px] text-mint tabular-nums">
            {
                todaysSolveRate
            }<span class="text-muted text-[11px] white">
                <span>
                    % solve rate
                </span>
            </span>
        </div>
        <div class="w-full h-0.75 rounded-xs bg-white/6 overflow-hidden">
            <div style="width: {todaysSolveRate}%;" class="h-full bg-mint/70"></div>
        </div>
    </div>

</div>


<section class="flex flex-col gap-2 bg-surface border-[0.5px] border-border rounded-md px-4 pt-4 pb-4.5">

    <div class="text-[11px] tracking-widest uppercase text-muted font-medium pt-px px-0.5 pb-1">
        <span>Attempts</span>
    </div>

    <div class="flex flex-col gap-2">

        {#each attempts as { attempted, answer, correct }, index}
            {@render attempt(index + 1, attempted, answer, correct)}
        {/each}

    </div>

    <div class="flex justify-between items-center px-0.5 mt-1.5">

        <div class="text-[12px] text-muted">
            <span class="text-text font-mono">
                {attempts.filter(a => a.attempted).length}
            </span>
            <span>
                of
            </span>
            <span class="font-mono">
                {attempts.length}
            </span>
            <span>
                attempts used
            </span>
        </div>

        <div class="flex gap-1.5">
            {#each attempts as { attempted }, index}
                <div class="size-2 rounded-xs border-[0.5px] border-muted {attempted ? 'bg-muted opacity-55' : 'bg-transparent'}"></div>
            {/each}
        </div>

    </div>

</section>

<div class="flex flex-col gap-1.5">

    <div class="flex items-center gap-2 bg-card border border-border-strong rounded-md py-1.5 px-1.5 pl-3.5">
        <input bind:value={answer} type="text" name="answer" id="answer" class="flex-[1_1_0%] min-w-0 appearance-none outline-none bg-transparent py-2 font-mono text-[14px] text-text tracking-[0.02em]" placeholder="Type your answer here...">
        <button class="appearance-none border-[0.5px]  rounded-md py-2 px-3.5 font-mono text-[12px] font-medium tracking-[0.03em] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap {answer ? 'cursor-pointer border-mint/36 bg-mint/16 text-mint' : 'cursor-default bg-transparent border-border text-muted'}">
            <span>
                submit
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:335:9:3"><path d="M5 12h14M13 6l6 6-6 6" data-om-id="jsx:/https:/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb.claudeusercontent.com/v1/design/projects/cf29dfbe-6a21-46d5-bcff-383c3e39d5bb/serve/app.jsx:1994:62:5"></path></svg>
        </button>
    </div>

    <div class="flex justify-between items-center px-0.5">
        <div class="text-[11px] text-muted">
            <span>
                Press Enter to submit · max 10 words
            </span>
        </div>
        <div class="font-mono text-[10px] tracking-[0.04em] text-muted opacity-50 whitespace-nowrap transition-colors">
            <span>
                {answer.length ? answer.trim().split(' ').length : '0'}/10 words
            </span>
        </div>
    </div>

</div>