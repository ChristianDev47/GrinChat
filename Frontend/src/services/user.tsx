import { LoginType, UpdateUserType } from '../types/user';
const API = 'https://grinchat.onrender.com/api';

export async function Login({ login }: { login: LoginType }) {
  try {
    const response = await fetch(`${API}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(login),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Fetching Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function Logout() {
  try {
    await new Promise((resolve) => setTimeout(() => resolve(undefined), 2000));
    const response = await fetch(`${API}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Fetching Error:', error);
    throw new Error('Failed to fetch logout.');
  }
}

export async function fetchCreateAcount({ user }: { user: FormData }) {
  try {
    const response = await fetch(`${API}/users`, {
      method: 'POST',
      body: user,
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Fetching Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function findUser({ id }: { id?: string }) {
  const response = await fetch(`${API}/users/${id}`);
  const data = await response.json();
  return data;
}

export async function updateUser({
  id,
  newData,
}: {
  id?: string;
  newData: UpdateUserType;
}) {
  try {
    const response = await fetch(`${API}/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newData),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Fetching Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function updateUserImageProfile({
  id,
  newData,
}: {
  id?: string;
  newData: FormData;
}) {
  try {
    const response = await fetch(`${API}/users/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      body: newData,
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Fetching Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function getUsers() {
  const response = await fetch(`${API}/users`);
  const data = await response.json();
  return data;
}
