<script lang="ts">
  import { activeEditingFile, addLine } from '../../stores/terminalStore';
  import { updateLocalFile } from '../../stores/portfolioStore';
  import { upsertFileAdmin } from '../../utils/api';
  import { soundEngine } from '../../utils/audio';

  let file = $derived($activeEditingFile);
  let content = $state('');
  let statusMsg = $state('');
  let isSaving = $state(false);

  $effect(() => {
    if (file) {
      content = file.content || '';
    }
  });

  function handleClose() {
    activeEditingFile.set(null);
    addLine({
      type: 'output',
      content: `Exited nano editor for ${file?.path || 'file'}.`
    });
  }

  async function handleSave() {
    if (!file) return;
    isSaving = true;
    statusMsg = 'Writing to database...';
    try {
      const updated = await upsertFileAdmin({
        path: file.path,
        filename: file.filename,
        parent_dir: file.parent_dir,
        content: content,
        file_type: file.file_type,
        permissions: file.permissions
      });
      updateLocalFile(updated);
      soundEngine.playSuccessTone();
      statusMsg = `[ Wrote ${content.length} bytes to PostgreSQL database ]`;
      setTimeout(() => {
        statusMsg = '';
      }, 3000);
    } catch (err: any) {
      soundEngine.playErrorTone();
      statusMsg = `[ Error saving: ${err.message} ]`;
    } finally {
      isSaving = false;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
      e.preventDefault();
      handleSave();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
      e.preventDefault();
      handleClose();
      return;
    }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<div
  class="absolute inset-0 bg-neutral-950 text-white font-mono flex flex-col z-30 select-text text-xs sm:text-sm"
  role="region"
  aria-label="Nano Text Editor"
>
  <!-- Nano Header Bar -->
  <div class="h-6 px-2 bg-neutral-200 text-neutral-900 font-bold flex items-center justify-between text-xs select-none">
    <span>GNU nano 7.2</span>
    <span>File: {file?.path || 'Untitled'}</span>
    <span class="text-[11px]">{isSaving ? 'Writing...' : 'Modified'}</span>
  </div>

  <!-- Main Editor Textarea -->
  <div class="flex-1 p-3 overflow-y-auto">
    <textarea
      bind:value={content}
      class="w-full h-full bg-transparent text-slate-100 font-mono text-xs sm:text-sm resize-none border-none outline-none focus:ring-0 leading-relaxed custom-scrollbar"
      placeholder="Type here..."
      spellcheck="false"
    ></textarea>
  </div>

  <!-- Status / Feedback Message Line -->
  {#if statusMsg}
    <div class="h-5 px-3 bg-cyan-950 text-cyan-300 text-xs flex items-center justify-center font-bold">
      {statusMsg}
    </div>
  {/if}

  <!-- Nano Bottom Keyboard Shortcuts Legend -->
  <div class="h-12 px-3 py-1 bg-neutral-900 border-t border-white/10 text-xs grid grid-cols-2 sm:grid-cols-4 gap-1 select-none">
    <button class="text-left flex items-center space-x-1 hover:text-cyan-300" onclick={handleSave}>
      <span class="px-1 py-0.2 rounded bg-white/20 text-white font-bold">^O</span>
      <span class="text-slate-300">WriteOut (Save)</span>
    </button>
    <button class="text-left flex items-center space-x-1 hover:text-cyan-300" onclick={handleClose}>
      <span class="px-1 py-0.2 rounded bg-white/20 text-white font-bold">^X</span>
      <span class="text-slate-300">Exit</span>
    </button>
    <div class="flex items-center space-x-1 text-slate-400">
      <span class="px-1 py-0.2 rounded bg-white/10 font-bold">^K</span>
      <span>Cut Line</span>
    </div>
    <div class="flex items-center space-x-1 text-slate-400">
      <span class="px-1 py-0.2 rounded bg-white/10 font-bold">^G</span>
      <span>Get Help</span>
    </div>
  </div>
</div>
