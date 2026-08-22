<script lang="ts">
  import { onMount } from 'svelte';
  import { isMatrixActive } from '../../stores/terminalStore';

  let canvas: HTMLCanvasElement;
  let animId: number;

  onMount(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ'.split('');
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    function draw() {
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx!.fillRect(0, 0, width, height);

      ctx!.fillStyle = '#00ff66';
      ctx!.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx!.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

{#if $isMatrixActive}
  <div class="fixed inset-0 z-40 bg-black animate-fade-in flex flex-col">
    <!-- Exit matrix banner -->
    <div class="absolute top-10 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-emerald-500/40 text-xs font-mono text-emerald-400 shadow-2xl flex items-center space-x-3">
      <span>Matrix Terminal Active (cmatrix)</span>
      <button
        class="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-white font-bold transition"
        onclick={() => isMatrixActive.set(false)}
      >
        Exit [ESC]
      </button>
    </div>

    <canvas bind:this={canvas} class="w-full h-full block"></canvas>
  </div>
{/if}
