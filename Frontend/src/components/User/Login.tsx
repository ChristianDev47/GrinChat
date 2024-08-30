'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/src/schemas/validations/loginSchema';
import { useAuth } from '@/src/hooks/useAuth';
import { Login } from '@/src/services/user';
import toast from 'react-hot-toast';
import styles from '../../../styles/Login.module.css';

// Validations types
type Inputs = {
  email: string;
  password: string;
};

export default function FormLogin() {
  const router = useRouter();

  // Validaciones
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
  });
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);

  const [inputEmailValue, setInputEmailValue] = useState<string>('');
  const [inputPasswordValue, setInputPasswordValue] = useState<string>('');

  const handleInputEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmailValue(event.target.value);
  };
  const handleInputPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPasswordValue(event.target.value);
  };

  // Login
  const { addUser, login } = useAuth();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const userLogin = async () => {
      const user = await Login({ login: data });
      if (user === undefined) {
        toast.error('Email o contraseña incorrectos..', {
          duration: 5000,
        });
      } else {
        addUser(user);
        login(user.access_token);
        toast.success('Sesión iniciada. Bienvenido/a', {
          duration: 4000,
          style: {
            background: '#7DA640',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#000',
          },
        });
        router.push('/chat');
      }
    };
    userLogin();
  };

  return (
    <form className={styles.FormLogin} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label
          htmlFor="email"
          className={` ${styles.InputLabel} ${
            emailFocused || inputEmailValue !== ''
              ? styles.deactived
              : styles.actived
          }`}
        >
          Correo electrónico
        </label>
        <input
          id="email"
          autoComplete="new-email"
          {...register('email', { onChange: handleInputEmail })}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          type="text"
          className={`${styles.inputField} ${
            emailFocused || inputEmailValue !== ''
              ? styles.inputFieldFocused
              : ''
          } ${styles.placeholderShown} ${
            emailFocused ? styles.inputFieldFocusedState : ''
          }`}
        />
      </div>
      {errors.email?.message && (
        <p className="text-sm text-[#ff2d2d]">{errors.email?.message}</p>
      )}
      <div>
        <label
          htmlFor="password"
          className={` ${styles.InputLabel} ${
            passwordFocused || inputPasswordValue !== ''
              ? styles.deactived
              : styles.actived
          }`}
        >
          Contraseña
        </label>
        <input
          id="password"
          autoComplete="new-password"
          {...register('password', { onChange: handleInputPassword })}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          type="password"
          className={`${styles.inputField} ${
            passwordFocused || inputPasswordValue !== ''
              ? styles.inputFieldFocused
              : ''
          } ${styles.placeholderShown} ${
            passwordFocused ? styles.inputFieldFocusedState : ''
          }`}
        />
      </div>
      <button
        className={` ${
          inputEmailValue.trim() !== '' && inputPasswordValue.trim() !== ''
            ? styles.buttonAllow
            : styles.buttonDisabled
        }`}
        disabled={
          inputEmailValue !== '' && inputPasswordValue !== '' ? false : true
        }
      >
        Iniciar Sesion
      </button>
    </form>
  );
}
