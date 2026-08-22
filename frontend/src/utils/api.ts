import type { PortfolioPayload, Project, Skill, Experience, VirtualFile, ContactMessage, Profile } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('pfolio_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchPortfolio(): Promise<PortfolioPayload> {
  try {
    const res = await fetch(`${API_BASE}/portfolio`);
    if (!res.ok) {
      throw new Error(`Failed to fetch portfolio: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('Backend API connection warning, using fallback local mock:', err);
    return getLocalFallbackPortfolio();
  }
}

export async function submitContact(data: { name: string; email: string; subject?: string; message: string }): Promise<ContactMessage> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to send message');
  }
  return await res.json();
}

export async function loginAdmin(username: string, password: string): Promise<{ access_token: string; username: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Authentication failed');
  }
  const data = await res.json();
  localStorage.setItem('pfolio_token', data.access_token);
  return data;
}

export async function getAdminMe(): Promise<{ username: string; is_authenticated: boolean } | null> {
  const token = localStorage.getItem('pfolio_token');
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      localStorage.removeItem('pfolio_token');
      return null;
    }
    return await res.json();
  } catch {
    return null;
  }
}

// --- Admin CRUD APIs ---
export async function updateProfileAdmin(data: Partial<Profile>): Promise<Profile> {
  const res = await fetch(`${API_BASE}/admin/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return await res.json();
}

export async function createProjectAdmin(project: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_BASE}/admin/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return await res.json();
}

export async function updateProjectAdmin(id: number, project: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return await res.json();
}

export async function deleteProjectAdmin(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete project');
}

export async function createSkillAdmin(skill: Partial<Skill>): Promise<Skill> {
  const res = await fetch(`${API_BASE}/admin/skills`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(skill),
  });
  if (!res.ok) throw new Error('Failed to create skill');
  return await res.json();
}

export async function deleteSkillAdmin(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/skills/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete skill');
}

export async function upsertFileAdmin(file: Partial<VirtualFile>): Promise<VirtualFile> {
  const res = await fetch(`${API_BASE}/admin/files`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(file),
  });
  if (!res.ok) throw new Error('Failed to save file');
  return await res.json();
}

export async function deleteFileAdmin(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/files/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete file');
}

