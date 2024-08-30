const API = 'https://grinchat.onrender.com/api';

export async function getChats({ idUser }: { idUser: string }) {
  const response = await fetch(`${API}/chats/participant/${idUser}`);
  const data = await response.json();
  return data;
}

export async function getGroups({ idUser }: { idUser: string }) {
  const response = await fetch(`${API}/groupChats/participant/${idUser}`);
  const data = await response.json();
  return data;
}

export async function deleteChat({ id }: { id: string }) {
  try {
    const response = await fetch(`${API}/chats/user/${id}`, {
      method: 'DELETE',
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

export async function getMessagesByChat({ chatId }: { chatId: string }) {
  const response = await fetch(`${API}/messages/chat/${chatId}`);
  const data = await response.json();
  return data;
}

export async function getCalls({ idUser }: { idUser: string }) {
  const response = await fetch(`${API}/calls/participant/${idUser}`);
  const data = await response.json();
  return data;
}
