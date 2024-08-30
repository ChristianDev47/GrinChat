'use client';
import styles from '../../../../../styles/Chat.module.css';
import Image from 'next/image';
import { useAuth } from '@/src/hooks/useAuth';
import { GroupContactType } from '@/src/types/chat';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { groupSchema } from '@/src/schemas/validations/chatSchema';
import { socket } from '@/src/config/socket';
import backIcon from '../../../../assets/back.svg';
import usersIcon from '../../../../assets/users.svg';

interface Props {
  setGroupContacts: React.Dispatch<React.SetStateAction<GroupContactType>>;
  setShowNewChat: React.Dispatch<React.SetStateAction<boolean>>;
  groupContacts: GroupContactType;
}
interface UploadResponse {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  error?: string;
}
type Inputs = z.infer<typeof groupSchema>;

export default function GroupData({
  setGroupContacts,
  groupContacts,
  setShowNewChat,
}: Props) {
  const { user } = useAuth();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [nameGroup, setNameGroup] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(groupSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    if (data.image) {
      const fileBuffer = await data.image.arrayBuffer();
      const fileData = new Uint8Array(fileBuffer);
      socket.emit(
        'group_image',
        { fileData, fileName: data.image.name },
        (response: UploadResponse) => {
          if (response.success) {
            socket.emit('create_group', {
              admin: user,
              contacts: groupContacts.contacts,
              name: data.name,
              image: response.fileUrl,
            });
            setGroupContacts({
              show: false,
              contacts: [],
              showDataPage: false,
            });
            setShowNewChat(false);
          }
        }
      );
    }
  };

  const allowedFileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && allowedFileTypes.includes(files[0].type)) {
      const file = files[0];
      setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.PageContentChat}>
      <div className={styles.ContactListNav}>
        <button
          onClick={() =>
            setGroupContacts({ show: true, contacts: [], showDataPage: false })
          }
        >
          <Image src={backIcon} alt="search" width={15} height={15} />
        </button>
        <p>Informacion del grupo</p>
      </div>
      <form onSubmit={handleSubmit(processForm)}>
        <div className={styles.ListContacts}>
          <h3>Agrega una imagen y nombre</h3>
          {groupContacts.contacts.length > 1 && nameGroup.trim() !== '' && (
            <button className={styles.GroupContactContinue}>Crear grupo</button>
          )}
        </div>
        <div className={styles.GroupDataBody}>
          <div className={styles.Images}>
            <input
              type="file"
              id="inputFile"
              onChange={handleProfileImageChange}
            />
            <label htmlFor="inputFile">
              {previewImage ? (
                <Image
                  className={styles.ImageUpload}
                  src={previewImage}
                  alt="preview image"
                  width={100}
                  height={200}
                />
              ) : (
                <Image src={usersIcon} alt="" width={80} height={80} />
              )}
            </label>
            {previewImage && (
              <div
                className={styles.DeleteImage}
                onClick={() => setPreviewImage(null)}
              >
                Quitar imagen
              </div>
            )}
            {errors.image?.message && (
              <p className={styles.Error}>{errors.image?.message}</p>
            )}
          </div>
          <div>
            <input
              id="name"
              autoComplete="new-name"
              placeholder="Nombre del grupo"
              {...register('name')}
              type="text"
              className={styles.inputField}
              onChange={(e) => setNameGroup(e.target.value)}
            />
            {errors.name?.message && (
              <p className={styles.Advert}>{errors.name?.message}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
