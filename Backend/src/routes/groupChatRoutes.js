import { Router } from 'express';
import GroupChatController from '../controllers/groupChat.js';

const GroupChatRouter = ({ groupChatModel }) => {
  const groupChatRoutes = Router();
  const groupChatController = new GroupChatController({ groupChatModel });

  // DOCUMENTATION
  /**
   * @openapi
   * paths:
   *   /api/groupChats:
   *     get:
   *       summary: Get all groupChats
   *       tags: [GroupChats]
   *       description: Retrieve a list of all available groupChats.
   *       responses:
   *         '200':
   *           description: A list of groupChats
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/GroupChatOutput'
   *         '404':
   *           description: Error getting groupChats
   *     post:
   *       summary: Create a groupChat
   *       tags: [GroupChats]
   *       description: Create a new groupChat.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GroupChatInput'
   *       responses:
   *         '201':
   *           description: GroupChat created successfully
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/GroupChatOutputPostPatch'
   *         '400':
   *           description: Error creating groupChat
   *   /api/groupChats/{id}:
   *     get:
   *       summary: Get a groupChat by ID
   *       tags: [GroupChats]
   *       description: Retrieve a specific groupChat by its ID.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the groupChat to retrieve
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: GroupChat found
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/GroupChatOutput'
   *         '404':
   *           description: GroupChat not found
   *     patch:
   *       summary: Update a groupChat
   *       tags: [GroupChats]
   *       description: Update an existing groupChat's information.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the groupChat to update
   *           schema:
   *             type: string
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GroupChatInput'
   *       responses:
   *         '200':
   *           description: GroupChat updated successfully
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/GroupChatOutputPostPatch'
   *         '404':
   *           description: Error updating groupChat
   *     delete:
   *       summary: Delete a groupChat
   *       tags: [GroupChats]
   *       description: Delete a groupChat by its ID.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the groupChat to delete
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: GroupChat deleted successfully
   *         '404':
   *           description: Error deleting groupChat
   *   /api/groupChats/participant/{id}:
   *     get:
   *       summary: Get a groupChat by Participant
   *       tags: [GroupChats]
   *       description: Retrieve a specific groupChat by its Participant.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the groupChat to retrieve
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: GroupChat found
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/GroupChatOutput'
   *         '404':
   *           description: GroupChat not found
   * components:
   *   schemas:
   *     GroupChatInput:
   *       type: object
   *       item:
   *          name:
   *           type: string
   *           description: The name of the group
   *          image:
   *           type: string
   *           description: The image of the group
   *          participants:
   *             type: array
   *             items:
   *                type: object
   *                properties:
   *                  userId:
   *                    type: string
   *                    description: The ID of the user articipant in the groupChat
   *                  role:
   *                    type: string
   *                    description: The role of the participant in the groupChat
   *                    enum: ["Admin", "Member"]
   *                  status:
   *                    type: string
   *                    description: The status of the participant in the groupChat
   *                    enum: ["Active", "Eliminated", "Out"]
   *     GroupChatOutput:
   *       type: object
   *       properties:
   *         _id:
   *           type: string
   *           description: The ID of the groupChat
   *         name:
   *           type: string
   *           description: The name of the group
   *         image:
   *           type: string
   *           description: The image of the group
   *         participants:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 description: The ID of the groupChat
   *               userId:
   *                 type: object
   *                 properties:
   *                    _id:
   *                      type: string
   *                      description: The ID of the groupChat
   *                    name:
   *                      type: string
   *                      description: The name of the groupChat
   *                    surname:
   *                      type: string
   *                      description: The surname of the groupChat
   *                    email:
   *                      type: string
   *                      description: The email of the groupChat
   *                    password:
   *                      type: string
   *                      description: The password of the groupChat
   *                    profilePicture:
   *                      type: string
   *                      description: URL of the groupChat's profile picture
   *                    status:
   *                      type: string
   *                      description: The status message of the groupChat
   *                    contacts:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                          _id:
   *                            type: string
   *                            description: The ID of the groupChat
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
   *                          fromGroupChatId:
   *                            type: string
   *                            description: The ID of the groupChat who sent the request
   *                          status:
   *                            type: string
   *                            enum: ["Pending", "Accepted", "Rejected"]
   *                            description: The status of the friend request
   *                    access_token:
   *                      type: string
   *                      description: The access token of the groupChat
   *                    expiration:
   *                      type: string
   *                      description: Expiration time of the access token
   *                    createdAt:
   *                      type: string
   *                      format: date-time
   *                      description: The creation timestamp of the groupChat
   *                    updatedAt:
   *                      type: string
   *                      format: date-time
   *                      description: The last update timestamp of the groupChat
   *               role:
   *                 type: string
   *                 description: The role of the participant in the groupChat
   *                 enum: ["Admin", "Member"]
   *               status:
   *                 type: string
   *                 description: The status of the participant in the groupChat
   *                 enum: ["Active", "Eliminated", "Out"]
   *         createdAt:
   *           type: string
   *           format: date-time
   *           description: The creation timestamp of the groupChat
   *         updatedAt:
   *           type: string
   *           format: date-time
   *           description: The last update timestamp of the groupChat
   *
   *     GroupChatOutputPostPatch:
   *       type: object
   *       properties:
   *         _id:
   *           type: string
   *           description: The ID of the groupChat
   *         participants:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 description: The ID of the groupChat
   *               userId:
   *                 type: string
   *                 description: The userId of the participant
   *               role:
   *                 type: string
   *                 description: The role of the participant in the groupChat
   *                 enum: ["Admin", "Member"]
   *               status:
   *                 type: string
   *                 description: The status of the participant in the groupChat
   *                 enum: ["Active", "Eliminated", "Out"]
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
  groupChatRoutes.get('/', groupChatController.getAll);
  groupChatRoutes.post('/', groupChatController.create);
  groupChatRoutes.patch('/:id', groupChatController.update);
  groupChatRoutes.delete('/:id', groupChatController.delete);
  groupChatRoutes.get('/:id', groupChatController.getById);
  groupChatRoutes.get('/participant/:id', groupChatController.getByUserId);

  return groupChatRoutes;
};
export default GroupChatRouter;
