export const checkAudioPermission = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true; 
  } catch (error) {
    return false; 
  }
};

export const checkVideoPermission = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    return true; 
  } catch (error) {
    return false; 
  }
};

let mediaStream: MediaStream | null = null;

export const stopUsingMediaDevices = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null; 
  }
};
