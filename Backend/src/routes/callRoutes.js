import { Router } from 'express';
import CallController from '../controllers/call.js';

const CallRouter = ({ callModel }) => {
  const callRoutes = Router();
  const callController = new CallController({ callModel });

  // DOCUMENTATION
  /**
   * @openapi
   * paths:
   *   /api/calls:
   *     get:
   *       summary: Get all calls
   *       tags: [Calls]
   *       description: Retrieve a list of all available calls.
   *       responses:
   *         '200':
   *           description: A list of calls
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/CallOutput'
   *         '404':
   *           description: Error getting calls
   *     post:
   *       summary: Create a call
   *       tags: [Calls]
   *       description: Create a new call.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CallInput'
   *       responses:
   *         '201':
   *           description: Call created successfully
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/CallOutputPostPatch'
   *         '400':
   *           description: Error creating call
   *   /api/calls/{id}:
   *     get:
   *       summary: Get a call by ID
   *       tags: [Calls]
   *       description: Retrieve a specific call by its ID.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the call to retrieve
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Call found
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/CallOutput'
   *         '404':
   *           description: Call not found
   *     patch:
   *       summary: Update a call
   *       tags: [Calls]
   *       description: Update an existing call's information.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the call to update
   *           schema:
   *             type: string
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CallInput'
   *       responses:
   *         '200':
   *           description: Call updated successfully
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/CallOutputPostPatch'
   *         '404':
   *           description: Error updating call
   *     delete:
   *       summary: Delete a call
   *       tags: [Calls]
   *       description: Delete a call by its ID.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the call to delete
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Call deleted successfully
   *         '404':
   *           description: Error deleting call
   *   /api/calls/participant/{id}:
   *     get:
   *       summary: Get a call by Participant
   *       tags: [Calls]
   *       description: Retrieve a specific call by its Participant.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the call to retrieve
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Call found
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/CallOutput'
   *         '404':
   *           description: Call not found
   * components:
   *   schemas:
   *     CallInput:
   *       type: object
   *       item:
   *          chatId:
   *             type: string
   *             description: The chatId of the call
   *          callType:
   *             type: string
   *             description: The type of the call
   *             enum: ["Audio", "Video"]
   *          participants:
   *             type: array
   *             items:
   *                type: object
   *                properties:
   *                  userId:
   *                    type: string
   *                    description: The ID of the user articipant in the call
   *          startTime:
   *             type: string
   *             format: date-time
   *             description: The started date of the call
   *          endTime:
   *             type: string
   *             format: date-time
   *             description: The ended date of the call
   *          status:
   *             type: string
   *             description: The status of the call
   *             enum: ["Ongoing", "Missed", "Completed"]
   *     CallOutput:
   *       type: object
   *       properties:
   *         _id:
   *           type: string
   *           description: The ID of the call
   *         chatId:
   *           type: string
   *           description: The chatId of the call
   *         callType:
   *           type: string
   *           description: The type of the call
   *           enum: ["Audio", "Video"]
   *         participants:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 description: The ID of the call
   *               userId:
   *                 type: object
   *                 properties:
   *                    _id:
   *                      type: string
   *                      description: The ID of the call
   *                    name:
   *                      type: string
   *                      description: The name of the call
   *                    surname:
   *                      type: string
   *                      description: The surname of the call
   *                    email:
   *                      type: string
   *                      description: The email of the call
   *                    password:
   *                      type: string
   *                      description: The password of the call
   *                    profilePicture:
   *                      type: string
   *                      description: URL of the call's profile picture
   *                    status:
   *                      type: string
   *                      description: The status message of the call
   *                    contacts:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                          _id:
   *                            type: string
   *                            description: The ID of the call
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
   *                          fromCallId:
   *                            type: string
   *                            description: The ID of the call who sent the request
   *                          status:
   *                            type: string
   *                            enum: ["Pending", "Accepted", "Rejected"]
   *                            description: The status of the friend request
   *                    access_token:
   *                      type: string
   *                      description: The access token of the call
   *                    expiration:
   *                      type: string
   *                      description: Expiration time of the access token
   *                    createdAt:
   *                      type: string
   *                      format: date-time
   *                      description: The creation timestamp of the call
   *                    updatedAt:
   *                      type: string
   *                      format: date-time
   *                      description: The last update timestamp of the call
   *         startTime:
   *           type: string
   *           format: date-time
   *           description: The started date of the call
   *         endTime:
   *           type: string
   *           format: date-time
   *           description: The ended date of the call
   *         status:
   *           type: string
   *           description: The status of the call
   *           enum: ["Ongoing", "Missed", "Completed"]
   *         createdAt:
   *           type: string
   *           format: date-time
   *           description: The creation timestamp of the call
   *         updatedAt:
   *           type: string
   *           format: date-time
   *           description: The last update timestamp of the call
   *
   *     CallOutputPostPatch:
   *       type: object
   *       properties:
   *         _id:
   *           type: string
   *           description: The ID of the call
   *         participants:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 description: The ID of the call
   *               userId:
   *                 type: string
   *                 description: The userId of the participant
   *         startTime:
   *           type: string
   *           format: date-time
   *           description: The started date of the call
   *         endTime:
   *           type: string
   *           format: date-time
   *           description: The ended date of the call
   *         status:
   *           type: string
   *           description: The status of the call
   *           enum: ["Ongoing", "Missed", "Completed"]
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
  callRoutes.get('/', callController.getAll);
  callRoutes.post('/', callController.create);
  callRoutes.patch('/:id', callController.update);
  callRoutes.delete('/:id', callController.delete);
  callRoutes.get('/:id', callController.getById);
  callRoutes.get('/participant/:id', callController.getByUserId);

  return callRoutes;
};
export default CallRouter;
