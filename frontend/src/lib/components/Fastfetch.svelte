<script lang="ts">
  import { portfolioData } from '../../stores/portfolioStore';
  import { currentTheme } from '../../stores/themeStore';
  import { executeCommand } from '../../utils/commands';

  const DEFAULT_ASCII = `
                    'c.
                 ,xNMM.
               .OMMMMo
               OMMM0,
     .;loddo:' loddol;.
   cKMMMMMMMMMMNWMMMMMMK.
 .KMMMMMMMMMMMMMMMMMMMMMK.
 :MMMMMMMMMMMMMMMMMMMMMMM:
 :MMMMMMMMMMMMMMMMMMMMMMM:
 .KMMMMMMMMMMMMMMMMMMMMMK.
   cKMMMMMMMMMMNWMMMMMMK.
     .;loddo:' loddol;.
               OMMM0,
               .OMMMMo
                 ,xNMM.
                    'c.
`.trim();

  const PALETTE_BLOCKS = ['#22272e', '#e5534b', '#57ab5a', '#c69026', '#539bf5', '#b083f0', '#39c5cf', '#909dab'];
  const BRIGHT_BLOCKS = ['#545d68', '#f47067', '#6bc46d', '#daaa3f', '#6cb6ff', '#dcbdfb', '#56d4dd', '#cdd9e5'];
</script>

<div class="my-3 font-mono text-xs md:text-sm select-text">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
    <!-- ASCII Art / Logo -->
    <div class="lg:col-span-4 flex flex-col items-center sm:items-start text-cyan-400 font-bold leading-tight select-none">
      <pre class="text-[10px] sm:text-xs leading-none drop-shadow-[0_0_8px_rgba(56,189,248,0.4)] text-emerald-400">
{$portfolioData?.profile.fastfetch_ascii || DEFAULT_ASCII}
      </pre>
      <div class="mt-2 text-xs text-slate-400 text-center sm:text-left">
        <span class="text-amber-300 font-bold">{$portfolioData?.profile.name || 'Ansh Kashyap'}</span>'s MacBook Pro
      </div>
    </div>

    <!-- System Specs & Profile Info -->
    <div class="lg:col-span-8 space-y-1 text-slate-300">
      <!-- Title Header -->
      <div class="font-bold text-sm sm:text-base border-b border-white/10 pb-1 flex items-center space-x-1">
        <span style="color: {$currentTheme.promptUser}">{$portfolioData?.profile.handle || 'ansh'}</span>
        <span class="text-slate-400">@</span>
        <span style="color: {$currentTheme.promptHost}">{$portfolioData?.profile.hostname || 'macbook-pro'}</span>
      </div>

      <div class="text-xs text-slate-400 italic mb-2">
        {$portfolioData?.profile.title || 'Full-Stack Engineer & Systems Craftsman'}
      </div>

      <!-- Specs Key-Value Table -->
      <div class="space-y-0.5 text-xs sm:text-[13px]">
        {#if $portfolioData?.profile.fastfetch_specs}
          {#each Object.entries($portfolioData.profile.fastfetch_specs) as [key, val]}
            <div class="grid grid-cols-12 gap-1 py-0.5">
              <span class="col-span-4 sm:col-span-3 text-cyan-400 font-medium">{key}:</span>
              <span class="col-span-8 sm:col-span-9 text-slate-200 break-words">{val}</span>
            </div>
          {/each}
        {:else}
          <div class="grid grid-cols-12 gap-1">
            <span class="col-span-3 text-cyan-400 font-medium">OS:</span>
            <span class="col-span-9 text-slate-200">macOS Sequoia 15.2 (arm64)</span>
          </div>
          <div class="grid grid-cols-12 gap-1">
            <span class="col-span-3 text-cyan-400 font-medium">Host:</span>
            <span class="col-span-9 text-slate-200">MacBook Pro 16" (Apple M3 Max)</span>
          </div>
          <div class="grid grid-cols-12 gap-1">
            <span class="col-span-3 text-cyan-400 font-medium">Uptime:</span>
            <span class="col-span-9 text-slate-200">18 days, 4 hours</span>
          </div>
          <div class="grid grid-cols-12 gap-1">
            <span class="col-span-3 text-cyan-400 font-medium">Shell:</span>
            <span class="col-span-9 text-slate-200">zsh 5.9</span>
          </div>
        {/if}
      </div>

      <!-- Color Palette Blocks (Fastfetch signature aesthetic) -->
      <div class="pt-3 space-y-1">
        <div class="flex space-x-1">
          {#each PALETTE_BLOCKS as hex}
            <span class="inline-block w-4 h-3 rounded-[2px]" style="background-color: {hex}"></span>
          {/each}
        </div>
        <div class="flex space-x-1">
          {#each BRIGHT_BLOCKS as hex}
            <span class="inline-block w-4 h-3 rounded-[2px]" style="background-color: {hex}"></span>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Quick Helpful Hint -->
  <div class="mt-4 pt-2 border-t border-white/10 text-xs text-slate-400 flex flex-wrap items-center gap-2">
    <span>💡 Type <button type="button" class="text-amber-300 font-bold hover:underline" onclick={() => executeCommand('help')}>help</button> or explore:</span>
    <button class="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-300 transition text-[11px]" onclick={() => executeCommand('projects')}>projects</button>
    <button class="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-300 transition text-[11px]" onclick={() => executeCommand('skills')}>skills</button>
    <button class="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-300 transition text-[11px]" onclick={() => executeCommand('experience')}>experience</button>
    <button class="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-300 transition text-[11px]" onclick={() => executeCommand('ls -la')}>ls -la</button>
    <button class="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-300 transition text-[11px]" onclick={() => executeCommand('theme')}>theme</button>
    <button class="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-300 transition text-[11px]" onclick={() => executeCommand('contact')}>contact</button>
  </div>
</div>
