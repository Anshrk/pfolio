import { writable, get } from 'svelte/store';
import type { PortfolioPayload, Project, Skill, Experience, VirtualFile, Profile } from '../types';
import { fetchPortfolio } from '../utils/api';

export const portfolioData = writable<PortfolioPayload | null>(null);
export const isLoadingPortfolio = writable<boolean>(true);
export const selectedProject = writable<Project | null>(null);
export const isProjectModalOpen = writable<boolean>(false);
export const isFinderOpen = writable<boolean>(false);

export async function loadPortfolio() {
  isLoadingPortfolio.set(true);
  try {
    const data = await fetchPortfolio();
    portfolioData.set(data);
  } catch (err) {
    console.error('Failed to load portfolio data:', err);
  } finally {
    isLoadingPortfolio.set(false);
  }
}

export function openProjectModal(project: Project) {
  selectedProject.set(project);
  isProjectModalOpen.set(true);
}

export function closeProjectModal() {
  isProjectModalOpen.set(false);
  selectedProject.set(null);
}

export function updateLocalProfile(profile: Profile) {
  portfolioData.update(data => {
    if (!data) return data;
    return { ...data, profile };
  });
}

export function updateLocalProject(project: Project) {
  portfolioData.update(data => {
    if (!data) return data;
    const idx = data.projects.findIndex(p => p.id === project.id);
    const projects = [...data.projects];
    if (idx >= 0) {
      projects[idx] = project;
    } else {
      projects.push(project);
    }
    return { ...data, projects };
  });
}

export function removeLocalProject(id: number) {
  portfolioData.update(data => {
    if (!data) return data;
    return {
      ...data,
      projects: data.projects.filter(p => p.id !== id)
    };
  });
}

export function updateLocalFile(file: VirtualFile) {
  portfolioData.update(data => {
    if (!data) return data;
    const idx = data.virtual_files.findIndex(f => f.path === file.path);
    const files = [...data.virtual_files];
    if (idx >= 0) {
      files[idx] = file;
    } else {
      files.push(file);
    }
    return { ...data, virtual_files: files };
  });
}
