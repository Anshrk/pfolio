<script lang="ts">
  import { onMount } from 'svelte';
  import { isAudioEnabled, toggleAudio } from '../../stores/soundStore';
  import { currentTheme, setTheme, THEMES, isCrtEnabled, toggleCrt } from '../../stores/themeStore';
  import { isAuthenticated, isAuthModalOpen, isAdminStudioOpen, logout } from '../../stores/authStore';
  import { isMatrixActive } from '../../stores/terminalStore';
  import { isFinderOpen } from '../../stores/portfolioStore';
  import { executeCommand } from '../../utils/commands';
  import type { ThemeName } from '../../types';

  let currentTime = '';
  let activeMenu: string | null = null;

  function updateClock() {
    const now = new Date();
    currentTime = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  onMount(() => {
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  });

  function toggleMenu(name: string) {
    activeMenu = activeMenu === name ? null : name;
  }

  function closeMenus() {
    activeMenu = null;
  }
</script>

<svelte:window onclick={closeMenus} />

<header class="w-full h-8 px-4 flex items-center justify-between text-xs font-sans select-none bg-black/40 backdrop-blur-xl border-b border-white/10 text-white/90 z-50 fixed top-0 left-0">
  <!-- Left Side: Apple Logo & App Menus -->
  <div class="flex items-center space-x-4">
    <!-- Apple Logo -->
    <div class="relative">
      <button
        class="hover:opacity-80 p-1 flex items-center transition"
        onclick={(e) => { e.stopPropagation(); toggleMenu('apple'); }}
        aria-label="Apple Menu"
      >
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.77-12-14.18-6.19-9.13-11.1-19.46-14.73-30.98-3.63-11.52-5.45-22.3-5.45-32.34 0-14.46 3.73-26.68 11.2-36.65 7.46-9.98 16.9-15.06 28.32-15.26 4.9.13 10.37 1.34 16.42 3.65 6.04 2.3 10.15 3.52 12.31 3.65 1.63-.25 5.79-1.57 12.48-3.97 6.7-2.39 12.18-3.48 16.45-3.26 12.3.65 22.09 5.3 29.37 13.97-10.87 6.64-16.19 15.82-15.97 27.56.22 9.14 3.75 16.85 10.6 23.15 6.84 6.3 14.95 9.77 24.32 10.42-2.17 6.73-4.89 13.56-8.14 20.48zM119.22 31.84c0-7.39 2.66-14.18 7.98-20.37 5.32-6.19 11.85-9.88 19.6-11.07.22 1.08.33 2.17.33 3.26 0 7.39-2.77 14.28-8.31 20.67-5.54 6.39-12.28 10.09-20.22 11.1-.33-1.19-.49-2.38-.49-3.59z"/>
        </svg>
      </button>

      {#if activeMenu === 'apple'}
        <div class="absolute top-7 left-0 w-52 py-1 bg-neutral-900/95 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl z-50 text-xs text-slate-200">
          <button class="w-full text-left px-3 py-1.5 hover:bg-cyan-600 hover:text-white transition flex items-center justify-between" onclick={() => executeCommand('fastfetch')}>
            <span>About This Portfolio</span>
            <span class="text-[10px] opacity-60">fastfetch</span>
          </button>
          <div class="h-px bg-white/10 my-1"></div>
          <button class="w-full text-left px-3 py-1.5 hover:bg-cyan-600 hover:text-white transition" onclick={() => isFinderOpen.set(true)}>
            Browse Filesystem (Finder)
          </button>
          <button class="w-full text-left px-3 py-1.5 hover:bg-cyan-600 hover:text-white transition" onclick={() => isMatrixActive.set(true)}>
            Matrix Digital Rain (cmatrix)
          </button>
          <div class="h-px bg-white/10 my-1"></div>
          {#if $isAuthenticated}
            <button class="w-full text-left px-3 py-1.5 hover:bg-cyan-600 hover:text-white transition text-emerald-400 font-semibold" onclick={() => isAdminStudioOpen.set(true)}>
              ⚙️ Studio Admin Center
            </button>
            <button class="w-full text-left px-3 py-1.5 hover:bg-red-600 hover:text-white transition text-red-400" onclick={logout}>
              Log Out {$isAuthenticated ? 'Admin' : ''}
            </button>
          {:else}
            <button class="w-full text-left px-3 py-1.5 hover:bg-cyan-600 hover:text-white transition text-amber-300" onclick={() => isAuthModalOpen.set(true)}>
              🔒 Admin Login
            </button>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Active App Title -->
    <span class="font-bold text-white tracking-wide">Terminal</span>

    <!-- Menus -->
    <div class="hidden sm:flex items-center space-x-3">
      <button class="hover:text-white transition" onclick={() => executeCommand('help')}>Shell</button>
      <button class="hover:text-white transition" onclick={() => executeCommand('projects')}>Projects</button>
      <button class="hover:text-white transition" onclick={() => executeCommand('skills')}>Skills</button>
      <button class="hover:text-white transition" onclick={() => executeCommand('contact')}>Contact</button>
      
      <!-- Theme Quick Menu -->
      <div class="relative">
        <button class="hover:text-white transition flex items-center space-x-1" onclick={(e) => { e.stopPropagation(); toggleMenu('theme'); }}>
          <span>Themes</span>
        </button>
        {#if activeMenu === 'theme'}
          <div class="absolute top-7 left-0 w-44 py-1 bg-neutral-900/95 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl z-50 text-xs">
            {#each Object.entries(THEMES) as [key, t]}
              <button
                class="w-full text-left px-3 py-1.5 hover:bg-cyan-600 hover:text-white transition flex items-center justify-between {$currentTheme.id === key ? 'text-amber-300 font-bold' : 'text-slate-300'}"
                onclick={() => setTheme(key as ThemeName)}
              >
                <span>{t.name}</span>
                <span class="w-2.5 h-2.5 rounded-full border border-white/20" style="background-color: {t.accent}"></span>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Right Side: System Controls, Sound, Auth, Clock -->
  <div class="flex items-center space-x-3 text-white/80">
    <!-- Sound Toggle -->
    <button
      class="hover:text-white transition p-1"
      onclick={() => toggleAudio()}
      title={$isAudioEnabled ? "Mute Mechanical Audio" : "Enable Mechanical Audio"}
    >
      {#if $isAudioEnabled}
        <span class="text-emerald-400">🔊</span>
      {:else}
        <span class="text-slate-500">🔇</span>
      {/if}
    </button>

    <!-- CRT Toggle -->
    <button
      class="hover:text-white transition text-xs px-1.5 py-0.5 rounded border border-white/10 {$isCrtEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}"
      onclick={() => toggleCrt()}
      title="Toggle CRT Scanline Aesthetics"
    >
      CRT
    </button>

    <!-- Admin Status Lock -->
    <button
      class="hover:text-white transition flex items-center space-x-1 px-1.5 py-0.5 rounded border border-white/10"
      onclick={() => $isAuthenticated ? isAdminStudioOpen.set(true) : isAuthModalOpen.set(true)}
      title={$isAuthenticated ? "Admin Authenticated (Click to open Studio)" : "Click to Login"}
    >
      {#if $isAuthenticated}
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-emerald-300 text-[11px] font-semibold">Admin</span>
      {:else}
        <span class="text-[11px] opacity-70">🔒</span>
      {/if}
    </button>

    <!-- Battery -->
    <div class="hidden sm:flex items-center space-x-1" title="Battery 100% (AC Connected)">
      <span class="text-[10px]">100%</span>
      <svg class="w-4 h-2.5 border border-white/50 rounded-[2px] p-[0.5px]" viewBox="0 0 16 8">
        <rect width="13" height="6" fill="#4ade80" />
      </svg>
    </div>

    <!-- Live Clock -->
    <span class="font-medium text-white tracking-tight">{currentTime}</span>
  </div>
</header>
