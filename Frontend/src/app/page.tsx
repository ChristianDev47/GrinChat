import Navbar from '@/src/components/Header/Navbar';
import styles from '../../styles/PrincipalPage.module.css';
import Image from 'next/image';
import Footer from '@/src/components/Footer/Footer';
import { poppinsBold } from '../ui/fonts';
import { User1, User2, User3 } from '../ui/users';
import arrow from '../assets/arrow.svg';
import Section1 from '../components/Principal/Section1';
import Section2 from '../components/Principal/Section2';
import Section3 from '../components/Principal/Section3';
import Section4 from '../components/Principal/Section4';

export default function Home() {
  const circles = [
    styles.Circle,
    styles.Circle1,
    styles.Circle2,
    styles.Circle5,
    styles.Circle7,
    styles.Circle8,
  ];
  const arrows = [styles.Arrow, styles.Arrow1, styles.Arrow2];

  return (
    <main>
      <Navbar />
      <div className={styles.Main}>
        {/* SLIDER SECTION */}
        <div className={styles.Slider}>
          <h3 className={poppinsBold.className}>
            Comunicate <span className={styles.Text}>Sin Límites</span>
          </h3>
          <p className={styles.Subtitle}>
            Chatea y conecta con tus amigos y contactos de manera instantánea.
            Nuestra plataforma te permite enviar mensajes, intercambiar
            archivos, realizar llamadas y mantener conversaciones privadas con
            facilidad.
          </p>

          {/* Renderizar círculos dinámicamente */}
          {circles.map((circleClass, index) => (
            <div key={index} className={circleClass}></div>
          ))}

          <Image
            className={styles.P1}
            src="/images/principal/conP.png"
            alt="Imagen principal"
            priority
            width={300}
            height={300}
          />

          {/* Renderizar flechas dinámicamente */}
          {arrows.map((arrowClass, index) => (
            <div key={index} className={arrowClass}>
              <Image src={arrow} alt="Flecha" width={70} height={70} />
            </div>
          ))}

          {/* Usuarios */}
          <User1 />
          <User2 />
          <User3 />

          <Image
            src="/images/p1.png"
            alt="slider"
            width={5000}
            height={5000}
            style={{ width: '500px', height: 'auto', zIndex: 50 }}
            priority
          />
        </div>
        <div className={styles.Sections}>
          <Section1/>
          <Section2/>
          <Section3/>
          <Section4/>
        </div>
      </div>
      <Footer />
    </main>
  );
}
