export function formatDate(dateString: string) {
  const myData = new Date(dateString);
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const hours = String(myData.getHours()).padStart(2, '0');
  const minutes = String(myData.getMinutes()).padStart(2, '0');

  if (date.getTime() === today.getTime()) {
    return `Hoy a las ${hours}:${minutes}`;
  } else if (date.getTime() === yesterday.getTime()) {
    return `Ayer a las ${hours}:${minutes}`;
  } else {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} a las ${hours}:${minutes}`;
  }
}

export function formatTimeDifference(
  startTime: string,
  endTime: string
): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  let differenceInSeconds = Math.floor(
    (end.getTime() - start.getTime()) / 1000
  );

  if (differenceInSeconds < 0) {
    return '0';
  }

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds} seg`;
  } else if (differenceInSeconds < 3600) {
    const minutes = Math.floor(differenceInSeconds / 60);
    const seconds = differenceInSeconds % 60;
    return `${minutes} min y ${seconds} seg`;
  } else {
    const hours = Math.floor(differenceInSeconds / 3600);
    differenceInSeconds %= 3600;
    const minutes = Math.floor(differenceInSeconds / 60);
    const seconds = differenceInSeconds % 60;
    return `${hours} hrs, ${minutes} min y ${seconds} seg`;
  }
}

export const getDayOfWeek = (dateTime: string) => {
  const daysOfWeek = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ];
  const date = new Date(dateTime);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const differenceInTime = today.getTime() - date.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

  if (differenceInDays === 0) {
    return 'hoy';
  } else if (differenceInDays === 1) {
    return 'ayer';
  } else if (differenceInDays > 3) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } else {
    return daysOfWeek[date.getDay()];
  }
};

export const getFormattedDateMessages = (dateString: string) => {
  const today = new Date();
  const date = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return 'Hoy';
  } else if (date.getTime() === yesterday.getTime()) {
    return 'Ayer';
  } else {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

export const getTime = (dateTime: string) => {
  const date = new Date(dateTime);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const sendTime = `${hours}:${formattedMinutes}`;
  return sendTime;
};


export const callDuraction = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const hoursDisplay = hours > 0 ? `${hours} hrs y ` : '';  
  const minutesDisplay = minutes > 0 ? `${minutes} min y ` : '';
  const secondsDisplay = `${remainingSeconds} seg`;

  return `${hoursDisplay}${minutesDisplay}${secondsDisplay}`;
};
