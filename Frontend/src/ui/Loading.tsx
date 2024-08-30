'use client';

import Image from 'next/image';
import { useState, useEffect, type PropsWithChildren } from 'react';
import styles from '../../styles/Loading.module.css';

export default function Loading({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 8000);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 80);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return loading ? (
    <div className={styles.loadingContainer}>
      <LoadComponent fileName="/icon.svg" />
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  ) : (
    children
  );
}

function LoadComponent({ fileName }: { fileName: string }) {
  return (
    <Image
      src={fileName}
      width={100}
      height={100}
      alt="Loading icon"
      priority
    />
  );
}
