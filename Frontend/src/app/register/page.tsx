'use client';
import styles from '../../../styles/Register.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/src/hooks/useAuth';
import { fetchCreateAcount } from '@/src/services/user';
import toast from 'react-hot-toast';
import { userSchema } from '@/src/schemas/validations/userSchema';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { socket } from '@/src/config/socket';
import camera from '../../assets/camera.svg';
import prevIcon from '../../assets/prev.svg';
import nextIcon from '../../assets/next.svg';

// Validations types
type Inputs = z.infer<typeof userSchema>;

const steps = [
  {
    id: '1',
    fields: ['name', 'surname', 'email', 'password'],
  },
  {
    id: '2',
    fields: ['profile', 'status'],
  },
  { id: '3', name: 'Complete' },
];

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const delta = currentStep - previousStep;

  const router = useRouter();
  // Validaciones
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    setValue('profile', null);
  }, [setValue]);

  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [nameFocused, setNameFocused] = useState<boolean>(false);
  const [surnameFocused, setSurnameFocused] = useState<boolean>(false);
  const [statusFocused, setStatusFocused] = useState<boolean>(false);

  const [inputEmailValue, setInputEmailValue] = useState<string>('');
  const [inputPasswordValue, setInputPasswordValue] = useState<string>('');
  const [inputNameValue, setInputNameValue] = useState<string>('');
  const [inputSurnameValue, setInputSurnameValue] = useState<string>('');
  const [inputStatusValue, setInputStatusValue] = useState<string>('');

  const handleInputEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmailValue(event.target.value);
  };
  const handleInputPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPasswordValue(event.target.value);
  };
  const handleInputName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputNameValue(event.target.value);
  };
  const handleInputSurname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSurnameValue(event.target.value);
  };
  const handleInputStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputStatusValue(event.target.value);
  };

  // Register
  const { addUser, login } = useAuth();

  const processForm: SubmitHandler<Inputs> = (data) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('name', data.name);
    formData.append('surname', data.surname);
    formData.append('password', data.password);
    formData.append('status', data.status);

    if (data.profile !== null && data.profile instanceof File) {
      formData.append('profile', data.profile, data.profile.name);
    }

    const userLogin = async () => {
      const user = await fetchCreateAcount({ user: formData });
      if (user === undefined) {
        toast.error('El email ya esta asociado a otra cuenta.', {
          duration: 4000,
        });
      } else {
        addUser(user);
        login(user.access_token);
        socket.emit('connected', {
          origin: user._id,
        });
        toast.success('Usuario creado exitosamente. Bienvenido/a', {
          duration: 4000,
          style: {
            background: '#7DA640',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#000',
          },
        });
        router.push('/chat');
      }
    };
    userLogin();
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = steps[currentStep - 1].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });
    if (!output) return;
    if (currentStep <= steps.length - 1) {
      if (currentStep === 2) {
        await handleSubmit(processForm)();
      }
      if (currentStep < steps.length - 1) {
        setPreviousStep(currentStep);
        setCurrentStep((step) => step + 1);
      } else {
        // router.push('/chat');
      }
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpng'];

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && allowedFileTypes.includes(files[0].type)) {
      const file = files[0];
      setValue('profile', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.Register}>
      <form
        className={styles.FormRegister}
        onSubmit={handleSubmit(processForm)}
      >
        {currentStep === 0 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <h1>Bienvenido a GrinChat</h1>
            <p>
            ¡Únete a nuestra comunidad! Regístrate ahora para conectarte con amigos, compartir momentos y disfrutar de conversaciones seguras y rápidas. ¡Es gratis y toma solo unos segundos!
            </p>
            <Image
              src="/images/principal/why1.png"
              alt="slider"
              width={500}
              height={300}
              priority
            />
            <div
              onClick={() => {
                setPreviousStep(currentStep);
                setCurrentStep((step) => step + 1);
              }}
              className={styles.Button}
            >
              Aceptar y continuar
            </div>
          </motion.div>
        )}
        {currentStep === 1 && (
          <motion.div
            className={styles.ContentForm}
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div>
              <h1>Completa tus datos</h1>
              <p>Por favor, completa todos tus datos para continuar.</p>
            </div>
            <div className={styles.InputCamp}>
              <label
                htmlFor="name"
                className={` ${styles.InputLabel} ${
                  nameFocused || inputNameValue !== ''
                    ? styles.deactived
                    : styles.actived
                }`}
              >
                Nombre
              </label>
              <input
                id="name"
                autoComplete="new-name"
                {...register('name', { onChange: handleInputName })}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                type="text"
                className={`${styles.inputField} ${
                  nameFocused || inputNameValue !== ''
                    ? styles.inputFieldFocused
                    : ''
                } ${styles.placeholderShown} ${
                  nameFocused ? styles.inputFieldFocusedState : ''
                }`}
              />
              {errors.name?.message && (
                <p className={styles.Error}>{errors.name?.message}</p>
              )}
            </div>
            
            <div className={styles.InputCamp}>
              <label
                htmlFor="surname"
                className={` ${styles.InputLabel} ${
                  surnameFocused || inputSurnameValue !== ''
                    ? styles.deactived
                    : styles.actived
                }`}
              >
                Apellido
              </label>
              <input
                id="surname"
                autoComplete="new-surname"
                {...register('surname', { onChange: handleInputSurname })}
                onFocus={() => setSurnameFocused(true)}
                onBlur={() => setSurnameFocused(false)}
                type="text"
                className={`${styles.inputField} ${
                  surnameFocused || inputSurnameValue !== ''
                    ? styles.inputFieldFocused
                    : ''
                } ${styles.placeholderShown} ${
                  surnameFocused ? styles.inputFieldFocusedState : ''
                }`}
              />
              {errors.surname?.message && (
                <p className={styles.Error}>{errors.surname?.message}</p>
              )}
            </div>
            <div className={styles.InputCamp}>
              <label
                htmlFor="email"
                className={` ${styles.InputLabel} ${
                  emailFocused || inputEmailValue !== ''
                    ? styles.deactived
                    : styles.actived
                }`}
              >
                Correo electrónico
              </label>
              <input
                id="email"
                autoComplete="new-email"
                {...register('email', { onChange: handleInputEmail })}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                type="text"
                className={`${styles.inputField} ${
                  emailFocused || inputEmailValue !== ''
                    ? styles.inputFieldFocused
                    : ''
                } ${styles.placeholderShown} ${
                  emailFocused ? styles.inputFieldFocusedState : ''
                }`}
              />
              {errors.email?.message && (
                <p className={styles.Error}>{errors.email?.message}</p>
              )}
            </div>
            <div className={styles.InputCamp}>
              <label
                htmlFor="password"
                className={` ${styles.InputLabel} ${
                  passwordFocused || inputPasswordValue !== ''
                    ? styles.deactived
                    : styles.actived
                }`}
              >
                Contraseña
              </label>
              <input
                id="password"
                autoComplete="new-password"
                {...register('password', { onChange: handleInputPassword })}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                type="password"
                className={`${styles.inputField} ${
                  passwordFocused || inputPasswordValue !== ''
                    ? styles.inputFieldFocused
                    : ''
                } ${styles.placeholderShown} ${
                  passwordFocused ? styles.inputFieldFocusedState : ''
                }`}
              />
              {errors.password?.message && (
                <p className={styles.Error}>{errors.password?.message}</p>
              )}
            </div>
          </motion.div>
        )}
        {currentStep === 2 && (
          <motion.div
            className={styles.ContentForm}
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <h1>Información de Perfil</h1>
            <p>
              Agrega una foto y un estado para completar al configuracion del
              perfil
            </p>
            <div className={styles.Images}>
              <input
                type="file"
                id="inputFile"
                accept="image/jpeg, image/png, image/webp, image/jpg"
                onChange={handleProfileImageChange}
              />
              <label htmlFor="inputFile">
                {previewImage ? (
                  <Image
                    className={styles.ImageUpload}
                    src={previewImage}
                    alt="preview profile picture"
                    width={100}
                    height={200}
                    priority
                  />
                ) : (
                  <Image src={camera} alt="" width={50} height={50} priority />
                )}
              </label>
              {previewImage && (
                <div
                  className={styles.DeleteImage}
                  onClick={() => setPreviewImage(null)}
                >
                  Quitar foto de perfil
                </div>
              )}
              {errors.profile?.message && (
                <p className={styles.Error}>{errors.profile?.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="status"
                className={` ${styles.InputLabel} ${
                  statusFocused || inputStatusValue !== ''
                    ? styles.deactived
                    : styles.actived
                }`}
              >
                Define un estado
              </label>
              <input
                id="status"
                autoComplete="new-status"
                {...register('status', { onChange: handleInputStatus })}
                onFocus={() => setStatusFocused(true)}
                onBlur={() => setStatusFocused(false)}
                type="text"
                className={`${styles.inputField} ${
                  statusFocused || inputStatusValue !== ''
                    ? styles.inputFieldFocused
                    : ''
                } ${styles.placeholderShown} ${
                  statusFocused ? styles.inputFieldFocusedState : ''
                }`}
              />
              {errors.status?.message && (
                <p className={styles.Advert}>{errors.status?.message}</p>
              )}
            </div>
          </motion.div>
        )}
      </form>
      {currentStep !== 0 && (
        <div className={styles.ButtonNextPrev}>
          <button className={styles.ButtonPrev} onClick={prev}>
            <Image src={prevIcon} alt="prev" width={20} height={20} />
            <p>Atras</p>
          </button>
          <button className={styles.ButtonNext} onClick={next}>
            <p>Siguiente</p>
            <Image src={nextIcon} alt="next" width={20} height={20} />
          </button>
        </div>
      )}
    </div>
  );
}
