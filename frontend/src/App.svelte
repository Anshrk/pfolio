<script lang="ts">
  import { onMount } from 'svelte';
  import MacMenuBar from './lib/components/MacMenuBar.svelte';
  import MacWindow from './lib/components/MacWindow.svelte';
  import Terminal from './lib/components/Terminal.svelte';
  import MacDock from './lib/components/MacDock.svelte';
  import NanoEditor from './lib/components/NanoEditor.svelte';
  import AdminModal from './lib/components/AdminModal.svelte';
  import AuthModal from './lib/components/AuthModal.svelte';
  import ProjectModal from './lib/components/ProjectModal.svelte';
  import FinderModal from './lib/components/FinderModal.svelte';
  import MatrixRain from './lib/components/MatrixRain.svelte';
  import ContactModal from './lib/components/ContactModal.svelte';
  import QuickToolbar from './lib/components/QuickToolbar.svelte';

  import { loadPortfolio, portfolioData } from './stores/portfolioStore';
  import { checkAuth } from './stores/authStore';
  import { activeEditingFile } from './stores/terminalStore';
  import { currentTheme } from './stores/themeStore';

  let isContactModalOpen = $state(false);

  onMount(async () => {
    await Promise.all([
      loadPortfolio(),
      checkAuth()
    ]);
  });
</script>

<svelte:head>
  <title>{$portfolioData?.profile.name || 'Ansh Kashyap'} — Terminal Portfolio (zsh)</title>
  <meta name="description" content="MacBook terminal coded portfolio featuring Fastfetch system diagnostics, interactive UNIX shell, and dynamic PostgreSQL backend." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<main
  class="relative w-screen h-screen overflow-hidden macos-desktop flex flex-col justify-between"
  style="background-color: {$currentTheme.bg};"
>
  <!-- Ambient dynamic glow overlay -->
  <div class="absolute inset-0 macos-mesh-overlay pointer-events-none"></div>

  <!-- macOS Top Menu Bar -->
  <MacMenuBar />

  <!-- Quick Command Chips Toolbar -->
  <QuickToolbar onOpenContact={() => isContactModalOpen = true} />

  <!-- Main Terminal Workspace (Centered) -->
  <div class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 flex items-center justify-center relative">
    <MacWindow>
      <Terminal />
      {#if $activeEditingFile}
        <NanoEditor />
      {/if}
    </MacWindow>
  </div>

  <!-- Floating Bottom macOS Dock -->
  <MacDock />

  <!-- Modals & Overlays -->
  <AdminModal />
  <AuthModal />
  <ProjectModal />
  <FinderModal />
  <ContactModal bind:isOpen={isContactModalOpen} />
  <MatrixRain />
</main>
