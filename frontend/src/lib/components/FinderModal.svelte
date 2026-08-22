<script lang="ts">
  import { isFinderOpen, portfolioData } from '../../stores/portfolioStore';
  import { activeDir, activeEditingFile } from '../../stores/terminalStore';
  import { executeCommand } from '../../utils/commands';
  import type { VirtualFile } from '../../types';

  let currentNavDir = $state('~');
  let selectedFile = $state<VirtualFile | null>(null);

  let displayedFiles = $derived(
    ($portfolioData?.virtual_files || []).filter(f => f.parent_dir === currentNavDir)
  );

  function handleOpenItem(f: VirtualFile) {
    if (f.is_directory) {
      currentNavDir = f.path;
      activeDir.set(f.path);
    } else {
      selectedFile = f;
      // Also trigger terminal cat for immersive synchronization
      executeCommand(`cat ${f.filename}`);
    }
  }

  function goUp() {
    if (currentNavDir === '~') return;
    const parts = currentNavDir.split('/');
    parts.pop();
    currentNavDir = parts.join('/') || '~';
    activeDir.set(currentNavDir);
  }
</script>

{#if $isFinderOpen}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="w-full max-w-3xl h-[65vh] bg-neutral-900/95 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
      <!-- Finder Window Header -->
      <div class="h-11 px-4 bg-neutral-950 border-b border-white/10 flex items-center justify-between select-none">
        <div class="flex items-center space-x-2">
          <button
            class="w-3 h-3 rounded-full bg-red-500 hover:brightness-110"
            onclick={() => isFinderOpen.set(false)}
            aria-label="Close Finder"
          ></button>
          <button
            class="w-3 h-3 rounded-full bg-yellow-500 hover:brightness-110"
            onclick={() => isFinderOpen.set(false)}
            aria-label="Minimize Finder"
          ></button>
          <button
            class="w-3 h-3 rounded-full bg-green-500 hover:brightness-110"
            aria-label="Maximize Finder"
          ></button>
          <span class="text-xs font-semibold text-slate-300 ml-2 font-mono">Finder — {currentNavDir}</span>
        </div>

        <div class="flex items-center space-x-2 text-xs">
          {#if currentNavDir !== '~'}
            <button class="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200" onclick={goUp}>
              ▲ Up
            </button>
          {/if}
        </div>
      </div>

      <!-- Main Finder Area: Sidebar + Grid -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Sidebar -->
        <div class="w-48 bg-black/40 border-r border-white/10 p-3 space-y-3 text-xs select-none hidden sm:block">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Favorites</div>
          <div class="space-y-1">
            <button
              class="w-full text-left px-2 py-1.5 rounded flex items-center space-x-2 {currentNavDir === '~' ? 'bg-cyan-600/30 text-cyan-300 font-bold' : 'hover:bg-white/5 text-slate-300'}"
              onclick={() => currentNavDir = '~'}
            >
              <span>🏠</span>
              <span>Home (~)</span>
            </button>
            <button
              class="w-full text-left px-2 py-1.5 rounded flex items-center space-x-2 {currentNavDir === '~/projects' ? 'bg-cyan-600/30 text-cyan-300 font-bold' : 'hover:bg-white/5 text-slate-300'}"
              onclick={() => currentNavDir = '~/projects'}
            >
              <span>📁</span>
              <span>projects</span>
            </button>
            <button
              class="w-full text-left px-2 py-1.5 rounded flex items-center space-x-2 {currentNavDir === '~/secrets' ? 'bg-cyan-600/30 text-cyan-300 font-bold' : 'hover:bg-white/5 text-slate-300'}"
              onclick={() => currentNavDir = '~/secrets'}
            >
              <span>🔒</span>
              <span>secrets</span>
            </button>
          </div>
        </div>

        <!-- Files Grid View -->
        <div class="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col justify-between">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {#each displayedFiles as f}
              <button
                type="button"
                class="p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition select-none group {selectedFile?.id === f.id ? 'bg-cyan-600/30 border-cyan-400' : 'bg-white/5 hover:bg-white/10 border-white/10'}"
                onclick={() => handleOpenItem(f)}
              >
                <div class="text-3xl mb-1 group-hover:scale-110 transition duration-200">
                  {f.is_directory ? '📁' : f.file_type === 'markdown' ? '📝' : f.file_type === 'json' ? '⚙️' : f.file_type === 'executable' ? '⚡' : '📄'}
                </div>
                <div class="text-xs font-mono font-medium text-slate-200 truncate w-full">{f.filename}</div>
                <div class="text-[10px] text-slate-400 font-mono mt-0.5">{f.is_directory ? 'Folder' : `${f.size_bytes}B`}</div>
              </button>
            {/each}
          </div>

          <!-- Bottom Inspector / Status -->
          {#if selectedFile}
            <div class="mt-4 p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-xs font-mono">
              <div>
                <span class="text-cyan-300 font-bold">{selectedFile.filename}</span>
                <span class="text-slate-400 ml-2">({selectedFile.permissions}, {selectedFile.size_bytes} bytes)</span>
              </div>
              <button
                class="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                onclick={() => { executeCommand(`cat ${selectedFile?.filename}`); isFinderOpen.set(false); }}
              >
                Read in Terminal
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
