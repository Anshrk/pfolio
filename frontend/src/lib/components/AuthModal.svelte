<script lang="ts">
  import { isAuthModalOpen, isAdminStudioOpen, login } from '../../stores/authStore';
  import { soundEngine } from '../../utils/audio';

  let username = $state('');
  let password = $state('');
  let errorMsg = $state('');
  let isLoggingIn = $state(false);

  async function handleLogin() {
    errorMsg = '';
    isLoggingIn = true;
    try {
      await login(username, password);
      soundEngine.playSuccessTone();
      isAuthModalOpen.set(false);
      isAdminStudioOpen.set(true);
    } catch (err: any) {
      soundEngine.playErrorTone();
      errorMsg = err.message || 'Incorrect credentials';
    } finally {
      isLoggingIn = false;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }
</script>

{#if $isAuthModalOpen}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div class="w-full max-w-sm bg-neutral-900/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden text-slate-100 font-sans">
      <!-- Header -->
      <div class="h-10 px-3 bg-neutral-950 border-b border-white/10 flex items-center justify-between select-none">
        <div class="flex items-center space-x-2">
          <button
            class="w-3 h-3 rounded-full bg-red-500 hover:brightness-110"
            onclick={() => isAuthModalOpen.set(false)}
            aria-label="Close"
          ></button>
          <span class="text-xs font-semibold text-slate-300 ml-2">macOS Security & Auth</span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-4 text-center">
        <div class="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/20">
          🔒
        </div>

        <div>
          <h2 class="font-bold text-base text-white">Portfolio Owner Login</h2>
          <p class="text-xs text-slate-400 mt-1">Enter credentials to unlock live PostgreSQL editing.</p>
        </div>

        {#if errorMsg}
          <div class="p-2 rounded bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-medium">
            {errorMsg}
          </div>
        {/if}

        <div class="space-y-2.5 text-left text-xs font-mono">
          <div>
            <label class="block text-slate-400 mb-1" for="auth-username">Username</label>
            <input
              id="auth-username"
              bind:value={username}
              onkeydown={handleKeyDown}
              class="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/20 text-white focus:border-cyan-400 outline-none transition"
              placeholder="Username"
            />
          </div>

          <div>
            <label class="block text-slate-400 mb-1" for="auth-pass">Password</label>
            <input
              id="auth-pass"
              bind:value={password}
              type="password"
              onkeydown={handleKeyDown}
              class="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/20 text-white focus:border-cyan-400 outline-none transition"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div class="pt-2 flex space-x-2">
          <button
            class="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
            onclick={() => isAuthModalOpen.set(false)}
          >
            Cancel
          </button>
          <button
            class="flex-1 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center justify-center space-x-1"
            onclick={handleLogin}
            disabled={isLoggingIn}
          >
            <span>{isLoggingIn ? 'Verifying...' : 'Unlock'}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
