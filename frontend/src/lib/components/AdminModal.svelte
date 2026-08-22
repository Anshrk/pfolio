<script lang="ts">
  import { isAdminStudioOpen, logout } from '../../stores/authStore';
  import { portfolioData, updateLocalProject, removeLocalProject, updateLocalProfile, loadPortfolio } from '../../stores/portfolioStore';
  import {
    createProjectAdmin, updateProjectAdmin, deleteProjectAdmin,
    updateProfileAdmin, createSkillAdmin, deleteSkillAdmin,
    getAdminMessages, deleteMessageAdmin
  } from '../../utils/api';
  import { soundEngine } from '../../utils/audio';
  import type { Project, Skill, Profile, ContactMessage } from '../../types';

  let activeTab: 'projects' | 'profile' | 'skills' | 'messages' = $state('projects');

  // Project Editor State
  let editingProject = $state<Partial<Project> | null>(null);
  let isSaving = $state(false);
  let statusMsg = $state('');

  // Messages State
  let messages = $state<ContactMessage[]>([]);
  let isLoadingMessages = $state(false);

  // Profile Form State
  let profileForm = $state<Partial<Profile>>({
    name: $portfolioData?.profile.name || '',
    title: $portfolioData?.profile.title || '',
    tagline: $portfolioData?.profile.tagline || '',
    bio: $portfolioData?.profile.bio || '',
    location: $portfolioData?.profile.location || '',
    email: $portfolioData?.profile.email || '',
    github: $portfolioData?.profile.github || '',
    linkedin: $portfolioData?.profile.linkedin || '',
    twitter: $portfolioData?.profile.twitter || ''
  });

  // Skills Form State
  let newSkill = $state<Partial<Skill>>({
    name: '',
    category: 'Languages',
    proficiency: 90,
    level: 'Expert'
  });

  async function handleLoadMessages() {
    isLoadingMessages = true;
    try {
      messages = await getAdminMessages();
    } catch (e) {
      console.error(e);
    } finally {
      isLoadingMessages = false;
    }
  }

  function startNewProject() {
    editingProject = {
      slug: `project-${Date.now().toString(36)}`,
      title: '',
      tagline: '',
      description: '',
      tech_stack: ['Python', 'FastAPI', 'Svelte'],
      tags: ['Fullstack'],
      github_url: 'https://github.com/anshkashyap',
      demo_url: '',
      featured: false,
      stars: 10,
      sort_order: ($portfolioData?.projects.length || 0) + 1
    };
  }

  function editProject(p: Project) {
    editingProject = { ...p };
  }

  async function saveProject() {
    if (!editingProject || !editingProject.title || !editingProject.slug) {
      statusMsg = 'Please provide title and slug';
      return;
    }
    isSaving = true;
    try {
      if (editingProject.id) {
        const updated = await updateProjectAdmin(editingProject.id, editingProject);
        updateLocalProject(updated);
      } else {
        const created = await createProjectAdmin(editingProject);
        updateLocalProject(created);
      }
      soundEngine.playSuccessTone();
      statusMsg = '✅ Project saved to PostgreSQL!';
      editingProject = null;
      setTimeout(() => { statusMsg = ''; }, 3000);
    } catch (err: any) {
      soundEngine.playErrorTone();
      statusMsg = `❌ Error: ${err.message}`;
    } finally {
      isSaving = false;
    }
  }

  async function handleDeleteProject(id: number) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProjectAdmin(id);
      removeLocalProject(id);
      soundEngine.playSuccessTone();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  }

  async function saveProfile() {
    isSaving = true;
    try {
      const updated = await updateProfileAdmin(profileForm);
      updateLocalProfile(updated);
      soundEngine.playSuccessTone();
      statusMsg = '✅ Profile & specs saved!';
      setTimeout(() => { statusMsg = ''; }, 3000);
    } catch (err: any) {
      soundEngine.playErrorTone();
      statusMsg = `❌ Error: ${err.message}`;
    } finally {
      isSaving = false;
    }
  }

  async function handleAddSkill() {
    if (!newSkill.name) return;
    try {
      await createSkillAdmin(newSkill);
      await loadPortfolio();
      newSkill.name = '';
      soundEngine.playSuccessTone();
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function handleDeleteSkill(id: number) {
    try {
      await deleteSkillAdmin(id);
      await loadPortfolio();
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function handleDeleteMessage(id: number) {
    try {
      await deleteMessageAdmin(id);
      messages = messages.filter(m => m.id !== id);
    } catch (e: any) {
      alert(e.message);
    }
  }
</script>

{#if $isAdminStudioOpen}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="w-full max-w-4xl max-h-[85vh] bg-neutral-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
      <!-- Window Header -->
      <div class="h-11 px-4 bg-neutral-950 border-b border-white/10 flex items-center justify-between select-none">
        <div class="flex items-center space-x-2">
          <button
            class="w-3 h-3 rounded-full bg-red-500 hover:brightness-110"
            onclick={() => isAdminStudioOpen.set(false)}
            aria-label="Close"
          ></button>
          <span class="text-xs font-bold text-cyan-400 font-mono flex items-center space-x-1 ml-2">
            <span>⚙️</span>
            <span>macOS Dynamic Portfolio Studio (PostgreSQL Live Center)</span>
          </span>
        </div>

        <div class="flex items-center space-x-2">
          <button
            class="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium transition"
            onclick={logout}
          >
            Log Out
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="px-4 py-2 bg-neutral-900 border-b border-white/10 flex space-x-2 text-xs font-medium">
        <button
          class="px-3 py-1.5 rounded-lg transition {activeTab === 'projects' ? 'bg-cyan-600 text-white font-bold' : 'hover:bg-white/5 text-slate-400'}"
          onclick={() => activeTab = 'projects'}
        >
          🚀 Projects ({$portfolioData?.projects.length || 0})
        </button>
        <button
          class="px-3 py-1.5 rounded-lg transition {activeTab === 'profile' ? 'bg-cyan-600 text-white font-bold' : 'hover:bg-white/5 text-slate-400'}"
          onclick={() => activeTab = 'profile'}
        >
          👤 Profile & Fastfetch
        </button>
        <button
          class="px-3 py-1.5 rounded-lg transition {activeTab === 'skills' ? 'bg-cyan-600 text-white font-bold' : 'hover:bg-white/5 text-slate-400'}"
          onclick={() => activeTab = 'skills'}
        >
          ⚡ Skills ({$portfolioData?.skills.length || 0})
        </button>
        <button
          class="px-3 py-1.5 rounded-lg transition {activeTab === 'messages' ? 'bg-cyan-600 text-white font-bold' : 'hover:bg-white/5 text-slate-400'}"
          onclick={() => { activeTab = 'messages'; handleLoadMessages(); }}
        >
          📬 Inquiries
        </button>
      </div>

      <!-- Status notification -->
      {#if statusMsg}
        <div class="px-4 py-1.5 bg-cyan-950 text-cyan-300 text-xs font-mono text-center font-bold">
          {statusMsg}
        </div>
      {/if}

      <!-- Main Body Container -->
      <div class="flex-1 p-5 overflow-y-auto custom-scrollbar text-xs sm:text-sm">
        <!-- 1. PROJECTS TAB -->
        {#if activeTab === 'projects'}
          {#if editingProject}
            <!-- Project Edit Form -->
            <div class="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div class="flex justify-between items-center border-b border-white/10 pb-2">
                <span class="font-bold text-cyan-300">{editingProject.id ? 'Edit Project' : 'Create New Project'}</span>
                <button class="text-xs text-slate-400 hover:text-white" onclick={() => editingProject = null}>Cancel</button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-400 mb-1" for="proj-title">Project Title</label>
                  <input id="proj-title" bind:value={editingProject.title} class="w-full px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white" placeholder="e.g. NovaKV Distributed Store" />
                </div>
                <div>
                  <label class="block text-slate-400 mb-1" for="proj-slug">URL Slug</label>
                  <input id="proj-slug" bind:value={editingProject.slug} class="w-full px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white" placeholder="novakv" />
                </div>
              </div>

              <div>
                <label class="block text-slate-400 mb-1" for="proj-tagline">Tagline</label>
                <input id="proj-tagline" bind:value={editingProject.tagline} class="w-full px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white" placeholder="High-throughput distributed Key-Value store" />
              </div>

              <div>
                <label class="block text-slate-400 mb-1" for="proj-desc">Full Description</label>
                <textarea id="proj-desc" bind:value={editingProject.description} rows="3" class="w-full px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white leading-relaxed" placeholder="Detailed architectural highlights..."></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-400 mb-1" for="proj-gh">GitHub URL</label>
                  <input id="proj-gh" bind:value={editingProject.github_url} class="w-full px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white" />
                </div>
                <div>
                  <label class="block text-slate-400 mb-1" for="proj-demo">Demo / Live URL</label>
                  <input id="proj-demo" bind:value={editingProject.demo_url} class="w-full px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white" />
                </div>
              </div>

              <div class="flex items-center space-x-4 pt-2">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" bind:checked={editingProject.featured} class="rounded border-white/20 text-cyan-500 focus:ring-0" />
                  <span>Featured Project</span>
                </label>
                <button
                  class="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-bold text-white transition ml-auto flex items-center space-x-2"
                  onclick={saveProject}
                  disabled={isSaving}
                >
                  <span>💾</span>
                  <span>{isSaving ? 'Saving...' : 'Save to PostgreSQL'}</span>
                </button>
              </div>
            </div>
          {:else}
            <!-- Projects Listing -->
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-slate-400">Manage public portfolio projects:</span>
                <button class="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition" onclick={startNewProject}>
                  + Add Project
                </button>
              </div>

              <div class="grid grid-cols-1 gap-2.5">
                {#each ($portfolioData?.projects || []) as p}
                  <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-cyan-500/40 transition">
                    <div>
                      <div class="font-bold text-cyan-300 flex items-center space-x-2">
                        <span>{p.title}</span>
                        {#if p.featured}
                          <span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">★ Featured</span>
                        {/if}
                      </div>
                      <div class="text-slate-400 text-xs mt-0.5">{p.tagline || p.description.slice(0, 70) + '...'}</div>
                    </div>

                    <div class="flex items-center space-x-2">
                      <button class="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200" onclick={() => editProject(p)}>
                        Edit
                      </button>
                      <button class="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300" onclick={() => handleDeleteProject(p.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

        <!-- 2. PROFILE & FASTFETCH TAB -->
        {:else if activeTab === 'profile'}
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-400 mb-1" for="prof-name">Full Name</label>
                <input id="prof-name" bind:value={profileForm.name} class="w-full px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white" />
              </div>
              <div>
                <label class="block text-slate-400 mb-1" for="prof-title">Headline / Title</label>
                <input id="prof-title" bind:value={profileForm.title} class="w-full px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white" />
              </div>
            </div>

            <div>
              <label class="block text-slate-400 mb-1" for="prof-tagline">Tagline</label>
              <input id="prof-tagline" bind:value={profileForm.tagline} class="w-full px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white" />
            </div>

            <div>
              <label class="block text-slate-400 mb-1" for="prof-bio">Bio (about.md preview)</label>
              <textarea id="prof-bio" bind:value={profileForm.bio} rows="3" class="w-full px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white"></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-slate-400 mb-1" for="prof-email">Email</label>
                <input id="prof-email" bind:value={profileForm.email} class="w-full px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white" />
              </div>
              <div>
                <label class="block text-slate-400 mb-1" for="prof-gh">GitHub</label>
                <input id="prof-gh" bind:value={profileForm.github} class="w-full px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white" />
              </div>
              <div>
                <label class="block text-slate-400 mb-1" for="prof-li">LinkedIn</label>
                <input id="prof-li" bind:value={profileForm.linkedin} class="w-full px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white" />
              </div>
            </div>

            <div class="pt-3">
              <button class="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-bold text-white transition" onclick={saveProfile}>
                💾 Save Profile Changes
              </button>
            </div>
          </div>

        <!-- 3. SKILLS TAB -->
        {:else if activeTab === 'skills'}
          <div class="space-y-4">
            <div class="p-3 bg-white/5 rounded-xl border border-white/10 space-y-3">
              <div class="font-bold text-cyan-300">Add Technical Skill</div>
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input bind:value={newSkill.name} placeholder="Skill name (e.g. SvelteKit)" class="px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white sm:col-span-2" />
                <select bind:value={newSkill.category} class="px-3 py-1.5 rounded bg-black/50 border border-white/20 text-white">
                  <option value="Languages">Languages</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                </select>
                <button class="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 font-semibold text-white transition" onclick={handleAddSkill}>
                  + Add Skill
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {#each ($portfolioData?.skills || []) as s}
                <div class="p-2.5 rounded bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span class="font-medium text-slate-200">{s.name}</span>
                    <span class="text-xs text-slate-400 ml-2">({s.category}, {s.proficiency}%)</span>
                  </div>
                  <button class="text-xs text-red-400 hover:text-red-300" onclick={() => handleDeleteSkill(s.id)}>Remove</button>
                </div>
              {/each}
            </div>
          </div>

        <!-- 4. MESSAGES / INQUIRIES TAB -->
        {:else if activeTab === 'messages'}
          <div class="space-y-3">
            {#if isLoadingMessages}
              <div class="text-center py-6 text-slate-400">Loading inquiries from database...</div>
            {:else if messages.length === 0}
              <div class="text-center py-6 text-slate-500">No contact inquiries yet.</div>
            {:else}
              {#each messages as msg}
                <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div class="flex justify-between items-center text-xs">
                    <span class="font-bold text-cyan-300">{msg.name} &lt;{msg.email}&gt;</span>
                    <button class="text-red-400 hover:underline" onclick={() => msg.id && handleDeleteMessage(msg.id)}>Delete</button>
                  </div>
                  <div class="font-semibold text-slate-200">{msg.subject}</div>
                  <p class="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              {/each}
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
