import Image from 'next/image';
import styles from '../../styles/PrincipalPage.module.css';

export const User1 = () => {
  return (
    <div className={`${styles.User} ${styles.User1}`}>
      <div className={styles.Image}>
      <Image src='/images/principal/user.png' alt='user1'  width={100} height={100} style={{ width: 'auto', height: '100%', objectFit: 'cover' }}/>
      </div>
      <div>
        <h3>Mario Antonio</h3>
        <p>Mensajería instantánea, envío de archivos y llamadas de audio, todo en una sola plataforma.</p>
      </div>
    </div>
  );
};
export const User2 = () => {
  return (
    <div className={`${styles.User} ${styles.User2}`}>
      <div className={styles.Image}>
      <Image src='/images/principal/user2.png' alt='user2' width={100} height={100} style={{ width: 'auto', height: '100%', objectFit: 'cover' }}/>
      </div>
      <div>
        <h3>Aitana Rodriguez</h3>
        <p>Ajusta configuraciones a tu gusto y comparte archivos de cualquier tipo de manera rápida y segura.</p>
      </div>
    </div>
  );
};
export const User3 = () => {
  return (
    <div className={`${styles.User} ${styles.User3}`}>
      <div className={styles.Image}>
      <Image src='/images/principal/user3.png' alt='user3'  width={100} height={100} style={{ width: 'auto', height: '100%', objectFit: 'cover' }}/>
      </div>
      <div>
        <h3>Carolina Marin</h3>
        <p>Perfecto para conversaciones personales o grupales, ya sea con amigos o equipos de trabajo.</p>
      </div>
    </div>
  );
};