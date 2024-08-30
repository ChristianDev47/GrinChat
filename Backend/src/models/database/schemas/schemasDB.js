import { Schema, model } from 'mongoose';
import connectDB from '../../../config/database.js';

// Conectar a la base de datos
connectDB();

// Esquema de Usuario
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    status: {
      type: String,
      default: 'Hey there! I am using this chat app.',
    },
    access_token: {
      type: String,
    },
    expiration: {
      type: String,
    },
    contacts: [
      {
        contactId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    friendRequests: [
      {
        fromUserId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['Pending', 'Accepted', 'Rejected'],
          default: 'Pending',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });

const User = model('User', userSchema);

// Esquema de Mensajes
const messageSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    messageType: {
      type: String,
      enum: [
        'Text',
        'Video',
        'Image',
        'Audio',
        'Document',
        'Link',
        'AddGroupParticipant',
        'DeleteGroupParticipant',
        'Call_Ended',
        'Call_Cancelled',
        'Call_Missed',
        'VideoCall_Ended',
        'VideoCall_Cancelled',
        'VideoCall_Missed',
      ],
      default: 'Text',
    },
    content: {
      type: String,
    },
    fileUrl: {
      type: String,
    },
    fileName: {
      type: String,
    },
    response: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    DeliverTime: {
      type: Date,
    },
    ReadTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Sent', 'Delivered', 'Read'],
      default: 'Sent',
    },
  },
  {
    timestamps: true,
  }
);

const Message = model('Message', messageSchema);

// Esquema de Chat
const chatSchema = new Schema(
  {
    participants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['Active', 'Bloqued', 'Out', 'Delete'],
          default: 'Active',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chat = model('Chat', chatSchema);

// Esquema de Chat Grupal
const groupChatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    participants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['Admin', 'Member'],
          default: 'Member',
        },
        status: {
          type: String,
          enum: ['Active', 'Eliminated', 'Out'],
          default: 'Active',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const GroupChat = model('GroupChat', groupChatSchema);

// Esquema de Llamadas
const callSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
    },
    callType: {
      type: String,
      enum: ['Audio', 'Video'],
      required: true,
    },
    participants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Ongoing', 'Missed', 'Completed'],
      default: 'Ongoing',
    },
  },
  {
    timestamps: true,
  }
);

const Call = model('Call', callSchema);

export { User, Chat, GroupChat, Message, Call };
