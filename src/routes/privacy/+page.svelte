<script lang="ts">

    import moment from 'moment';
	import { onMount } from 'svelte';

    let lastUpdated = new Date('2024-01-01T00:00:00Z');
    let effectiveDate = new Date('2024-02-01T00:00:00Z');

    let content = [
        {
            title: 'Introduction',
            href: 'intro',
            content: `<p>This Privacy Policy explains how cipherhunt.io ("cipherhunt", "we", "us") collects, uses, and shares information about you when you visit our website, create an account, or submit answers to the daily cipher.</p><p>We've tried to keep this short and readable. Where we use a legal term that matters, we've defined it. If anything is unclear, email <strong>legal@cipherhunt.io</strong>.</p>`
        },
        {
            title: 'Key terms',
            href: 'definitions',
            content: `<p>These terms have the same meaning throughout this document:</p><dl class="deftable"><div class="defrow"><dt>Service</dt><dd>The cipherhunt.io website, daily puzzle, leaderboard, and any related apps.</dd></div><div class="defrow"><dt>Account</dt><dd>The credentials and profile you create when registering, including a username and (optionally) an email or linked GitHub identity.</dd></div><div class="defrow"><dt>Attempt</dt><dd>A guess you submit for the current day's cipher.</dd></div><div class="defrow"><dt>Personal data</dt><dd>Information that identifies you or could reasonably be linked to you.</dd></div></dl>`
        },
        {
            title: 'Information we collect',
            href: 'data-collected',
            content: `<p>We collect three categories of information.</p><ul><li><strong>Account data.</strong> When you register: username, password hash, and either an email address or a GitHub user ID. We never see your password in plaintext.</li><li><strong>Gameplay data.</strong> Your daily attempts, solve times, attempt counts, current streak, and whether you have opted to link your handle to GitHub on the leaderboard.</li><li><strong>Technical data.</strong> Anonymised IP, user agent, viewport size, and basic request logs. We retain these for 30 days, then they're aggregated and the raw form is deleted.</li></ul><div class="callout"><span class="label">What we don't collect</span>We don't ask for your real name, phone number, location, contacts, or payment info. The Service has no advertising, so we don't build ad profiles of you.</div>`
        },
        {
            title: 'How we use it',
            href: 'how-we-use',
            content: `<p>We use information collected through the Service to:</p><ul><li>Run the daily puzzle — accepting your attempts, scoring them, and showing your history.</li><li>Operate the public leaderboard, including the optional GitHub-link feature.</li><li>Detect and prevent abuse — automated solvers, multi-account leaderboard inflation, and similar.</li><li>Send transactional messages (account verification, password reset). We do <strong>not</strong> send marketing email.</li></ul>`
        },
        {
            title: 'The leaderboard & GitHub linking',
            href: 'leaderboard',
            content: `<p>If you appear on the daily leaderboard, your username, solve time, and attempt count are publicly visible to anyone who loads the leaderboard.</p><p>If you signed in with GitHub <em>and</em> you've enabled <strong>“Link leaderboard name to GitHub”</strong> in Settings, your leaderboard row becomes a hyperlink to <strong>github.com/&lt;your-handle&gt;</strong>. This setting is off by default. Disabling it removes the link immediately on next page load — your handle stays on the leaderboard but is no longer clickable.</p><div class="callout"><span class="label">Reminder</span>Anything on a public leaderboard is, by definition, public. Don't link to a GitHub profile you wouldn't want associated with your puzzle activity.</div>`
        },
        {
            title: 'Cookies & local storage',
            href: 'cookies',
            content: `<p>We use a single first-party session cookie to keep you signed in, and browser <em>localStorage</em> to remember your in-progress attempts and your settings (hard mode, lowercase, GitHub link). We don't use third-party analytics or advertising cookies.</p><p>Clearing site data in your browser will sign you out and reset your local settings, but your server-side account, history, and rank remain intact.</p>`
        },
        {
            title: 'Who we share data with',
            href: 'sharing',
            content: `<p>We share personal data only with the small set of vendors required to operate the Service, under contractual confidentiality and data-protection obligations:</p><ul><li><strong>Infrastructure</strong> — our hosting provider, for serving the site and storing the database.</li><li><strong>Email delivery</strong> — for transactional messages only.</li><li><strong>GitHub</strong> — only if you choose to sign in or link via GitHub OAuth.</li></ul><p>We <strong>do not</strong> sell, rent, or trade personal data, and we don't share it with advertisers or data brokers.</p>`
        },
        {
            title: 'Your rights & choices',
            href: 'your-rights',
            content: `<p>Wherever you live, you can:</p><ul><li><strong>Export</strong> a copy of your account and gameplay data as JSON.</li><li><strong>Correct</strong> your username or email.</li><li><strong>Delete</strong> your account, which removes your handle from future leaderboards and erases your stored attempts within 30 days.</li><li><strong>Object</strong> to specific processing or withdraw consent for optional features (e.g., GitHub linking) at any time.</li></ul><p>Email <strong>privacy@cipherhunt.io</strong> to exercise any of these rights. You don't need to give a reason.</p>`
        },
        {
            title: 'Retention',
            href: 'retention',
            content: `<p>We keep account and gameplay data for as long as your account is active. Request logs are kept for 30 days. After account deletion, we retain a small audit record (account ID + deletion timestamp) for 12 months for abuse-prevention purposes, and then it's removed.</p>`
        },
        {
            title: 'Security',
            href: 'security',
            content: `<p>Passwords are hashed with a modern key-derivation function (argon2id). The site is served over TLS only. Database backups are encrypted at rest. No system is perfectly secure — if we ever discover a breach affecting your data, we'll notify you and the relevant regulator within 72 hours of confirmation.</p>`
        }
        ,{
            title: 'Changes to this policy',
            href: 'changes',
            content: `<p>We'll update the date at the top of this page whenever we change anything. For material changes — new categories of data, new sharing — we'll also notify signed-in users by email and via an in-app banner before the change takes effect.</p>`
        }
    ]

    let currentSection = $state(content[0].href);

    onMount(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100; // Add some offset for better section detection
            let foundSection = content[0].href;

            for (const item of content) {
                const section = document.getElementById(item.href);
                if (section && section.offsetTop <= scrollPosition) {
                    foundSection = item.href;
                } else {
                    break;
                }
            }

            currentSection = foundSection;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    })

