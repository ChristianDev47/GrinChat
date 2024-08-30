import styles from '../../../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.Footer}>
      <div className={styles.Content}>
        <div className={styles.Start}>
          <h1>GrinChat</h1>
          <p>
            Unete a GrindChat y empieza a comunicarte con tus amigos y conocidos
            creando chats y grupos donde podras crear llamadas, envia audios,
            archivos y documentos. Todo con la mejor seguridad posible.
          </p>
        </div>
        <div className={styles.Section}>
          <h3>Nuestros Servicios</h3>
          <ul>
            <li>Mensajería Instantánea</li>
            <li>Llamadas de Voz y Video</li>
            <li>Chats Grupales</li>
            <li>Seguridad y Privacidad</li>
            <li>Compartir Multimedia</li>
          </ul>
        </div>
        <div className={styles.Section}>
          <h3>Contáctenos</h3>
          <ul>
            <li>
              <div>
                <p>Calle Adam A108</p>
                <p>Nueva York, NY 535022</p>
                <p>Estados Unidos</p>
              </div>
            </li>
            <li>
              <div>
                <p>Teléfono: +1 5589 55488 55</p>
                <p>Correo electrónico: info@example.com</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
