<script lang="ts">
    import { Toaster } from 'svelte-sonner'

    const { children } = $props();
</script>

<Toaster />
{@render children()}