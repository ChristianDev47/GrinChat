import CallModel from '../models/call.js';
import MessageModel from '../models/message.js';

export const CallSocketHandlers = (socket, io, users) => {
  socket.on('start_call', async (data) => {
    try {
      const { callType, participants, startCallingParticipant, chatId } = data;

      const callParticipants = participants.map((participant) => {
        return {
          userId: participant.userId._id,
        };
      });
      const newCall = await CallModel.create({
        call: {
          chatId,
          callType,
          participants: callParticipants,
          startTime: new Date().toISOString(),
        },
      });

      const myCall = await CallModel.getById({ callId: newCall._id });
      myCall.participants.map((part) => {
        io.to(users[part.userId._id]).emit('calling_has_started', {
          call: myCall,
          userStartCalling: startCallingParticipant,
        });
      });
    } catch (error) {
      console.error('Error creating group:', error);
    }
  });

  socket.on('call_request_accepted', async (data) => {
    try {
      const { callId, call, startedCall } = data;
      await CallModel.update({ callId: callId._id, call: { status: 'Completed' } });
      callId.participants.map((participant) => {
        if (callId.callType === 'Audio') {
          io.to(users[participant.userId._id]).emit(
            'call_request_accepted_by_user',
            {call, startedCall}
          );
        } else {
          io.to(users[participant.userId._id]).emit(
            'videocall_request_accepted_by_user',
            {call, startedCall}
          );
        }
      });
    } catch (error) {
      console.error('Error in call:', error);
    }
  });

  socket.on('called_missed', async (data) => {
    try {
      const { callId, callType, chatId, startCallingParticipant, type } = data;

      await CallModel.update({ callId, call: { status: callType } });
      const myCall = await CallModel.getById({ callId });
      const message = {
        chatId,
        senderId: startCallingParticipant._id,
        messageType: type === 'Audio' ? 'Call_Missed' : 'VideoCall_Missed',
        status: 'Read',
      };
      const newMessage = await MessageModel.create({ message });
      const messageWithData = await MessageModel.getById({
        messageId: newMessage._id,
      });
      myCall.participants.map((participant) => {
        io.to(users[participant.userId._id]).emit('call_has_been_missed', true);
        io.to(users[participant.userId._id]).emit(
          'message_sent',
          messageWithData
        );
      });
    } catch (error) {
      console.error('Error in call:', error);
    }
  });

  socket.on('call_request_canceled', async (data) => {
    try {
      const {
        callStarted,
        chatId,
        callId,
        participants,
        participantsForNotify,
        type,
      } = data;

      await CallModel.update({ callId, call: { status: 'Missed' } });
      const message = {
        chatId,
        senderId: callStarted.userId._id,
        messageType:
          type === 'Audio' ? 'Call_Cancelled' : 'VideoCall_Cancelled',
        status: 'Read',
      };
      const newMessage = await MessageModel.create({ message });
      const messageWithData = await MessageModel.getById({
        messageId: newMessage._id,
      });
      participants.map((participant) => {
        io.to(users[participant.userId._id]).emit(
          'call_request_canceled_by_user'
        );
      });
      participantsForNotify.map((participant) => {
        io.to(users[participant.userId._id]).emit(
          'message_sent',
          messageWithData
        );
      });
    } catch (error) {
      console.error('Error in call:', error);
    }
  });

  socket.on('call_request_end', async (data) => {
    try {
      const {
        callId,
        participants,
        callStarted,
        chatId,
        content,
        endTime,
        type,
      } = data;

      await CallModel.update({ callId, call: { endTime } });

      const message = {
        chatId,
        senderId: callStarted,
        messageType: type === 'Audio' ? 'Call_Ended' : 'VideoCall_Ended',
        content,
        status: 'Read',
      };
      const newMessage = await MessageModel.create({ message });
      const messageWithData = await MessageModel.getById({
        messageId: newMessage._id,
      });
      participants.map((participant) => {
        io.to(users[participant.userId._id]).emit(
          'message_sent',
          messageWithData
        );
        io.to(users[participant.userId._id]).emit('call_request_ended_by_user');
      });
    } catch (error) {
      console.error('Error in call:', error);
    }
  });
};
