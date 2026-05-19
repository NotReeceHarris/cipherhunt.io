<script lang="ts">

    import moment from 'moment';

    let todaysCipherId = 142;
    let todaysCipher = 'WKH RQOB WKLQJ ZH KDYH WRIHDU LV IHDU LWVHOI WKH RQOB WKLQJ ZH KDYH WRIHDU LV IHDU LWVHOI WKH RQOB WKLQJ ZH KDYH WRIHDU LV IHDU LWVHOI'

</script>

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
                {moment().format(' · DDDD Do MMMM YYYY')}
            </span>
        </div>
    </header>

    <div class="bg-sky/5 border-[0.5px] border-sky/18 rounded-md px-5 py-5.5 font-mono font-normal text-[16px] text-mint tracking-[0.15em] leading-[1.85] overflow-x-hidden overflow-y-auto wrap-break-word">{todaysCipher}</div>

</section>

<div class="flex items-center justify-between gap-3.5 bg-surface border-[0.5px] border-border rounded-md px-2.5 py-3.5">
    
    <div class="flex items-center gap-4.5 flex-wrap"></div>
    <div></div>

</div>