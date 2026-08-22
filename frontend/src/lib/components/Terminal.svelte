<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { lines, activeDir, commandHistory, historyIndex, addHistory, isWindowMaximized, isWindowMinimized, tabs, switchTab, closeTab, createNewTab } from '../../stores/terminalStore';
  import { portfolioData, openProjectModal } from '../../stores/portfolioStore';
  import { currentTheme, isCrtEnabled, isScanlinesEnabled, isGlowEnabled } from '../../stores/themeStore';
  import { isAuthenticated } from '../../stores/authStore';
  import { executeCommand } from '../../utils/commands';
  import { soundEngine } from '../../utils/audio';
  import Fastfetch from './Fastfetch.svelte';
  import type { Project } from '../../types';

  let inputVal = '';
  let inputEl: HTMLInputElement;
  let terminalContainer: HTMLDivElement;
  let tabSuggestions: string[] = [];

  const COMMAND_LIST = [
    'fastfetch', 'neofetch', 'projects', 'skills', 'experience', 'contact',
    'ls', 'cd', 'cat', 'pwd', 'open', 'theme', 'audio', 'crt', 'clear',
    'cmatrix', 'whoami', 'date', 'uptime', 'weather', 'quote', 'help',
    'admin', 'sudo', 'login', 'logout', 'nano', 'finder', 'gui'
  ];

  onMount(() => {
    // Initial startup banner
    lines.set([{ id: 'init-1', type: 'fastfetch' }]);
    soundEngine.playBootChime();
    focusInput();
  });

  function focusInput() {
    if (inputEl) inputEl.focus();
  }

  async function handleKeyDown(e: KeyboardEvent) {
    soundEngine.playKeyClick();

    // Tab Auto-Completion
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabComplete();
      return;
    }

    // Up Arrow (Previous History)
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const history = $commandHistory;
      if (history.length === 0) return;

      let idx = $historyIndex;
      if (idx === -1) {
        idx = history.length - 1;
      } else if (idx > 0) {
        idx--;
      }
      historyIndex.set(idx);
      inputVal = history[idx] || '';
      return;
    }

    // Down Arrow (Next History)
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const history = $commandHistory;
      let idx = $historyIndex;
      if (idx !== -1) {
        if (idx < history.length - 1) {
          idx++;
          historyIndex.set(idx);
          inputVal = history[idx] || '';
        } else {
          historyIndex.set(-1);
          inputVal = '';
        }
      }
      return;
    }

    // Enter Key
    if (e.key === 'Enter') {
      e.preventDefault();
      soundEngine.playEnterClack();
      const cmd = inputVal;
      inputVal = '';
      tabSuggestions = [];
      addHistory(cmd);
      await executeCommand(cmd);
      await tick();
      scrollToBottom();
      focusInput();
    }
  }

  function handleTabComplete() {
    const raw = inputVal.trim();
    if (!raw) return;

    const parts = raw.split(' ');
    const lastWord = parts[parts.length - 1].toLowerCase();

    // 1. If single word: match commands
    if (parts.length === 1) {
      const matches = COMMAND_LIST.filter(c => c.startsWith(lastWord));
      if (matches.length === 1) {
        inputVal = matches[0] + ' ';
        tabSuggestions = [];
      } else if (matches.length > 1) {
        tabSuggestions = matches;
      }
      return;
    }

    // 2. If command is cd, cat, open, nano: match files/directories
    const cmd = parts[0].toLowerCase();
    const data = $portfolioData;
    const current = $activeDir;
    const files = data?.virtual_files.filter(f => f.parent_dir === current) || [];
    const candidates = files.map(f => f.filename);

    const matches = candidates.filter(name => name.toLowerCase().startsWith(lastWord));
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      inputVal = parts.join(' ') + (files.find(f => f.filename === matches[0])?.is_directory ? '/' : ' ');
      tabSuggestions = [];
    } else if (matches.length > 1) {
      tabSuggestions = matches;
    }
  }

  function scrollToBottom() {
    if (terminalContainer) {
      terminalContainer.scrollTop = terminalContainer.scrollHeight;
    }
  }

  function handleProjectClick(p: Project) {
    openProjectModal(p);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="w-full h-full flex flex-col font-mono select-text transition-all duration-300 relative {$isCrtEnabled ? 'crt-effect' : ''} {$isScanlinesEnabled ? 'scanlines' : ''}"
  style="background-color: {$currentTheme.windowBg}; color: {$currentTheme.text};"
  onclick={focusInput}
>
  <!-- Window Tab Bar -->
  <div
    class="h-9 px-3 flex items-center justify-between border-b select-none overflow-x-auto text-xs"
    style="background-color: {$currentTheme.windowHeaderBg}; border-color: {$currentTheme.border};"
  >
    <div class="flex items-center space-x-1.5">
      {#each $tabs as tab}
        <div
          class="flex items-center space-x-2 px-3 py-1 rounded-t-md text-xs cursor-pointer transition {tab.active ? 'bg-white/10 text-white font-medium border-b-2 border-cyan-400' : 'text-slate-400 hover:bg-white/5'}"
          onclick={(e) => { e.stopPropagation(); switchTab(tab.id); }}
        >
          <span>🖥️ {tab.title}</span>
          {#if $tabs.length > 1}
            <button
              class="text-slate-500 hover:text-red-400 p-0.5"
              onclick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
            >
              ×
            </button>
          {/if}
        </div>
      {/each}
      <button
        class="p-1 px-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition text-xs"
        onclick={(e) => { e.stopPropagation(); createNewTab(); }}
        title="Open New Terminal Tab"
      >
        +
      </button>
    </div>

    <!-- Active User & Directory Badge -->
    <div class="hidden md:flex items-center space-x-2 text-[11px] opacity-70">
      <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10">zsh</span>
      <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10">arm64</span>
    </div>
  </div>

  <!-- Terminal Output Scrollable Buffer -->
  <div
    bind:this={terminalContainer}
    class="flex-1 p-4 overflow-y-auto space-y-3 leading-relaxed text-xs sm:text-sm custom-scrollbar"
  >
    {#each $lines as line (line.id)}
      <div class="terminal-line animate-fade-in">
        <!-- Input Echo Line -->
        {#if line.type === 'input'}
          <div class="flex flex-wrap items-baseline space-x-2">
            <span class="font-bold" style="color: {$currentTheme.promptUser}">
              {$isAuthenticated ? 'admin' : ($portfolioData?.profile.handle || 'ansh')}
            </span>
            <span class="text-slate-500">@</span>
            <span class="font-medium" style="color: {$currentTheme.promptHost}">
              {$portfolioData?.profile.hostname || 'macbook-pro'}
            </span>
            <span class="font-medium" style="color: {$currentTheme.promptPath}">
              {line.dir || '~'}
            </span>
            <span class="font-bold" style="color: {$currentTheme.promptSymbol}">%</span>
            <span class="text-white font-medium break-all">{line.command}</span>
          </div>

        <!-- Fastfetch Banner -->
        {:else if line.type === 'fastfetch'}
          <Fastfetch />

        <!-- Projects Showcase View -->
        {:else if line.type === 'projects'}
          <div class="space-y-4 my-3 font-mono">
            <div class="flex items-center justify-between border-b border-white/10 pb-1">
              <span class="text-amber-300 font-bold text-sm">🚀 FEATURED ENGINEERING PROJECTS</span>
              <span class="text-xs text-slate-400">Click card for GUI modal</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              {#each ($portfolioData?.projects || []) as proj}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div
                  class="group p-3.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 transition cursor-pointer flex flex-col justify-between"
                  onclick={() => handleProjectClick(proj)}
                >
                  <div>
                    <div class="flex items-center justify-between">
                      <div class="font-bold text-sm text-cyan-300 group-hover:text-cyan-200 flex items-center space-x-1.5">
                        <span>{proj.title}</span>
                        {#if proj.featured}
                          <span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">★ Featured</span>
                        {/if}
                      </div>
                      {#if proj.stars}
                        <span class="text-xs text-slate-400 flex items-center space-x-1">
                          <span>★</span>
                          <span>{proj.stars}</span>
                        </span>
                      {/if}
                    </div>

                    <p class="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div class="mt-3 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                    <div class="flex flex-wrap gap-1">
                      {#each proj.tech_stack.slice(0, 4) as tech}
                        <span class="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-slate-300 border border-white/5">{tech}</span>
                      {/each}
                    </div>
                    
                    <div class="flex items-center space-x-2 text-xs">
                      {#if proj.github_url}
                        <a
                          href={proj.github_url}
                          target="_blank"
                          class="text-slate-400 hover:text-white transition"
                          onclick={(e) => e.stopPropagation()}
                        >
                          Code ↗
                        </a>
                      {/if}
                      {#if proj.demo_url}
                        <a
                          href={proj.demo_url}
                          target="_blank"
                          class="text-cyan-400 hover:underline font-semibold"
                          onclick={(e) => e.stopPropagation()}
                        >
                          Live ↗
                        </a>
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>

        <!-- Skills Breakdown View -->
        {:else if line.type === 'skills'}
          <div class="space-y-4 my-3 font-mono">
            <div class="text-amber-300 font-bold text-sm border-b border-white/10 pb-1">⚡ TECHNICAL SKILLS & PROFICIENCY</div>
            
            <!-- Group skills by category -->
            {#each ['Languages', 'Frontend', 'Backend', 'DevOps & Cloud'] as category}
              {@const categorySkills = ($portfolioData?.skills || []).filter(s => s.category === category)}
              {#if categorySkills.length > 0}
                <div class="space-y-2">
                  <div class="text-xs font-bold text-cyan-400">{category}</div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {#each categorySkills as skill}
                      <div class="p-2 rounded bg-white/5 border border-white/10">
                        <div class="flex justify-between text-xs mb-1">
                          <span class="text-slate-200 font-medium">{skill.name}</span>
                          <span class="text-slate-400">{skill.proficiency}% ({skill.level})</span>
                        </div>
                        <div class="w-full h-1.5 rounded-full bg-black/50 overflow-hidden">
                          <div
                            class="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                            style="width: {skill.proficiency}%;"
                          ></div>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            {/each}
          </div>

        <!-- Custom HTML (Help, Ls, Cat, Contact, etc.) -->
        {:else if line.type === 'custom-html'}
          <!-- svelte-ignore svelte_dom_warning -->
          {@html line.htmlContent}

        <!-- Success Output -->
        {:else if line.type === 'success'}
          <div class="text-emerald-400 font-medium">{line.content}</div>

        <!-- Error Output -->
        {:else if line.type === 'error'}
          <div class="text-red-400 font-medium">{line.content}</div>

        <!-- Standard Output -->
        {:else}
          <div class="text-slate-300 whitespace-pre-wrap">{line.content}</div>
        {/if}
      </div>
    {/each}

    <!-- Active Input Line -->
    <div class="flex flex-wrap items-baseline space-x-2 pt-1 pb-4">
      <span class="font-bold" style="color: {$currentTheme.promptUser}">
        {$isAuthenticated ? 'admin' : ($portfolioData?.profile.handle || 'ansh')}
      </span>
      <span class="text-slate-500">@</span>
      <span class="font-medium" style="color: {$currentTheme.promptHost}">
        {$portfolioData?.profile.hostname || 'macbook-pro'}
      </span>
      <span class="font-medium" style="color: {$currentTheme.promptPath}">
        {$activeDir}
      </span>
      <span class="font-bold" style="color: {$currentTheme.promptSymbol}">%</span>

      <!-- Input element with cursor -->
      <div class="flex-1 min-w-[200px] relative inline-flex items-center">
        <input
          bind:this={inputEl}
          bind:value={inputVal}
          onkeydown={handleKeyDown}
          type="text"
          class="w-full bg-transparent border-none outline-none text-white font-mono text-xs sm:text-sm p-0 m-0 focus:ring-0"
          style="caret-color: {$currentTheme.cursorColor};"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>
    </div>

    <!-- Tab Suggestions Dropdown/Chips -->
    {#if tabSuggestions.length > 0}
      <div class="flex flex-wrap gap-2 p-2 rounded bg-black/60 border border-white/10 text-xs">
        <span class="text-slate-400">Suggestions (Press Tab):</span>
        {#each tabSuggestions as sug}
          <button
            class="px-2 py-0.5 rounded bg-white/10 text-cyan-300 hover:bg-white/20"
            onclick={() => { inputVal = sug + ' '; tabSuggestions = []; focusInput(); }}
          >
            {sug}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* CRT Scanlines and Phosphor Screen Glow */
  .crt-effect {
    text-shadow: 0 0 4px rgba(66, 255, 120, 0.45);
  }
  .scanlines::after {
    content: " ";
    display: block;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
    z-index: 20;
    background-size: 100% 3px, 6px 100%;
    pointer-events: none;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(2px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.12s ease-out;
  }
</style>