export async function getAdminMessages(): Promise<ContactMessage[]> {
  const res = await fetch(`${API_BASE}/admin/messages`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch messages');
  return await res.json();
}

export async function deleteMessageAdmin(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/messages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete message');
}

// Fallback seed data in case frontend is previewed offline or before backend is running
function getLocalFallbackPortfolio(): PortfolioPayload {
  return {
    profile: {
      id: 1,
      name: "Ansh Ravi Kashyap",
      handle: "anshrk",
      hostname: "macbook-pro",
      title: "Computer Science Engineer @ R.V. College of Engineering (CGPA: 9.55)",
      tagline: "Edge AI Research Intern @ Samsung PRISM | Full-Stack Developer & Systems Enthusiast",
      bio: "Computer Science undergraduate at R.V. College of Engineering (CGPA: 9.55). Researcher in Edge AI model quantization (RepViT, Qualcomm AIMET) at Samsung PRISM and full-stack engineer.",
      location: "Bangalore, Karnataka, India",
      email: "anshrk.13@gmail.com",
      github: "https://github.com/anshrk",
      linkedin: "https://linkedin.com/in/anshrk",
      twitter: "https://x.com/anshrk",
      website: "https://anshrk.github.io",
      fastfetch_specs: {
        "Name": "Ansh Ravi Kashyap",
        "Education": "B.E. Computer Science @ R.V. College of Engineering (CGPA: 9.55)",
        "Role": "Student Research Intern @ Samsung PRISM | Ex-SDE Intern @ Spiked.ai",
        "OS": "macOS Sequoia 15.2 arm64",
        "Host": "MacBook Pro 16-inch (Apple M3 Max)",
        "Kernel": "Darwin 24.2.0 (xnu-11215.61.5~2)",
        "Languages": "Python, C, C++, TypeScript, JavaScript, Dart, SQL",
        "Specializations": "Edge AI / NPU Quantization (AIMET), Full-Stack (Svelte, React, FastAPI)",
        "Interests": "Pianist (College Music Club), QuizCorp Trivia, Chess, Football",
        "Location": "Bangalore, Karnataka, India"
      }
    },
    projects: [
      {
        id: 1,
        slug: "aid-response",
        title: "Aid-Response (Disaster Comm. & Mesh Network)",
        tagline: "Fault-tolerant emergency communication digital twin & dynamic Dijkstra routing",
        description: "Built a fault-tolerant emergency communication digital twin featuring a real-time WebSocket dashboard and dynamic Dijkstra routing with Web Crypto zero-trust encryption.",
        tech_stack: ["React", "Node.js", "PostgreSQL", "Web Crypto API", "WebSockets"],
        tags: ["Emergency Tech", "Mesh Network", "Real-Time", "Security"],
        github_url: "https://github.com/anshrk/aid-response",
        featured: true,
        stars: 142,
        sort_order: 1
      },
      {
        id: 2,
        slug: "churn-prediction-api",
        title: "Customer Churn Prediction & Real-Time Risk API",
        tagline: "End-to-end ML pipeline with real-time inference telemetry & Dockerized dashboard",
        description: "Deployed an end-to-end Machine Learning pipeline to classify customer churn risk in real-time using XGBoost and FastAPI with AWS DynamoDB telemetry.",
        tech_stack: ["FastAPI", "XGBoost", "Docker", "Streamlit", "AWS DynamoDB", "Python"],
        tags: ["Machine Learning", "FastAPI", "MLOps", "AWS"],
        github_url: "https://github.com/anshrk/churn-risk-api",
        featured: true,
        stars: 186,
        sort_order: 2
      },
      {
        id: 3,
        slug: "piano-transcription-app",
        title: "Polyphonic Piano Music Transcription Application",
        tagline: "Real-time acoustic piano audio to MIDI transcription using ResNet-CRNN & ONNX",
        description: "Developed a real-time deep learning PyTorch application to transcribe polyphonic piano to MIDI with a multi-threaded desktop GUI in PySide6.",
        tech_stack: ["PyTorch", "ONNX", "PySide6", "ResNet-CRNN", "Audio DSP"],
        tags: ["Deep Learning", "Audio DSP", "PyTorch", "Desktop GUI"],
        github_url: "https://github.com/anshrk/piano-transcription",
        featured: true,
        stars: 230,
        sort_order: 3
      }
    ],
    skills: [
      { id: 1, category: "Languages", name: "Python", proficiency: 98, level: "Expert", sort_order: 1 },
      { id: 2, category: "Languages", name: "TypeScript & JavaScript", proficiency: 94, level: "Expert", sort_order: 2 },
      { id: 3, category: "Languages", name: "C & C++", proficiency: 90, level: "Advanced", sort_order: 3 },
      { id: 4, category: "Frontend", name: "Svelte / SvelteKit", proficiency: 94, level: "Expert", sort_order: 4 },
      { id: 5, category: "Frontend", name: "React.js", proficiency: 92, level: "Expert", sort_order: 5 },
      { id: 6, category: "Backend", name: "FastAPI & Async Python", proficiency: 96, level: "Expert", sort_order: 6 },
      { id: 7, category: "DevOps & Cloud", name: "PyTorch & Deep Learning", proficiency: 94, level: "Expert", sort_order: 7 },
      { id: 8, category: "DevOps & Cloud", name: "Qualcomm AIMET & Quantization", proficiency: 92, level: "Expert", sort_order: 8 }
    ],
    experiences: [
      {
        id: 1,
        role: "Student Research Intern",
        company: "Samsung PRISM",
        location: "Bangalore, Karnataka",
        start_date: "Jan. 2026",
        end_date: "Jun. 2026",
        is_current: true,
        description: "Researching deep learning model compression and hardware-efficient quantization for next-gen edge NPUs.",
        achievements: [
          "Optimized RepViT models for edge NPUs using Qualcomm AIMET quantization.",
          "Mitigated accuracy loss via structural reparameterization and Knowledge Distillation."
        ],
        technologies: ["Qualcomm AIMET", "RepViT", "Knowledge Distillation", "PyTorch"],
        sort_order: 1
      },
      {
        id: 2,
        role: "SDE Intern",
        company: "Spiked.ai",
        location: "Remote, Palo Alto, CA",
        start_date: "June 2025",
        end_date: "Aug. 2025",
        is_current: false,
        description: "Developed responsive React.js interfaces and automated CRM pipelines.",
        achievements: [
          "Developed responsive React.js interfaces and on-page SEO best practices.",
          "Integrated ZOHO-CRM with website forms to automate client data flows."
        ],
        technologies: ["React.js", "JavaScript", "SEO", "ZOHO CRM"],
        sort_order: 2
      }
    ],
    virtual_files: [
      {
        id: 1,
        path: "~/about.md",
        filename: "about.md",
        parent_dir: "~",
        is_directory: false,
        content: "# About Ansh Ravi Kashyap\nCS Student @ R.V. College of Engineering (CGPA: 9.55) | Research Intern @ Samsung PRISM",
        file_type: "markdown",
        permissions: "-rw-r--r--",
        size_bytes: 420
      }
    ]
  };
}
