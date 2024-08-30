import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { CallType } from '@/src/types/chat';
import { useConversation } from '@/src/hooks/useConversation';
import { useAuth } from '@/src/hooks/useAuth';

export const useCallManagement = () => {
  const { user } = useAuth();
  const { setClient, setCallPage, setVideoCallPage, playCallSound } =
    useConversation();

  const startCall = (data: CallType) => {
    const apiKey = process.env.NEXT_PUBLIC_CALL_KEY;
    if (apiKey) {
      const myuser = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        profilePicture: user.profilePicture,
      };
      const client = new StreamVideoClient({
        apiKey,
        user: myuser,
        token: user.access_token,
      });
      if (data.userStartCalling?._id !== user._id) {
        playCallSound();
      }
      setClient(client);

      if (data.call.callType === 'Audio') {
        setCallPage(true);
      } else {
        setVideoCallPage(true);
      }
    }
  };

  return {
    startCall,
  };
};
