<script lang="ts">
  import confetti from 'canvas-confetti';
  import { submitContact } from '../../utils/api';
  import { soundEngine } from '../../utils/audio';

  let { isOpen = $bindable(false) } = $props<{ isOpen?: boolean }>();

  let name = $state('');
  let email = $state('');
  let subject = $state('Portfolio Inquiry');
  let message = $state('');
  let isSending = $state(false);
  let statusMsg = $state('');
  let isSuccess = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!name || !email || !message) {
      statusMsg = 'Please fill out all required fields.';
      return;
    }
    isSending = true;
    statusMsg = '';
    try {
      await submitContact({ name, email, subject, message });
      soundEngine.playSuccessTone();
      isSuccess = true;
      statusMsg = '🚀 Message dispatched to database successfully!';
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        name = '';
        email = '';
        message = '';
        isSuccess = false;
        isOpen = false;
      }, 2500);
    } catch (err: any) {
      soundEngine.playErrorTone();
      statusMsg = `Failed to send: ${err.message}`;
    } finally {
      isSending = false;
    }
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="w-full max-w-lg bg-neutral-900/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden text-slate-100 font-sans">
      <!-- Window Header -->
      <div class="h-10 px-4 bg-neutral-950 border-b border-white/10 flex items-center justify-between select-none">
        <div class="flex items-center space-x-2">
          <button class="w-3 h-3 rounded-full bg-red-500 hover:brightness-110" onclick={() => isOpen = false} aria-label="Close"></button>
          <span class="text-xs font-semibold text-slate-300 ml-2">macOS Mail — New Message</span>
        </div>
      </div>

      <!-- Form Body -->
      <form onsubmit={handleSubmit} class="p-5 space-y-3.5 text-xs">
        {#if statusMsg}
          <div class="p-2.5 rounded-lg text-xs font-medium {isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}">
            {statusMsg}
          </div>
        {/if}

        <div>
          <label class="block text-slate-400 mb-1" for="contact-name">Your Name *</label>
          <input
            id="contact-name"
            bind:value={name}
            required
            class="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 text-white focus:border-cyan-400 outline-none"
            placeholder="Ada Lovelace"
          />
        </div>

        <div>
          <label class="block text-slate-400 mb-1" for="contact-email">Your Email *</label>
          <input
            id="contact-email"
            type="email"
            bind:value={email}
            required
            class="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 text-white focus:border-cyan-400 outline-none"
            placeholder="ada@example.com"
          />
        </div>

        <div>
          <label class="block text-slate-400 mb-1" for="contact-subject">Subject</label>
          <input
            id="contact-subject"
            bind:value={subject}
            class="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 text-white focus:border-cyan-400 outline-none"
            placeholder="Collaboration / Project Inquiry"
          />
        </div>

        <div>
          <label class="block text-slate-400 mb-1" for="contact-msg">Message *</label>
          <textarea
            id="contact-msg"
            bind:value={message}
            required
            rows="4"
            class="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 text-white focus:border-cyan-400 outline-none leading-relaxed"
            placeholder="Write your message here..."
          ></textarea>
        </div>

        <div class="pt-2 flex items-center justify-end space-x-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 font-medium transition"
            onclick={() => isOpen = false}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSending}
            class="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-bold text-white transition flex items-center space-x-1.5"
          >
            <span>{isSending ? 'Transmitting...' : 'Send Message ✉️'}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
