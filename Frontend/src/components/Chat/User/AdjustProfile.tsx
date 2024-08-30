'use client';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import { useAuth } from '@/src/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adjustProfileSchema } from '@/src/schemas/validations/chatSchema';
import { updateUser, updateUserImageProfile } from '@/src/services/user';
import userIcon from '../../../assets/user.svg';
import backIcon from '../../../assets/back.svg';
import checkIcon from '../../../assets/check.svg';
import editIcon from '../../../assets/edit.svg';
import cameraIcon from '../../../assets/camera.svg';

// Validations types
type Inputs = {
  name: string;
  surname: string;
  status: string;
};

interface Props {
  setShowAdjustProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdjustProfile({ setShowAdjustProfile }: Props) {
  const { user, addUser } = useAuth();
  const [editName, setEditName] = useState<boolean>(false);
  const [editSurname, setEditSurname] = useState<boolean>(false);
  const [editStatus, setEditStatus] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(adjustProfileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, surname: user.surname, status: user.status });
    }
  }, [user]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (
      user.name !== data.name.trim() ||
      user.surname !== data.surname.trim() ||
      user.status !== data.status.trim()
    ) {
      const newUserData = await updateUser({
        id: user._id,
        newData: {
          name: data.name,
          surname: data.surname,
          status: data.status,
        },
      });
      addUser(newUserData);
    }
  };

  const allowedFileTypes = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && allowedFileTypes.includes(files[0].type)) {
      const file = files[0];
      const formData = new FormData();
      formData.append('profile', file, file.name);
      const updateData = async () => {
        const newUserData = await updateUserImageProfile({
          id: user._id,
          newData: formData,
        });
        addUser(newUserData);
      };
      updateData();
    }
  };

  return (
    <>
      <div className={styles.PageContentChat}>
        <div className={styles.ContactListNav}>
          <button onClick={() => setShowAdjustProfile(false)}>
            <Image src={backIcon} alt="search" width={15} height={15} />
          </button>
          <p>Ajustes</p>
        </div>
        <div className={styles.AdjustPage}>
          <div className={styles.Profile}>
            <div className={styles.Image}>
              <input
                type="file"
                id="inputFiles"
                onChange={handleProfileImageChange}
              />
              <label htmlFor="inputFiles">
                {user && user.profilePicture ? (
                  <Image
                    className={styles.Image}
                    src={user.profilePicture}
                    alt="user"
                    width={500}
                    height={500}
                    priority
                  />
                ) : (
                  <Image src={userIcon} alt="user" width={230} height={230} />
                )}
                <div className={styles.ImageOverlay}>
                  <Image src={cameraIcon} alt="camera" width={50} height={50} />
                </div>
              </label>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name">Nombre</label>
              <div className={styles.EditInput}>
                {editName ? (
                  <>
                    <input
                      type="text"
                      placeholder="Buscar"
                      {...register('name')}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!errors.name?.message) setEditName(false);
                        handleSubmit(onSubmit)();
                      }}
                    >
                      <Image
                        src={checkIcon}
                        alt="user"
                        width={25}
                        height={25}
                      />
                    </button>
                  </>
                ) : (
                  <>
                    <p>{user.name}</p>
                    <button type="button" onClick={() => setEditName(true)}>
                      <Image src={editIcon} alt="user" width={25} height={25} />
                    </button>
                  </>
                )}
              </div>
              {errors.name?.message && (
                <p className={styles.ErrorInput}>{errors.name?.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="surname">Apellido</label>
              <div className={styles.EditInput}>
                {editSurname ? (
                  <>
                    <input
                      type="text"
                      placeholder="Buscar"
                      {...register('surname')}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!errors.surname?.message) setEditSurname(false);
                        handleSubmit(onSubmit)();
                      }}
                    >
                      <Image
                        src={checkIcon}
                        alt="user"
                        width={25}
                        height={25}
                      />
                    </button>
                  </>
                ) : (
                  <>
                    <p>{user.surname}</p>
                    <button type="button" onClick={() => setEditSurname(true)}>
                      <Image src={editIcon} alt="user" width={25} height={25} />
                    </button>
                  </>
                )}
              </div>
              {errors.surname?.message && (
                <p className={styles.ErrorInput}>{errors.surname?.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="status">Estado</label>
              <div className={styles.EditInput}>
                {editStatus ? (
                  <>
                    <input
                      type="text"
                      placeholder="Buscar"
                      {...register('status')}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!errors.status?.message) setEditStatus(false);
                        handleSubmit(onSubmit)();
                      }}
                    >
                      <Image
                        src={checkIcon}
                        alt="user"
                        width={25}
                        height={25}
                      />
                    </button>
                  </>
                ) : (
                  <>
                    <p>{user.status}</p>
                    <button type="button" onClick={() => setEditStatus(true)}>
                      <Image src={editIcon} alt="user" width={25} height={25} />
                    </button>
                  </>
                )}
              </div>
              {errors.status?.message && (
                <p className={styles.ErrorInput}>{errors.status?.message}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
