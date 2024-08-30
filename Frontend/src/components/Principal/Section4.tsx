import styles from '../../../styles/PrincipalPage.module.css';
import { poppinsBold } from '@/src/ui/fonts';
import Link from 'next/link';

export default function Section4() {

  return (
    <div className={styles.Section4 }>
        <h3 className={poppinsBold.className}>
          Comienza a usar <span className={styles.Text}>GrinChat</span>
        </h3>
       <div className={styles.Content}>
        <div>
          <p>Grinchat es más que una simple plataforma de mensajería. Ofrecemos una experiencia de comunicación completa y sin complicaciones, diseñada para hacerte sentir más cerca de las personas importantes en tu vida. Con mensajes en tiempo real, llamadas de audio y video de alta calidad, y la posibilidad de compartir archivos al instante, estarás siempre conectado, sin importar la distancia.  <strong className={styles.Text}> ¡Comienza a usar Grinchat hoy mismo y experimenta una forma moderna de estar en contacto!</strong></p>
        </div>

        <Link  className={styles.Link} href="/register">Empieza Registrandote</Link>
       </div>
    </div>
  );
}
