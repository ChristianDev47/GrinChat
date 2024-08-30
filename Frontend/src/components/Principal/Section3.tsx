'use client';

import 'swiper/css';
import 'swiper/css/effect-creative';
import styles from '../../../styles/PrincipalPage.module.css';
import { poppinsBold } from '@/src/ui/fonts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Autoplay, Navigation } from 'swiper/modules';
import Image from 'next/image';

const steps = [
  {
    title: 'Registrate',
    images: [
      { src: '/images/principal/section/sec1.png', width: 1000, height: 1000, alt: 'register' },
      { src: '/images/principal/section/sec2.png', width: 1000, height: 1000, alt: 'register' }
    ]
  },
  {
    title: 'Busca Amigos',
    images: [
      { src: '/images/principal/section/sec3.png', width: 1000, height: 1000, alt: 'search friends' },
      { src: '/images/principal/section/sec4.png', width: 1000, height: 1000, alt: 'search friends' }
    ]
  },
  {
    title: 'Envia Solicitudes',
    images: [
      { src: '/images/principal/section/sec5.png', width: 1000, height: 1000, alt: 'send requests' },
      { src: '/images/principal/section/sec9.png', width: 1000, height: 1000, alt: 'send requests' }
    ]
  },
  {
    title: 'Inicia una Conversación',
    images: [
      { src: '/images/principal/section/sec6.png', width: 1000, height: 1000, alt: 'start conversation' },
      { src: '/images/principal/section/sec7.png', width: 1000, height: 1000, alt: 'start conversation' }
    ]
  },
  {
    title: 'Envia Mensajes',
    images: [
      { src: '/images/principal/section/sec8.png', width: 820, height: 820, alt: 'send messages' }
    ]
  },
  {
    title: 'Gestiona cada Chat',
    images: [
      { src: '/images/principal/section/sec16.png', width: 840, height: 840, alt: 'manage chats' }
    ]
  },
  {
    title: 'Realiza Llamadas',
    images: [
      { src: '/images/principal/section/sec10.png', width: 390, height: 390, alt: 'make calls' },
      { src: '/images/principal/section/sec10.png', width: 390, height: 390, alt: 'make calls' }
    ]
  },
  {
    title: 'Crea Grupos',
    images: [
      { src: '/images/principal/section/sec13.png', width: 820, height: 820, alt: 'create groups' }
    ]
  },
  {
    title: 'Gestiona los Participantes',
    images: [
      { src: '/images/principal/section/sec20.png', width: 640, height: 640, alt: 'manage participants' },
      { src: '/images/principal/section/sec21.png', width: 280, height: 280, alt: 'manage participants' }
    ]
  },
  {
    title: 'Personaliza tu Imagen',
    images: [
      { src: '/images/principal/section/sec17.png', width: 420, height: 300, alt: 'customize image' },
      { src: '/images/principal/section/sec18.png', width: 401, height: 401, alt: 'customize image' }
    ]
  }
];

export default function Section3() {
  return (
    <div className={styles.Section3}>
      <h3 className={poppinsBold.className}>
        Pasos para comenzar <span className={styles.Text}>en Grinchat</span>
      </h3>
      <div className={styles.Content}>
        <Swiper
          grabCursor={true}
          effect={'creative'}
          creativeEffect={{
            prev: {
              shadow: true,
              translate: [0, 0, -400],
            },
            next: {
              translate: ['100%', 0, 0],
            },
          }}
          modules={[EffectCreative, Autoplay, Navigation]}
          className="mySwiper"
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
        >
          {steps.map((step, index) => (
            <SwiperSlide key={index}>
              <div className={styles.ContentSwipper}>
                <h2 className={poppinsBold.className}>{step.title}</h2>
                <div>
                  {step.images.map((img, idx) => (
                    <Image key={idx} src={img.src} className={`${step.images.length > 1 && styles.Image}`} alt={img.alt} width={img.width} height={img.height} />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