</script>

<div class="flex flex-col gap-3.5 mb-5">
    <h1 class="font-mono font-medium text-[34px] tracking-[-0.015em] leading-[1.15] m-0 text-text">
        Privacy Policy
    </h1>
    <div class="flex flex-wrap gap-4.5 items-center text-[12px] text-muted">

        <span>
            Last updated
            <span class="text-text">
                {moment(lastUpdated).format('MMM D, YYYY')}
            </span>
        </span>

        <span>·</span>

        <span>
            Effective
            <span class="text-text">
                {moment(effectiveDate).format('MMM D, YYYY')}
            </span>
        </span>

    </div>
</div>

<div class="grid grid-cols-[220px_1fr] gap-12 items-start">
    <aside class="sticky top-6">
        
        <div class="text-[10px] tracking-[0.12em] uppercase text-muted/50 font-mono mb-2.5 pl-3">
            Contents
        </div>

        <nav class="flex flex-col gap-px min-h-[calc(100vh-48px)] overflow-y-auto pr-1">
            
            {#each content as item, i}
                <a href="#{item.href}" class="flex items-baseline gap-2.5 py-1.75 px-3 text-[12px] border-l-[0.5px] border-border transition-colors leading-normal {currentSection === item.href ? 'border-mint text-mint bg-mint/5' : 'group text-muted'}">
                    <span class="font-mono text-[10px] text-muted/50 shrink-0">
                        {(i+1).toString().padStart(2, '0')}
                    </span>
                    <span class="group-hover:text-text transition-colors">
                        {item.title}
                    </span>
                </a>
            {/each}

        </nav>

    </aside>

    <main class="terms">

        {#each content as item, i}
            <section id={item.href} class="pt-6 pb-7 border-b-[0.5px] border-border">
                <div class="flex items-baseline gap-3.5 mb-3.5">
                    <span class="font-mono text-[11px] text-muted/50 tracking-[0.06em] pt-0.5">
                        {(i+1).toString().padStart(2, '0')}
                    </span>
                    <h2 class="font-sans font-semibold text-[18px] tracking-[-0.005em] text-text m-0 leading-[1.35]">
                        {item.title}
                    </h2>
                </div>
                <div class="content">
                    {@html item.content}
                </div>
            </section>
        {/each}

    </main>
</div>