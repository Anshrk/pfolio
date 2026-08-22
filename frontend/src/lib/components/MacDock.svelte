<script lang="ts">
  import { isWindowMinimized, isMatrixActive } from '../../stores/terminalStore';
  import { isFinderOpen, openProjectModal, portfolioData } from '../../stores/portfolioStore';
  import { isAuthenticated, isAuthModalOpen, isAdminStudioOpen } from '../../stores/authStore';
  import { toggleAudio, isAudioEnabled } from '../../stores/soundStore';
  import { setTheme, THEMES, currentTheme } from '../../stores/themeStore';
  import type { ThemeName } from '../../types';

  let isThemePickerOpen = false;

  function handleTerminalClick() {
    isWindowMinimized.set(false);
  }

  function handleFinderClick() {
    isFinderOpen.update(v => !v);
  }

  function handleProjectsClick() {
    const first = $portfolioData?.projects[0];
    if (first) {
      openProjectModal(first);
    }
  }

  function handleAdminClick() {
    if ($isAuthenticated) {
      isAdminStudioOpen.set(true);
    } else {
      isAuthModalOpen.set(true);
    }
  }

  function cycleTheme() {
    const keys = Object.keys(THEMES) as ThemeName[];
    const idx = keys.indexOf($currentTheme.id);
    const next = keys[(idx + 1) % keys.length];
    setTheme(next);
  }
</script>

<div class="fixed bottom-3 left-1/2 -translate-x-1/2 z-40">
  <div class="px-3 py-2 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center space-x-2 sm:space-x-3">
    <!-- 1. Terminal Icon -->
    <div class="relative group">
      <button
        class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-neutral-800 to-neutral-950 border border-white/20 flex flex-col items-center justify-center text-emerald-400 font-mono font-bold text-base shadow-lg hover:-translate-y-2 hover:scale-110 transition-all duration-200"
        onclick={handleTerminalClick}
        aria-label="Terminal"
      >
        <span class="text-xs text-slate-400 -mb-1">_&gt;</span>
        <span class="text-emerald-400">zsh</span>
      </button>
      <span class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-neutral-900/90 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow border border-white/10 pointer-events-none">
        Terminal
      </span>
      {#if !$isWindowMinimized}
        <span class="w-1 h-1 rounded-full bg-white/70 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></span>
      {/if}
    </div>

    <!-- 2. Finder Icon -->
    <div class="relative group">
      <button
        class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-blue-400 to-blue-600 border border-blue-300/40 flex items-center justify-center text-white shadow-lg hover:-translate-y-2 hover:scale-110 transition-all duration-200"
        onclick={handleFinderClick}
        aria-label="Finder"
      >
        <span class="text-2xl">😊</span>
      </button>
      <span class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-neutral-900/90 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow border border-white/10 pointer-events-none">
        Finder (VFS)
      </span>
      {#if $isFinderOpen}
        <span class="w-1 h-1 rounded-full bg-white/70 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></span>
      {/if}
    </div>

    <!-- 3. Safari / Projects Preview -->
    <div class="relative group">
      <button
        class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-sky-400 to-indigo-600 border border-sky-300/40 flex items-center justify-center text-white shadow-lg hover:-translate-y-2 hover:scale-110 transition-all duration-200"
        onclick={handleProjectsClick}
        aria-label="Safari Projects"
      >
        <span class="text-xl">🧭</span>
      </button>
      <span class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-neutral-900/90 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow border border-white/10 pointer-events-none">
        Projects Preview
      </span>
    </div>

    <!-- 4. Matrix Digital Rain (cmatrix) -->
    <div class="relative group">
      <button
        class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-emerald-900 to-black border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm shadow-lg hover:-translate-y-2 hover:scale-110 transition-all duration-200"
        onclick={() => isMatrixActive.update(v => !v)}
        aria-label="Matrix Rain"
      >
        <span>01</span>
      </button>
      <span class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-neutral-900/90 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow border border-white/10 pointer-events-none">
        Matrix Rain (cmatrix)
      </span>
      {#if $isMatrixActive}
        <span class="w-1 h-1 rounded-full bg-emerald-400 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></span>
      {/if}
    </div>

    <!-- Divider -->
    <div class="w-px h-8 bg-white/20 my-auto"></div>

    <!-- 5. Theme Palette Switcher -->
    <div class="relative group">
      <button
        class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-purple-500 to-indigo-800 border border-purple-300/40 flex items-center justify-center text-white text-lg shadow-lg hover:-translate-y-2 hover:scale-110 transition-all duration-200"
        onclick={cycleTheme}
        aria-label="Themes"
      >
        <span>🎨</span>
      </button>
      <span class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-neutral-900/90 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow border border-white/10 pointer-events-none">
        Theme: {$currentTheme.name}
      </span>
    </div>

    <!-- 6. Sound Synthesizer -->
    <div class="relative group">
      <button
        class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 border border-amber-300/40 flex items-center justify-center text-white text-lg shadow-lg hover:-translate-y-2 hover:scale-110 transition-all duration-200"
        onclick={() => toggleAudio()}
        aria-label="Sound"
      >
        <span>{$isAudioEnabled ? '🔊' : '🔇'}</span>
      </button>
      <span class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-neutral-900/90 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow border border-white/10 pointer-events-none">
        {$isAudioEnabled ? "Sound: On" : "Sound: Muted"}
      </span>
    </div>

    <!-- 7. Admin Dynamic Studio Lock -->
    <div class="relative group">
      <button
        class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-neutral-800 to-black border {$isAuthenticated ? 'border-emerald-400/80' : 'border-white/20'} flex items-center justify-center text-white text-lg shadow-lg hover:-translate-y-2 hover:scale-110 transition-all duration-200"
        onclick={handleAdminClick}
        aria-label="Admin Studio"
      >
        <span>{$isAuthenticated ? '👑' : '🔒'}</span>
      </button>
      <span class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-neutral-900/90 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow border border-white/10 pointer-events-none">
        {$isAuthenticated ? "Admin Studio (Active)" : "Owner Login"}
      </span>
      {#if $isAdminStudioOpen}
        <span class="w-1 h-1 rounded-full bg-emerald-400 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></span>
      {/if}
    </div>
  </div>
</div>
