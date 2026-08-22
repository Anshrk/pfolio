<script lang="ts">
  import { selectedProject, isProjectModalOpen, closeProjectModal } from '../../stores/portfolioStore';

  let project = $derived($selectedProject);
</script>

{#if $isProjectModalOpen && project}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="w-full max-w-3xl max-h-[85vh] bg-neutral-900/95 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
      <!-- Safari Header Bar -->
      <div class="h-11 px-4 bg-neutral-950 border-b border-white/10 flex items-center justify-between select-none">
        <div class="flex items-center space-x-2">
          <button
            class="w-3 h-3 rounded-full bg-red-500 hover:brightness-110"
            onclick={closeProjectModal}
            aria-label="Close Safari Window"
          ></button>
          <button
            class="w-3 h-3 rounded-full bg-yellow-500 hover:brightness-110"
            onclick={closeProjectModal}
            aria-label="Minimize Safari Window"
          ></button>
          <button
            class="w-3 h-3 rounded-full bg-green-500 hover:brightness-110"
            aria-label="Maximize Safari Window"
          ></button>
        </div>

        <!-- URL Address Pill -->
        <div class="px-4 py-1 rounded-full bg-white/10 text-xs font-mono text-slate-300 flex items-center space-x-2 max-w-sm truncate border border-white/5">
          <span class="text-emerald-400">🔒</span>
          <span>https://{project.slug}.anshkashyap.dev</span>
        </div>

        <div class="w-10"></div>
      </div>

      <!-- Main Project Body -->
      <div class="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-5">
        <!-- Hero Header -->
        <div>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h1 class="text-2xl font-bold text-white tracking-tight">{project.title}</h1>
            {#if project.stars}
              <div class="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center space-x-1">
                <span>★</span>
                <span>{project.stars} GitHub Stars</span>
              </div>
            {/if}
          </div>
          {#if project.tagline}
            <p class="text-sm text-cyan-400 font-mono mt-1">{project.tagline}</p>
          {/if}
        </div>

        <!-- Tech Badges -->
        <div class="flex flex-wrap gap-1.5">
          {#each project.tech_stack as tech}
            <span class="px-2.5 py-1 rounded-md bg-white/10 border border-white/10 text-xs font-mono text-slate-200">{tech}</span>
          {/each}
          {#each project.tags as tag}
            <span class="px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-800 text-xs font-mono text-cyan-300">#{tag}</span>
          {/each}
        </div>

        <!-- Project Image / Preview Banner -->
        {#if project.image_url}
          <div class="rounded-xl overflow-hidden border border-white/10 max-h-64 relative bg-black/40">
            <img src={project.image_url} alt={project.title} class="w-full h-full object-cover" />
          </div>
        {/if}

        <!-- Description -->
        <div class="space-y-3 text-slate-300 text-sm leading-relaxed">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Architecture & Overview</h3>
          <p class="whitespace-pre-wrap">{project.description}</p>
        </div>

        <!-- Action Links -->
        <div class="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div class="flex space-x-3">
            {#if project.github_url}
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold text-xs transition flex items-center space-x-2"
              >
                <span>🐙</span>
                <span>View Source Code</span>
              </a>
            {/if}
            {#if project.demo_url}
              <a
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
                class="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center space-x-2"
              >
                <span>🚀</span>
                <span>Open Live Deployment</span>
              </a>
            {/if}
          </div>

          <button
            class="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-slate-300 transition"
            onclick={closeProjectModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
