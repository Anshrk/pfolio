import { writable } from 'svelte/store';
import { getAdminMe, loginAdmin } from '../utils/api';

export const isAuthenticated = writable<boolean>(false);
export const adminUsername = writable<string>('');
export const isAuthModalOpen = writable<boolean>(false);
export const isAdminStudioOpen = writable<boolean>(false);

export async function checkAuth() {
  const admin = await getAdminMe();
  if (admin && admin.is_authenticated) {
    isAuthenticated.set(true);
    adminUsername.set(admin.username);
  } else {
    isAuthenticated.set(false);
    adminUsername.set('');
  }
}

export async function login(user: string, pass: string): Promise<boolean> {
  try {
    const res = await loginAdmin(user, pass);
    isAuthenticated.set(true);
    adminUsername.set(res.username);
    return true;
  } catch (err) {
    isAuthenticated.set(false);
    throw err;
  }
}

export function logout() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('pfolio_token');
  }
  isAuthenticated.set(false);
  adminUsername.set('');
  isAdminStudioOpen.set(false);
}
