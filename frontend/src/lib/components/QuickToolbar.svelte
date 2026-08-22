<script lang="ts">
  import { executeCommand } from '../../utils/commands';
  import { isAudioEnabled, toggleAudio } from '../../stores/soundStore';

  let { onOpenContact = () => {} } = $props<{ onOpenContact?: () => void }>();
</script>

<div class="fixed top-12 left-1/2 -translate-x-1/2 z-30 max-w-2xl w-[94%] flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg text-xs font-mono select-none overflow-x-auto custom-scrollbar">
  <div class="flex items-center space-x-1.5 flex-nowrap shrink-0">
    <span class="text-amber-400 font-bold mr-1">CLI:</span>
    <button class="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-cyan-300 font-medium transition" onclick={() => executeCommand('fastfetch')}>
      fastfetch
    </button>
    <button class="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-cyan-300 font-medium transition" onclick={() => executeCommand('projects')}>
      projects
    </button>
    <button class="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-cyan-300 font-medium transition" onclick={() => executeCommand('skills')}>
      skills
    </button>
    <button class="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-cyan-300 font-medium transition" onclick={() => executeCommand('experience')}>
      experience
    </button>
    <button class="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-cyan-300 font-medium transition" onclick={() => executeCommand('ls -la')}>
      ls -la
    </button>
    <button class="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-cyan-300 font-medium transition" onclick={() => executeCommand('help')}>
      help
    </button>
  </div>

  <div class="flex items-center space-x-1.5 shrink-0 ml-2">
    <button
      class="px-2.5 py-1 rounded-md bg-cyan-600/40 hover:bg-cyan-600/70 border border-cyan-400/30 text-cyan-200 font-bold transition flex items-center space-x-1"
      onclick={onOpenContact}
    >
      <span>✉️</span>
      <span>Contact</span>
    </button>
  </div>
</div>
