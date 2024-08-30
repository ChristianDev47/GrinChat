import FormLogin from '@/src/components/User/Login';
import Link from 'next/link';
import styles from '../../../styles/Login.module.css';

export default function Login() {
  return (
    <div className={styles.Login}>
      <div className={styles.Content}>
        <h1>Inicia sesión en GrinChat</h1>
        <p>
          Por favor, ingrese todos sus datos para iniciar sesión en nuestra web.
        </p>
        <FormLogin />
        <Link href="/register">
          <div>Es mi primera vez y quiero unirme</div>
        </Link>
      </div>
    </div>
  );
}
