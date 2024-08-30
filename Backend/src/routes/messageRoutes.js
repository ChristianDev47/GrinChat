import { Router } from 'express';
import MessageController from '../controllers/message.js';

const MessageRouter = ({ messageModel }) => {
  const messageRoutes = Router();
  const messageController = new MessageController({ messageModel });

  // DOCUMENTATION
  /**
   * @openapi
   * paths:
   *   /api/messages:
   *     get:
   *       summary: Get all messages
   *       tags: [Messages]
   *       description: Retrieve a list of all available messages.
   *       responses:
   *         '200':
   *           description: A list of messages
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/MessageOutput'
   *         '404':
   *           description: Error getting messages
   *     post:
   *       summary: Create a message
   *       tags: [Messages]
   *       description: Create a new message.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MessageInput'
   *       responses:
   *         '201':
   *           description: Message created successfully
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/MessageOutput'
   *         '400':
   *           description: Error creating message
   *   /api/messages/{id}:
   *     get:
   *       summary: Get a message by ID
   *       tags: [Messages]
   *       description: Retrieve a specific message by its ID.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the message to retrieve
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Message found
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/MessageOutput'
   *         '404':
   *           description: Message not found
   *     patch:
   *       summary: Update a message
   *       tags: [Messages]
   *       description: Update an existing message's information.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the message to update
   *           schema:
   *             type: string
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MessageInput'
   *       responses:
   *         '200':
   *           description: Message updated successfully
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/MessageOutput'
   *         '404':
   *           description: Error updating message
   *     delete:
   *       summary: Delete a message
   *       tags: [Messages]
   *       description: Delete a message by its ID.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the message to delete
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Message deleted successfully
   *         '404':
   *           description: Error deleting message
   *   /api/messages/chat/{id}:
   *     get:
   *       summary: Get messages by Chat ID
   *       tags: [Messages]
   *       description: Retrieve messages associated with a specific chat ID.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the chat to retrieve messages for
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Messages found
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/MessageOutput'
   *         '404':
   *           description: Messages not found
   * components:
   *   schemas:
   *     MessageInput:
   *       type: object
   *       properties:
   *         chatId:
   *           type: string
   *           description: The ID of the chat this message belongs to
   *         senderId:
   *           type: string
   *           description: The ID of the user who sent the message
   *         messageType:
   *           type: string
   *           enum: ["Text", "Video", "Image", "Audio", "Document", "Link", "AddGroupParticipant", "DeleteGroupParticipant", "Call_Ended", "Call_Cancelled", "Call_Missed", "VideoCall_Ended", "VideoCall_Cancelled", "VideoCall_Missed"]
   *           description: The type of the message
   *         content:
   *           type: string
   *           description: The content of the message
   *         fileUrl:
   *           type: string
   *           description: URL of the file associated with the message (if any)
   *         fileName:
   *           type: string
   *           description: Name of the file associated with the message (if any)
   *         response:
   *           type: string
   *           description: The ID of the message this message is responding to
   *         DeliverTime:
   *           type: string
   *           format: date-time
   *           description: The time when the message was delivered
   *         ReadTime:
   *           type: string
   *           format: date-time
   *           description: The time when the message was read
   *         status:
   *           type: string
   *           enum: ["Sent", "Delivered", "Read"]
   *           description: The status of the message
   *     MessageOutput:
   *       allOf:
   *         - $ref: '#/components/schemas/MessageInput'
   *         - type: object
   *           properties:
   *             _id:
   *               type: string
   *               description: The ID of the message
   *             createdAt:
   *               type: string
   *               format: date-time
   *               description: The creation timestamp of the message
   *             updatedAt:
   *               type: string
   *               format: date-time
   *               description: The last update timestamp of the message
   */

  // RUTAS
  messageRoutes.get('/', messageController.getAll);
  messageRoutes.post('/', messageController.create);
  messageRoutes.patch('/:id', messageController.update);
  messageRoutes.delete('/:id', messageController.delete);
  messageRoutes.get('/:id', messageController.getById);
  messageRoutes.get('/chat/:id', messageController.getByChatId);

  return messageRoutes;
};

export default MessageRouter;
