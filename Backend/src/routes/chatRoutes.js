import { Router } from 'express';
import ChatController from '../controllers/chat.js';

const ChatRouter = ({ chatModel }) => {
  const chatRoutes = Router();
  const chatController = new ChatController({ chatModel });

  // DOCUMENTATION
  /**
   * @openapi
   * paths:
   *   /api/chats:
   *     get:
   *       summary: Get all chats
   *       tags: [Chats]
   *       description: Retrieve a list of all available chats.
   *       responses:
   *         '200':
   *           description: A list of chats
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/ChatOutput'
   *         '404':
   *           description: Error getting chats
   *     post:
   *       summary: Create a chat
   *       tags: [Chats]
   *       description: Create a new chat.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ChatInput'
   *       responses:
   *         '201':
   *           description: Chat created successfully
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/ChatOutputPostPatch'
   *         '400':
   *           description: Error creating chat
   *   /api/chats/{id}:
   *     get:
   *       summary: Get a chat by ID
   *       tags: [Chats]
   *       description: Retrieve a specific chat by its ID.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the chat to retrieve
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Chat found
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/ChatOutput'
   *         '404':
   *           description: Chat not found
   *     patch:
   *       summary: Update a chat
   *       tags: [Chats]
   *       description: Update an existing chat's information.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the chat to update
   *           schema:
   *             type: string
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ChatInput'
   *       responses:
   *         '200':
   *           description: Chat updated successfully
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/ChatOutputPostPatch'
   *         '404':
   *           description: Error updating chat
   *     delete:
   *       summary: Delete a chat
   *       tags: [Chats]
   *       description: Delete a chat by its ID.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the chat to delete
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Chat deleted successfully
   *         '404':
   *           description: Error deleting chat
   *   /api/chats/participant/{id}:
   *     get:
   *       summary: Get a chat by Participant
   *       tags: [Chats]
   *       description: Retrieve a specific chat by its Participant.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the chat to retrieve
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Chat found
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/ChatOutput'
   *         '404':
   *           description: Chat not found
   * components:
   *   schemas:
   *     ChatInput:
   *       type: object
   *       item:
   *          participants:
   *             type: array
   *             items:
   *                type: object
   *                properties:
   *                  userId:
   *                    type: string
   *                    description: The ID of the user articipant in the groupChat
   *                  status:
   *                    type: string
   *                    description: The status of the participant in the groupChat
   *                    enum: ["Active", "Bloqued", "Out", "Delete"]
   *     ChatOutput:
   *       type: object
   *       properties:
   *         _id:
   *           type: string
   *           description: The ID of the chat
   *         participants:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 description: The ID of the chat
   *               userId:
   *                 type: object
   *                 properties:
   *                    _id:
   *                      type: string
   *                      description: The ID of the chat
   *                    name:
   *                      type: string
   *                      description: The name of the chat
   *                    surname:
   *                      type: string
   *                      description: The surname of the chat
   *                    email:
   *                      type: string
   *                      description: The email of the chat
   *                    password:
   *                      type: string
   *                      description: The password of the chat
   *                    profilePicture:
   *                      type: string
   *                      description: URL of the chat's profile picture
   *                    status:
   *                      type: string
   *                      description: The status message of the chat
   *                    contacts:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                          _id:
   *                            type: string
   *                            description: The ID of the chat
   *                          contactId:
   *                            type: string
   *                            description: The ID of the contact
   *                    friendRequests:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                          _id:
   *                            type: string
   *                            description: The ID of the friendRequest
   *                          fromChatId:
   *                            type: string
   *                            description: The ID of the chat who sent the request
   *                          status:
   *                            type: string
   *                            enum: ["Pending", "Accepted", "Rejected"]
   *                            description: The status of the friend request
   *                    access_token:
   *                      type: string
   *                      description: The access token of the chat
   *                    expiration:
   *                      type: string
   *                      description: Expiration time of the access token
   *                    createdAt:
   *                      type: string
   *                      format: date-time
   *                      description: The creation timestamp of the chat
   *                    updatedAt:
   *                      type: string
   *                      format: date-time
   *                      description: The last update timestamp of the chat
   *               status:
   *                 type: string
   *                 description: The status of the participant in the Chat
   *                 enum: ["Active", "Bloqued", "Out", "Delete"]
   *         createdAt:
   *           type: string
   *           format: date-time
   *           description: The creation timestamp of the chat
   *         updatedAt:
   *           type: string
   *           format: date-time
   *           description: The last update timestamp of the chat
   *
   *     ChatOutputPostPatch:
   *       type: object
   *       properties:
   *         _id:
   *           type: string
   *           description: The ID of the chat
   *         participants:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 description: The ID of the chat
   *               userId:
   *                 type: string
   *                 description: The userId of the participant
   *               status:
   *                 type: string
   *                 description: The status of the participant in the chat
   *                 enum: ["Active", "Bloqued", "Out", "Delete"]
   *         createdAt:
   *           type: string
   *           format: date-time
   *           description: The creation timestamp of the call
   *         updatedAt:
   *           type: string
   *           format: date-time
   *           description: The last update timestamp of the call
   */

  // RUTAS
  chatRoutes.get('/', chatController.getAll);
  chatRoutes.post('/', chatController.create);
  chatRoutes.patch('/:id', chatController.update);
  chatRoutes.delete('/:id', chatController.delete);
  chatRoutes.get('/:id', chatController.getById);
  chatRoutes.get('/participant/:id', chatController.getByUserId);

  return chatRoutes;
};
export default ChatRouter;
