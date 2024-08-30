import Image from 'next/image';
import styles from '../../../styles/PrincipalPage.module.css';
import messageIcon from '../../assets/messages.svg';
import filesIcon from '../../assets/files.svg';
import callIcon from '../../assets/calls.svg';
import usersIcon from '../../assets/managmentusers.svg';
import groupsIcon from '../../assets/groups.svg';
import userEditIcon from '../../assets/userEdit.svg';
import { poppinsBold } from '@/src/ui/fonts';


const features = [
  {
    title: 'Mensajería Instantánea',
    subtitle: 'Chatea en tiempo real con tus amigos y contactos. Envía mensajes de texto, multimedia y archivos adjuntos sin demora.',
    icon: messageIcon
  },
  {
    title: 'Gestión de Archivos',
    subtitle: 'Envía, recibe y organiza archivos de forma eficiente. Comparte documentos, imágenes, videos y otros archivos con facilidad.',
    icon: filesIcon
  },
  {
    title: 'Llamadas de Voz y Video',
    subtitle: 'Realiza llamadas de voz y video de alta calidad con tus contactos. Disfruta de comunicación clara y sin interrupciones.',
    icon: callIcon
  },
  {
    title: 'Agregar y Gestionar Usuarios',
    subtitle: 'Añade nuevos usuarios y administra tus contactos con facilidad. Envía y acepta solicitudes de amistad de forma eficiente',
    icon: usersIcon
  },
  {
    title: 'Creación de Grupos',
    subtitle: 'Crea grupos para reunir a tus contactos. Invita a usuarios y comparte mensajes y archivos dentro de cada uno de tus grupos.',
    icon: groupsIcon
  },
  {
    title: 'Mejora tu peril',
    subtitle: 'Actuliza tus datos, estado y mejora tu imagen agregando una nueva foto de perfil cada vez que lo quieras.',
    icon: userEditIcon
  }
];


export default function Section1() {

  return (
    <div className={styles.Section1}>
      <h3 className={poppinsBold.className}>
      Características
      </h3>
      <p>Descubre cada una de las caracteristicas que ofrece GrinChat</p>
        <div className={styles.Content}>
          {
            features.map((feature, index) => {
              return (
                <div key={index} className={styles.Item}>
                  <Image src={feature.icon} alt='icon' width={50} height={50}/>
                  <div>
                    <h2 className={poppinsBold.className}>{feature.title}</h2>
                    <p>{feature.subtitle}</p>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
  );
}
