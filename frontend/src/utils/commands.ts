import { get } from 'svelte/store';
import { lines, activeDir, addLine, clearTerminal, isMatrixActive, activeEditingFile } from '../stores/terminalStore';
import { portfolioData, openProjectModal, isFinderOpen } from '../stores/portfolioStore';
import { currentTheme, setTheme, THEMES, isCrtEnabled, isScanlinesEnabled } from '../stores/themeStore';
import { toggleAudio, isAudioEnabled } from '../stores/soundStore';
import { isAuthenticated, isAuthModalOpen, isAdminStudioOpen, logout } from '../stores/authStore';
import { soundEngine } from './audio';
import type { ThemeName, VirtualFile } from '../types';

const DEVELOPER_QUOTES = [
  "\"Programs must be written for people to read, and only incidentally for machines to execute.\" — Harold Abelson",
  "\"Simplicity is prerequisite for reliability.\" — Edsger W. Dijkstra",
  "\"First, solve the problem. Then, write the code.\" — John Johnson",
  "\"The only way to go fast, is to go well.\" — Robert C. Martin",
  "\"Make it work, make it right, make it fast.\" — Kent Beck",
  "\"Talk is cheap. Show me the code.\" — Linus Torvalds"
];

export async function executeCommand(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return;

  const currentDir = get(activeDir);
  const data = get(portfolioData);
  const user = get(isAuthenticated) ? 'admin' : (data?.profile.handle || 'ansh');
  const host = data?.profile.hostname || 'macbook-pro';

  // Echo user prompt line into buffer
  addLine({
    type: 'input',
    command: trimmed,
    dir: currentDir
  });

  const parts = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
  const cmd = parts[0]?.toLowerCase();
  const args = parts.slice(1).map(arg => arg.replace(/^['"]|['"]$/g, ''));

  switch (cmd) {
    case 'help':
    case '?':
      renderHelp();
      soundEngine.playSuccessTone();
      break;

    case 'fastfetch':
    case 'neofetch':
    case 'fetch':
      addLine({ type: 'fastfetch' });
      soundEngine.playSuccessTone();
      break;

    case 'clear':
    case 'cls':
      clearTerminal();
      break;

    case 'ls':
    case 'dir':
      executeLs(args);
      break;

    case 'cd':
      executeCd(args);
      break;

    case 'pwd':
      addLine({
        type: 'output',
        content: currentDir === '~' ? `/Users/${user}` : `/Users/${user}/${currentDir.replace('~/', '')}`
      });
      break;

    case 'cat':
    case 'view':
    case 'read':
      executeCat(args);
      break;

    case 'projects':
    case 'portfolio':
    case 'work':
      executeProjects(args);
      break;

    case 'skills':
    case 'tech':
    case 'stack':
      addLine({ type: 'skills' });
      soundEngine.playSuccessTone();
      break;

    case 'experience':
    case 'exp':
    case 'history-work':
      executeExperience();
      break;

    case 'contact':
    case 'email':
    case 'msg':
      executeContact(args);
      break;

    case 'open':
    case 'start':
      executeOpen(args);
      break;

    case 'theme':
    case 'colors':
      executeTheme(args);
      break;

    case 'audio':
    case 'sound':
      executeAudio(args);
      break;

    case 'crt':
    case 'scanlines':
      executeCrt(args);
      break;

    case 'sudo':
      executeSudo(args);
      break;

    case 'login':
    case 'auth':
      isAuthModalOpen.set(true);
      addLine({
        type: 'output',
        content: "🔐 Opened Admin Authentication Dialog. You can also run 'sudo login' to authenticate in-line."
      });
      break;

    case 'logout':
      logout();
      addLine({
        type: 'success',
        content: "👋 Logged out from Administrator session."
      });
      break;

    case 'admin':
    case 'studio':
      if (get(isAuthenticated)) {
        isAdminStudioOpen.set(true);
        addLine({
          type: 'success',
          content: "🚀 Opening macOS Dynamic Portfolio Studio Control Center..."
        });
      } else {
        isAuthModalOpen.set(true);
        addLine({
          type: 'error',
          content: "🔒 Admin authentication required. Opened login dialog."
        });
      }
      break;

    case 'nano':
    case 'edit':
    case 'vim':
    case 'vi':
      executeNano(args);
      break;

    case 'cmatrix':
    case 'matrix':
      isMatrixActive.set(true);
      break;

    case 'gui':
    case 'finder':
      isFinderOpen.update(v => !v);
      addLine({
        type: 'success',
        content: get(isFinderOpen) ? "📂 Opened macOS Finder File Explorer." : "📁 Closed macOS Finder."
      });
      break;

    case 'whoami':
      addLine({
        type: 'output',
        content: get(isAuthenticated) 
          ? "admin (uid=0, gid=0, groups=admin,wheel,sudo)" 
          : `${user} (uid=501, gid=20, groups=staff,everyone,localaccounts)`
      });
      break;

    case 'date':
      addLine({
        type: 'output',
        content: new Date().toString()
      });
      break;

    case 'uptime':
      addLine({
        type: 'output',
        content: "15:20 up 24 days, 6:42, 2 users, load averages: 1.42 1.38 1.25"
      });
      break;

    case 'history':
      executeHistory();
      break;

    case 'echo':
      addLine({
        type: 'output',
        content: args.join(' ')
      });
      break;

    case 'weather':
      executeWeather(args[0] || 'San Francisco');
      break;

    case 'quote':
      const q = DEVELOPER_QUOTES[Math.floor(Math.random() * DEVELOPER_QUOTES.length)];
      addLine({
        type: 'custom-html',
        htmlContent: `<div class="p-3 my-1 rounded bg-white/5 border border-white/10 italic text-cyan-300 font-mono text-sm">${q}</div>`
      });
      break;

    default:
      soundEngine.playErrorTone();
      addLine({
        type: 'error',
        content: `zsh: command not found: ${cmd}. Type 'help' to see available commands.`
      });
      break;
  }
}

function renderHelp() {
  const isAuth = get(isAuthenticated);
  const helpHtml = `
<div class="space-y-3 my-2 font-mono text-xs md:text-sm">
  <div class="text-amber-300 font-bold border-b border-white/10 pb-1">⚡ AVAILABLE COMMANDS & UTILITIES</div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    <div>
      <span class="text-emerald-400 font-semibold">fastfetch</span> / <span class="text-emerald-400">neofetch</span>
      <p class="text-slate-400 text-xs">Display system specifications, banner, and tech gauges.</p>
    </div>
    <div>
      <span class="text-emerald-400 font-semibold">projects</span> <span class="text-slate-500">[--all | &lt;slug&gt;]</span>
      <p class="text-slate-400 text-xs">Interactive portfolio showcase with links & previews.</p>
    </div>
    <div>
      <span class="text-emerald-400 font-semibold">skills</span>
      <p class="text-slate-400 text-xs">Visual breakdown of languages, frameworks & proficiency.</p>
    </div>
    <div>
      <span class="text-emerald-400 font-semibold">experience</span>
      <p class="text-slate-400 text-xs">Career history, milestones, and achievements.</p>
    </div>
    <div>
      <span class="text-emerald-400 font-semibold">ls</span> <span class="text-slate-500">[-la] [path]</span> &nbsp;|&nbsp; <span class="text-emerald-400 font-semibold">cd</span> <span class="text-slate-500">&lt;dir&gt;</span>
      <p class="text-slate-400 text-xs">Navigate the virtual filesystem.</p>
    </div>
    <div>
      <span class="text-emerald-400 font-semibold">cat</span> <span class="text-slate-500">&lt;file&gt;</span> &nbsp;|&nbsp; <span class="text-emerald-400 font-semibold">pwd</span>
      <p class="text-slate-400 text-xs">Read file contents (e.g., <code class="text-cyan-300">cat about.md</code>, <code class="text-cyan-300">cat resume.txt</code>).</p>
    </div>
    <div>
      <span class="text-emerald-400 font-semibold">open</span> <span class="text-slate-500">&lt;project | resume | file&gt;</span>
      <p class="text-slate-400 text-xs">Launch visual GUI modal preview for projects or documents.</p>
    </div>
    <div>
      <span class="text-emerald-400 font-semibold">contact</span>
      <p class="text-slate-400 text-xs">Send a direct message or view social endpoints.</p>
    </div>
    <div>
      <span class="text-emerald-400 font-semibold">theme</span> <span class="text-slate-500">&lt;name&gt;</span>
      <p class="text-slate-400 text-xs">Switch palette: tokyo-night, dracula, matrix, cyberpunk, apple-retro, monokai, catppuccin, nord.</p>
    </div>
    <div>
      <span class="text-emerald-400 font-semibold">audio</span> &nbsp;|&nbsp; <span class="text-emerald-400 font-semibold">crt</span>
      <p class="text-slate-400 text-xs">Toggle mechanical keyboard clicks & retro CRT scanlines.</p>
    </div>
    <div>
      <span class="text-emerald-400 font-semibold">gui</span> / <span class="text-emerald-400 font-semibold">finder</span>
      <p class="text-slate-400 text-xs">Toggle macOS Finder visual explorer.</p>
    </div>
    <div>
      <span class="text-emerald-400 font-semibold">cmatrix</span> &nbsp;|&nbsp; <span class="text-emerald-400 font-semibold">weather</span> &nbsp;|&nbsp; <span class="text-emerald-400 font-semibold">quote</span>
      <p class="text-slate-400 text-xs">Digital matrix rain, weather forecast, and dev quotes.</p>
    </div>
  </div>

  <div class="mt-2 pt-2 border-t border-white/10 text-xs">
    <span class="text-purple-400 font-semibold">👑 Admin Commands:</span>
    <span class="text-slate-400"> Run <code class="text-amber-300">sudo login</code> or <code class="text-amber-300">admin</code> to edit portfolio content dynamically.</span>
    ${isAuth ? `<span class="text-emerald-400 font-bold ml-2">● AUTHENTICATED (Try 'nano &lt;file&gt;' or 'admin')</span>` : ''}
  </div>
</div>
`;

  addLine({
    type: 'custom-html',
    htmlContent: helpHtml
  });
}

function executeLs(args: string[]) {
  const currentDir = get(activeDir);
  const data = get(portfolioData);
  const files = data?.virtual_files || [];
  const showAll = args.some(a => a.includes('a'));
  const showLong = args.some(a => a.includes('l'));

  // Target dir resolution
  const targetArg = args.find(a => !a.startsWith('-')) || currentDir;
  const targetDir = resolvePath(targetArg, currentDir);

  const matched = files.filter(f => f.parent_dir === targetDir);

  if (matched.length === 0 && targetDir !== '~') {
    const isSingleFile = files.find(f => f.path === targetDir && !f.is_directory);
    if (isSingleFile) {
      addLine({
        type: 'output',
        content: isSingleFile.filename
      });
      return;
    }
  }

  if (showLong) {
    let output = `<div class="font-mono text-xs space-y-1 my-1">`;
    output += `<div class="text-slate-500">total ${matched.length * 8}</div>`;
    matched.forEach(f => {
      const color = f.is_directory ? 'text-blue-400 font-bold' : f.file_type === 'executable' ? 'text-green-400 font-bold' : 'text-slate-200';
      const icon = f.is_directory ? '📁' : f.file_type === 'markdown' ? '📝' : f.file_type === 'json' ? '⚙️' : '📄';
      output += `<div class="flex items-center space-x-3">
        <span class="text-slate-500">${f.permissions}</span>
        <span class="text-slate-500">ansh</span>
        <span class="text-slate-500">staff</span>
        <span class="text-slate-400 w-12 text-right">${f.size_bytes}B</span>
        <span class="text-slate-500">Aug 22</span>
        <span class="${color}">${icon} ${f.filename}</span>
      </div>`;
    });
    output += `</div>`;
    addLine({ type: 'custom-html', htmlContent: output });
  } else {
    let output = `<div class="flex flex-wrap gap-4 font-mono text-sm my-1">`;
    matched.forEach(f => {
      const color = f.is_directory ? 'text-blue-400 font-semibold' : f.file_type === 'executable' ? 'text-green-400 font-semibold' : 'text-slate-200';
      const slash = f.is_directory ? '/' : '';
      output += `<span class="${color} hover:underline cursor-pointer" onclick="window.__termRun('cat ${f.filename}')">${f.filename}${slash}</span>`;
    });
    output += `</div>`;
    addLine({ type: 'custom-html', htmlContent: output });
  }
}

function executeCd(args: string[]) {
  const target = args[0] || '~';
  const currentDir = get(activeDir);
  const nextDir = resolvePath(target, currentDir);
  const data = get(portfolioData);
  const files = data?.virtual_files || [];

  if (nextDir === '~') {
    activeDir.set('~');
    return;
  }

  const exists = files.some(f => (f.path === nextDir && f.is_directory) || (f.parent_dir === nextDir));
  if (exists || nextDir === '~') {
    activeDir.set(nextDir);
  } else {
    soundEngine.playErrorTone();
    addLine({
      type: 'error',
      content: `cd: no such file or directory: ${target}`
    });
  }
}

function executeCat(args: string[]) {
  if (!args[0]) {
    addLine({ type: 'error', content: 'cat: missing filename. Usage: cat <file>' });
    return;
  }
  const currentDir = get(activeDir);
  const targetPath = resolvePath(args[0], currentDir);
  const data = get(portfolioData);
  const file = data?.virtual_files.find(f => f.path === targetPath);

  if (!file) {
    soundEngine.playErrorTone();
    addLine({ type: 'error', content: `cat: ${args[0]}: No such file or directory` });
    return;
  }

  if (file.is_directory) {
    addLine({ type: 'error', content: `cat: ${args[0]}: Is a directory` });
    return;
  }

  soundEngine.playSuccessTone();
  addLine({
    type: 'custom-html',
    htmlContent: `
      <div class="p-3 my-2 rounded bg-black/40 border border-white/10 font-mono text-xs md:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
        ${escapeHtml(file.content)}
      </div>
    `
  });
}

function executeProjects(args: string[]) {
  const data = get(portfolioData);
  const projects = data?.projects || [];

  if (args[0] && !args[0].startsWith('-')) {
    const slug = args[0].toLowerCase();
    const proj = projects.find(p => p.slug.toLowerCase() === slug || p.title.toLowerCase().includes(slug));
    if (proj) {
      openProjectModal(proj);
      addLine({ type: 'success', content: `🚀 Opening project card for "${proj.title}"...` });
      return;
    }
  }

  addLine({ type: 'projects' });
  soundEngine.playSuccessTone();
}

function executeExperience() {
  const data = get(portfolioData);
  const exps = data?.experiences || [];
  let html = `<div class="space-y-4 my-3 font-mono">
    <div class="text-amber-300 font-bold text-sm border-b border-white/10 pb-1">💼 CAREER & EXPERIENCE TIMELINE</div>
  `;

  exps.forEach(exp => {
    html += `
      <div class="p-3 rounded bg-white/5 border border-white/10">
        <div class="flex flex-wrap items-center justify-between text-sm">
          <span class="text-emerald-400 font-bold">${exp.role}</span>
          <span class="text-cyan-400 text-xs px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">${exp.start_date} — ${exp.end_date || 'Present'}</span>
        </div>
        <div class="text-slate-300 text-xs mt-1 font-semibold">${exp.company} <span class="text-slate-500">(${exp.location})</span></div>
        <p class="text-slate-400 text-xs mt-2 leading-relaxed">${exp.description}</p>
        <ul class="list-disc list-inside mt-2 space-y-1 text-xs text-slate-300">
          ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
        </ul>
        <div class="flex flex-wrap gap-1.5 mt-3">
          ${exp.technologies.map(t => `<span class="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">${t}</span>`).join('')}
        </div>
      </div>
    `;
  });
  html += `</div>`;
  addLine({ type: 'custom-html', htmlContent: html });
  soundEngine.playSuccessTone();
}

function executeContact(args: string[]) {
  const data = get(portfolioData);
  const p = data?.profile;
  const html = `
    <div class="p-4 my-2 rounded bg-black/40 border border-white/10 font-mono text-xs md:text-sm space-y-2">
      <div class="text-amber-300 font-bold text-sm mb-2">📬 CONTACT CHANNELS</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
        <div>✉️ Email: <a href="mailto:${p?.email}" class="text-cyan-400 hover:underline">${p?.email}</a></div>
        <div>🐙 GitHub: <a href="${p?.github}" target="_blank" class="text-cyan-400 hover:underline">${p?.github}</a></div>
        <div>💼 LinkedIn: <a href="${p?.linkedin}" target="_blank" class="text-cyan-400 hover:underline">${p?.linkedin}</a></div>
        <div>🐦 X/Twitter: <a href="${p?.twitter}" target="_blank" class="text-cyan-400 hover:underline">${p?.twitter}</a></div>
      </div>
      <div class="pt-2 text-slate-400 text-xs">
        💡 Want to send a message directly from the browser? Click on the <span class="text-amber-300 font-semibold">Contact</span> icon in the macOS Dock or use the quick buttons below!
      </div>
    </div>
  `;
  addLine({ type: 'custom-html', htmlContent: html });
  soundEngine.playSuccessTone();
}

function executeOpen(args: string[]) {
  const target = (args[0] || '').toLowerCase();
  const data = get(portfolioData);
  if (!target) {
    addLine({ type: 'error', content: "open: missing operand. E.g., 'open novakv', 'open resume', 'open finder'" });
    return;
  }

  if (target === 'resume' || target === 'resume.txt') {
    window.open(data?.profile.resume_url || '#', '_blank');
    addLine({ type: 'success', content: "📄 Opening Resume..." });
    return;
  }

  if (target === 'finder') {
    isFinderOpen.set(true);
    addLine({ type: 'success', content: "📂 Opening macOS Finder..." });
    return;
  }

  const proj = data?.projects.find(p => p.slug.toLowerCase() === target || p.title.toLowerCase().includes(target));
  if (proj) {
    openProjectModal(proj);
    addLine({ type: 'success', content: `🚀 Opening "${proj.title}" GUI Preview...` });
    return;
  }

  addLine({ type: 'error', content: `open: could not find application or document for '${target}'` });
}

function executeTheme(args: string[]) {
  const name = args[0] as ThemeName;
  if (!name) {
    const list = Object.keys(THEMES).map(t => `<code class="text-cyan-300 cursor-pointer hover:underline" onclick="window.__termRun('theme ${t}')">${t}</code>`).join(', ');
    addLine({
      type: 'custom-html',
      htmlContent: `<div class="font-mono text-xs md:text-sm my-1">🎨 Available Themes: ${list}<br><span class="text-slate-400">Usage: theme &lt;name&gt; (e.g. 'theme tokyo-night')</span></div>`
    });
    return;
  }

  if (setTheme(name)) {
    soundEngine.playSuccessTone();
    addLine({
      type: 'success',
      content: `🎨 Theme switched to "${THEMES[name].name}".`
    });
  } else {
    soundEngine.playErrorTone();
    addLine({
      type: 'error',
      content: `theme: unknown theme '${name}'. Try 'theme' to see all choices.`
    });
  }
}

function executeAudio(args: string[]) {
  const next = toggleAudio();
  addLine({
    type: 'success',
    content: next ? "🔊 Mechanical keyboard sound effects ENABLED." : "🔇 Mechanical keyboard sound effects MUTED."
  });
}

function executeCrt(args: string[]) {
  isCrtEnabled.update(v => {
    const n = !v;
    isScanlinesEnabled.set(n);
    return n;
  });
  const current = get(isCrtEnabled);
  addLine({
    type: 'success',
    content: current ? "📺 Vintage CRT scanlines and phosphor glow ENABLED." : "📺 CRT scanlines DISABLED."
  });
}

function executeSudo(args: string[]) {
  if (args[0] === 'login' || args[0] === 'auth') {
    isAuthModalOpen.set(true);
    addLine({
      type: 'output',
      content: "🔑 Launching admin authorization prompt..."
    });
    return;
  }
  addLine({
    type: 'output',
    content: "sudo: permission granted for local session. Type 'sudo login' to authenticate as portfolio administrator."
  });
}

function executeNano(args: string[]) {
  const isAuth = get(isAuthenticated);
  if (!isAuth) {
    isAuthModalOpen.set(true);
    addLine({
      type: 'error',
      content: "🔒 Admin authorization required to edit virtual files. Opened login dialog."
    });
    return;
  }

  const target = args[0] || 'new_file.txt';
  const currentDir = get(activeDir);
  const targetPath = resolvePath(target, currentDir);
  const data = get(portfolioData);
  let file = data?.virtual_files.find(f => f.path === targetPath);

  if (!file) {
    file = {
      id: 0,
      path: targetPath,
      filename: target.split('/').pop() || target,
      parent_dir: currentDir,
      is_directory: false,
      content: "",
      file_type: "text",
      permissions: "-rw-r--r--",
      size_bytes: 0
    };
  }

  activeEditingFile.set(file);
}

function executeHistory() {
  const history = (window as unknown as { __cmdHistory?: string[] }).__cmdHistory || [];
  let out = `<div class="font-mono text-xs space-y-0.5 my-1">`;
  history.forEach((h, i) => {
    out += `<div><span class="text-slate-500 mr-3">${i + 1}</span> <span class="text-slate-300">${escapeHtml(h)}</span></div>`;
  });
  out += `</div>`;
  addLine({ type: 'custom-html', htmlContent: out });
}

function executeWeather(city: string) {
  const html = `
    <div class="p-3 my-2 rounded bg-cyan-950/40 border border-cyan-800/60 font-mono text-xs text-cyan-200">
      <div class="font-bold text-amber-300 mb-1">🌤️ Terminal Weather Forecast — ${city}</div>
      <pre class="text-[11px] leading-tight">
    \\  /      Clear Sky & Coding
   _ /"".-.   Temp: +22°C (Feels like 22°C)
     \\_(   ). Wind: 12 km/h NW
     /(___(__) Humidity: 48% | Visibility: 10 km
      </pre>
    </div>
  `;
  addLine({ type: 'custom-html', htmlContent: html });
  soundEngine.playSuccessTone();
}

function resolvePath(target: string, current: string): string {
  if (target === '~' || target === '') return '~';
  if (target === '..') {
    if (current === '~') return '~';
    const parts = current.split('/');
    parts.pop();
    return parts.join('/') || '~';
  }
  if (target.startsWith('~/')) return target;
  if (target.startsWith('/')) return `~${target}`;
  if (current === '~') return `~/${target}`;
  return `${current}/${target}`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Global click helper for interactive HTML chips
if (typeof window !== 'undefined') {
  (window as unknown as { __termRun: (cmd: string) => void }).__termRun = (cmd: string) => {
    executeCommand(cmd);
  };
}
