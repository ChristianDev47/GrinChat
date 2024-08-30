import Image from 'next/image';
import styles from '../../../styles/PrincipalPage.module.css';
import { poppinsBold } from '@/src/ui/fonts';

export default function Section2() {

  return (
    <div className={styles.Section2}>
      <h3 className={poppinsBold.className}>
      Cómo <span className={styles.Text}> Funciona</span>
      </h3>
      <div className={styles.Content}>
        <Image className={styles.Image} src='/images/principal/sec1.png' alt='' width={600} height={317}/>
        <div>
        <p><strong>Grinchat</strong> es una plataforma de mensajería instantánea en tiempo real diseñada para mantenerte conectado con amigos, familiares y colegas. Gracias a su <strong>tecnología moderna</strong>, los <strong>mensajes, archivos y llamadas</strong> se transmiten de manera instantánea, sin retrasos.</p>
        <br />
        <p>Para comenzar a utilizar <strong>Grinchat</strong>, primero debes <strong>registrarte</strong> proporcionando algunos datos básicos. Una vez registrado, podrás explorar la <strong>lista de usuarios</strong>, enviar solicitudes de amistad, y empezar a chatear con tus contactos. Además, tendrás la opción de <strong>crear grupos de chat</strong>, <strong>compartir archivos</strong> y <strong>realizar llamadas de audio y video</strong>.</p>

        </div>
      </div>
    </div>
  );
}
