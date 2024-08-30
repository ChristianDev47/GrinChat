'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../../../styles/Navbar.module.css';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/useAuth';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const [header, setHeader] = useState<boolean>(false);
  const scrollHeader = () => {
    window.scrollY >= 80 ? setHeader(true) : setHeader(false);
  };
  useEffect(() => {
    window.addEventListener('scroll', scrollHeader);
  }, []);

  return (
    <nav
      className={`${
        header || pathname !== '/' ? styles.bgSecond : styles.bgTransparent
      } ${styles.Navbar} `}
    >
      <div className={styles.Content}>
        <h3>GrinChat</h3>
        <div className={styles.buttons}>
          {user.email && user.email !== '' ? (
            <Link href="/chat">
              <button>Mi chat</button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <button>Iniciar Sesión</button>
              </Link>
              <Link href="/register">
                <button>Empezar</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
