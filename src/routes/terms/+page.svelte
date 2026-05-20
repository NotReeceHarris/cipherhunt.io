<script lang="ts">

    import moment from 'moment';
	import { onMount } from 'svelte';

    let lastUpdated = new Date('2024-01-01T00:00:00Z');
    let effectiveDate = new Date('2024-02-01T00:00:00Z');

    let content = [
        {
            title: 'Acceptance of these terms',
            href: 'acceptance',
            content: `<p>By accessing or using cipherhunt.io (the "Service"), you agree to these Terms of Service ("Terms") and to our Privacy Policy. If you don't agree, please don't use the Service.</p><p>You must be at least 13 years old to create an account. If you're under the age of majority in your jurisdiction, you confirm a parent or guardian has reviewed these Terms with you.</p>`
        },
        {
            title: 'What cipherhunt is',
            href: 'the-service',
            content: `<p>cipherhunt publishes one cryptographic puzzle per day at <strong>00:00 UTC</strong>. Each player gets up to <strong>six attempts</strong> to submit the plaintext. Feedback is binary — correct or wrong — with no partial hints. The puzzle resets daily; your rank, streak, and history accumulate across days.</p><p>We may change puzzle mechanics, difficulty, or scheduling at any time. We'll announce material changes on the homepage at least 7 days in advance.</p>`
        },
        {
            title: 'Your account',
            href: 'your-account',
            content: `<p>You're responsible for the username you pick, keeping your password secret, and everything that happens under your account. Pick a username that doesn't impersonate someone else, contain slurs, or violate someone's trademark. We may rename or reclaim usernames that breach this rule.</p><p>You may use one account at a time. Creating additional accounts to inflate your leaderboard standing, evade a suspension, or game streak counters is a breach of these Terms.</p>`
        },
        {
            title: 'Fair play',
            href: 'fair-play',
            content: `<p>The daily puzzle is meant to be solved by humans. The following are <strong>not allowed</strong> and will result in your attempts being voided and, on repeat offence, your account suspended:</p><ul><li>Submitting attempts via automated scripts, brute-force tools, or large-language-model wrappers that solve on your behalf.</li><li>Sharing the day's answer publicly before <strong>23:00 UTC</strong> — i.e., before the puzzle window closes.</li><li>Coordinating attempts across multiple accounts you control or accounts you don't own.</li><li>Probing or scraping the API beyond ordinary gameplay.</li></ul><div class="callout"><span class="label">Spoilers</span>Hints and partial reasoning are fine after the puzzle is solved. Full answers — yours or anyone else's — should wait until the window closes. The Yesterday's Cipher walkthrough exists for exactly this.</div>`
        },
        {
            title: 'Content & ownership',
            href: 'content',
            content: `<p><strong>Our content.</strong> The puzzles, walkthroughs, site design, branding, and code are owned by cipherhunt or our licensors. You may share short excerpts and screenshots for editorial, educational, or social-media use, with attribution and without modifying our marks.</p><p><strong>Your content.</strong> You keep ownership of anything you submit — attempts, profile data, feedback. You grant us a narrow, royalty-free licence to store, display, and process that content as needed to run the Service (for example: showing your username and time on the leaderboard).</p><p>If you send us feedback or suggestions, we may use them to improve cipherhunt without obligation or compensation to you.</p>`
        },
        {
            title: 'Leaderboard rules',
            href: 'leaderboard-rules',
            content: `<p>Appearing on the leaderboard is voluntary in the sense that you choose to play, but visible by default once you solve. You can hide your handle by signing out before submitting, or delete past entries by deleting your account.</p><p>Linking your handle to a GitHub profile (in Settings) is opt-in and reversible. You're responsible for the contents of any external profile you link.</p>`
        },
        {
            title: 'Acceptable use',
            href: 'acceptable-use',
            content: `<p>Don't use the Service to:</p><ul><li>Harass, threaten, or impersonate other players or our staff.</li><li>Distribute malware, spam, or phishing through any user-visible surface (usernames, profile links).</li><li>Reverse-engineer, decompile, or extract puzzles from the Service except where local law gives you a non-waivable right to do so.</li><li>Use the Service to violate any law that applies to you.</li></ul>`
        },
        {
            title: 'Suspension & termination',
            href: 'suspension',
            content: `<p>We may suspend or terminate your account if you breach these Terms, if continued access poses a security risk, or if required by law. Where the breach is minor and remediable, we'll warn you first. Where it's not — automation, large-scale abuse — we may act immediately.</p><p>You can close your account at any time from Settings. Closing your account removes your handle from future leaderboards; we retain limited records as described in the Privacy Policy.</p>`
        },
        {
            title: 'Disclaimers',
            href: 'disclaimer',
            content: `<p>The Service is provided <strong>“as is”</strong> and <strong>“as available”</strong>. We don't promise that puzzles will always be solvable, that the leaderboard will always be accurate, or that the Service will be free of interruption or error. To the maximum extent permitted by law, we disclaim implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>`
        },
        {
            title: 'Limitation of liability',
            href: 'liability',
            content: `<p>To the extent permitted by law, cipherhunt and its operators will not be liable for indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, data, or goodwill, arising out of your use of the Service. Our total cumulative liability under these Terms will not exceed <strong>USD $50</strong> or the amount you've paid us in the prior twelve months, whichever is greater. (Today, that amount is $0 — cipherhunt is free.)</p>`
        },
        {
            title: 'Governing law & disputes',
            href: 'law',
            content: `<p>These Terms are governed by the laws of England and Wales, without regard to conflict-of-laws principles. Disputes that can't be resolved by email will be brought exclusively before the courts of London, United Kingdom — except that you may bring claims in your local consumer courts where local law gives you that right.</p>`
        },
        {
            title: 'Changes to these terms',
            href: 'changes-terms',
            content: `<p>We may update these Terms from time to time. For material changes we'll give you 30 days' notice by email and an in-app banner. Continued use of the Service after the effective date means you accept the updated Terms; if you don't, please close your account before that date.</p>`
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
        Terms of Service
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