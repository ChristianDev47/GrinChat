import Image from 'next/image';
import { Message } from '@/src/types/chat';
import { downloadFile } from '@/src/utilities/downloadFile';
import styles from '../../../../styles/Chat.module.css';
import { MessageFileType } from '@/src/types/message';
import docxIcon from '../../../assets/docx.svg';
import downloadIcon from '../../../assets/download.svg';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface Props {
  data: Message;
  setMessageFiles: React.Dispatch<React.SetStateAction<MessageFileType>>;
}

export default function MessageFile({ data, setMessageFiles }: Props) {
  return (
    <>
      {data.fileUrl && (
        <>
          {data.messageType?.startsWith('Image') ? (
            <Image
              onClick={() =>
                setMessageFiles((prevState) => ({
                  ...prevState,
                  messageSelected: data._id,
                  show: true,
                }))
              }
              className={styles.ImageMessageItem}
              src={data.fileUrl}
              alt=""
              width={400}
              height={400}
              style={{ width: '100%', height: '100%'}}
            />
          ) : data.messageType?.startsWith('Video') ? (
            <video
              onClick={() =>
                setMessageFiles((prevState) => ({
                  ...prevState,
                  messageSelected: data._id,
                  show: true,
                }))
              }
              src={data.fileUrl}
              muted
              className={styles.Image}
              autoPlay={false}
              style={{ width: 'auto', height: '200px', objectFit: 'cover' }}
            />
          ) : data.messageType?.startsWith('Document') ? (
            <div className={styles.FileDocument}>
              <div className={styles.Content}>
                <Image src={docxIcon} alt="user" width={25} height={25} />
                <div>
                  <p>{data.fileName}</p>
                  <p>{data.fileName.split('.').pop()}</p>
                </div>
              </div>
              <button onClick={() => downloadFile(data.fileUrl, data.fileName)}>
                <Image src={downloadIcon} alt="user" width={35} height={35} />
              </button>
            </div>
          ) : (
            data.messageType?.startsWith('Audio') && (
              <div className={styles.Audio}>
                <AudioPlayer
                  style={{ borderRadius: '1rem' }}
                  src={data.fileUrl}
                  preload="auto"
                />
              </div>
            )
          )}
        </>
      )}
    </>
  );
}
