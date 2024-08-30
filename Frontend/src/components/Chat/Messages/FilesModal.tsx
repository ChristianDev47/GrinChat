'use client';
import Image from 'next/image';
import styles from '../../../../styles/Chat.module.css';
import { SendFileType } from '@/src/types/message';
import documentIcon from '../../../assets/document.svg';
import photoVideoIcon from '../../../assets/photo_video.svg';

interface Props {
  setImageSrc: React.Dispatch<React.SetStateAction<SendFileType[]>>;
  closeModal: () => void
}

const allowedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'video/mp4',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
  'application/vnd.ms-excel', 
  'application/pdf',
  'application/xml',
  'text/plain',
  'application/zip',
  'application/x-rar-compressed',
];

export default function FilesModal({ setImageSrc, closeModal }: Props) {
  const handleSavefile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file && allowedFileTypes.includes(file.type)) {
        const imageUrl = URL.createObjectURL(file);
        setImageSrc((prevState) => [
          ...prevState,
          { data: file, content: null, file: imageUrl },
        ]);
        closeModal();
      } else {
        console.error(
          'Invalid file type. Please select a valid file type: JPG, PNG, WEBP, PDF, XLSX, TXT, DOCX, XLSX, or PPTX.'
        );
      }
    }
  };

  return (
    <div className={styles.ShowModalFiles}>
      <ul className={styles.FilesModal}>
        <li>
          <label
            htmlFor="docFile"
            className="menu-item"
            role="button"
            aria-label="Destacar"
          >
            <Image src={documentIcon} alt="emoticon" width={25} height={25} />
            <p>Documentos</p>
          </label>
          <input
            type="file"
            id="docFile"
            className="hidden"
            accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf, application/xml, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, 
            application/vnd.ms-excel, text/plain, application/zip, application/x-rar-compressed"
            onChange={(e) => handleSavefile(e)}
            multiple
          />
        </li>
        <li>
          <label
            htmlFor="file"
            className="menu-item"
            role="button"
            aria-label="Destacar"
          >
            <Image src={photoVideoIcon} alt="emoticon" width={25} height={25} />
            <p>Fotos y videos</p>
          </label>
          <input
            type="file"
            id="file"
            className="hidden"
            accept="image/jpeg, image/png, image/webp, image/jpg, video/mp4"
            onChange={(e) => {
              handleSavefile(e);
            }}
            multiple
          />
        </li>
      </ul>
    </div>
    
  );
}
