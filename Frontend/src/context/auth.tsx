'use client';
import Cookies from 'js-cookie';
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User } from '../types/user';
import { findUser, getUsers } from '../services/user';

const InitialData: User = {
  _id: '',
  email: '',
  name: '',
  surname: '',
  createdAt: '',
  updatedAt: '',
  password: '',
  access_token: '',
  status: '',
  profilePicture: null,
  contacts: [],
  friendRequests: [],
  groups: [],
};

// Context
export const AuthContext = createContext<{
  user: User;
  users: User[] | [];
  addUser: (newUser: User) => void;
  logout: () => void;
  login: (authTokens: string) => void;
  updateUsers: () => void;
}>({
  user: InitialData,
  users: [],
  addUser: () => {},
  logout: () => {},
  login: () => {},
  updateUsers: () => {},
});

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(InitialData);
  const [users, setUsers] = useState<User[] | []>([]);

  const login = useCallback((authTokens: string) => {
    Cookies.set('sesion_security_token', JSON.stringify(authTokens));
  }, []);

  const logout = useCallback(() => {
    setUser(InitialData);
    Cookies.remove('sesion_security_token');
    Cookies.remove('sesion');
  }, []);

  const addUser = useCallback((newUser: User) => {
    const getDataUser = async () => {
      const newData = await findUser({ id: newUser._id });
      setUser(newData);
    };
    if (newUser._id) {
      getDataUser();
    }
  }, []);

  useEffect(() => {
    const getAllUsers = async () => {
      const newUsers = await getUsers();
      setUsers(newUsers);
    };
    getAllUsers();
    const storedUser = Cookies.get('sesion');
    if (storedUser && storedUser !== 'undefined') {
      try {
        const getUserData = async () => {
          const newData = await findUser({ id: storedUser.toString() });
          setUser(newData[0] ?? newData);
        };
        getUserData();
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (user && user.password !== '') {
      Cookies.set('sesion', user._id, { expires: 7 });
    }
  }, [user]);

  const updateUsers = useCallback(() => {
    const getAllUsers = async () => {
      const newUsers = await getUsers();
      setUsers(newUsers);
    };
    getAllUsers();
  }, []);

  const value = useMemo(
    () => ({
      user,
      users,
      addUser,
      logout,
      updateUsers,
      login,
    }),
    [user, users, addUser, logout, updateUsers, login]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
