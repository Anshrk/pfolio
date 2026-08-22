<script lang="ts">
  import { isWindowMaximized, isWindowMinimized, activeDir } from '../../stores/terminalStore';
  import { currentTheme } from '../../stores/themeStore';
  import { portfolioData } from '../../stores/portfolioStore';
  import { isAuthenticated } from '../../stores/authStore';

  let { children } = $props<{ children?: import('svelte').Snippet }>();

  function handleClose() {
    isWindowMinimized.set(true);
  }

  function handleMinimize() {
    isWindowMinimized.update(v => !v);
  }

  function handleMaximize() {
    isWindowMaximized.update(v => !v);
  }
</script>

{#if !$isWindowMinimized}
  <div
    class="relative flex flex-col rounded-xl overflow-hidden shadow-2xl border transition-all duration-300 backdrop-blur-2xl {$isWindowMaximized ? 'fixed inset-0 top-8 z-30 rounded-none border-none' : 'w-full max-w-5xl h-[78vh] mx-auto z-20'}"
    style="border-color: {$currentTheme.border}; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);"
  >
    <!-- macOS Window Header Bar -->
    <div
      class="h-10 px-4 flex items-center justify-between border-b select-none cursor-default"
      style="background-color: {$currentTheme.windowHeaderBg}; border-color: {$currentTheme.border};"
    >
      <!-- Traffic Light Window Controls -->
      <div class="flex items-center space-x-2">
        <button
          class="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 active:brightness-90 flex items-center justify-center group shadow-sm"
          onclick={handleClose}
          aria-label="Close Window"
          title="Minimize to Dock"
        >
          <span class="opacity-0 group-hover:opacity-100 text-[9px] text-neutral-900 font-bold leading-none">×</span>
        </button>

        <button
          class="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 active:brightness-90 flex items-center justify-center group shadow-sm"
          onclick={handleMinimize}
          aria-label="Minimize Window"
          title="Minimize Window"
        >
          <span class="opacity-0 group-hover:opacity-100 text-[9px] text-neutral-900 font-bold leading-none">−</span>
        </button>

        <button
          class="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 active:brightness-90 flex items-center justify-center group shadow-sm"
          onclick={handleMaximize}
          aria-label="Maximize Window"
          title={$isWindowMaximized ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          <span class="opacity-0 group-hover:opacity-100 text-[8px] text-neutral-900 font-bold leading-none">⤢</span>
        </button>
      </div>

      <!-- Window Title -->
      <div class="flex items-center space-x-1.5 text-xs font-mono text-white/80 select-none">
        <span class="font-bold text-cyan-300">{$isAuthenticated ? 'admin' : ($portfolioData?.profile.handle || 'ansh')}@{$portfolioData?.profile.hostname || 'macbook-pro'}</span>
        <span class="text-slate-500">:</span>
        <span class="text-emerald-400 font-medium">{$activeDir}</span>
        <span class="text-slate-400">(zsh)</span>
      </div>

      <!-- Right controls spacer / status -->
      <div class="w-14 flex justify-end">
        <span class="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" title="Terminal session connected"></span>
      </div>
    </div>

    <!-- Window Body -->
    <div class="flex-1 overflow-hidden relative">
      {#if children}
        {@render children()}
      {/if}
    </div>
  </div>
{/if}
