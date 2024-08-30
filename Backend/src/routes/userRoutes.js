import { Router } from 'express';
import UserController from '../controllers/user.js';
import { uploadProfileImage } from '../services/userImage.js';

const UserRouter = ({ userModel }) => {
  const userRoutes = Router();
  const userController = new UserController({ userModel });

  // DOCUMENTATION
  /**
   * @openapi
   * paths:
   *   /api/users:
   *     get:
   *       summary: Get all users
   *       tags: [Users]
   *       description: Retrieve a list of all available users.
   *       responses:
   *         '200':
   *           description: A list of users
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/UserOutput'
   *         '404':
   *           description: Error getting users
   *     post:
   *       summary: Create a user
   *       tags: [Users]
   *       description: Create a new user.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserInput'
   *       responses:
   *         '201':
   *           description: User created successfully
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/UserOutputPostPatch'
   *         '400':
   *           description: Error creating user
   *   /api/users/{id}:
   *     get:
   *       summary: Get a user by ID
   *       tags: [Users]
   *       description: Retrieve a specific user by its ID.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the user to retrieve
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: User found
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/UserOutput'
   *         '404':
   *           description: User not found
   *     patch:
   *       summary: Update a user
   *       tags: [Users]
   *       description: Update an existing user's information.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the user to update
   *           schema:
   *             type: string
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserInput'
   *       responses:
   *         '200':
   *           description: User updated successfully
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/UserOutputPostPatch'
   *         '404':
   *           description: Error updating user
   *     delete:
   *       summary: Delete a user
   *       tags: [Users]
   *       description: Delete a user by its ID.
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The ID of the user to delete
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: User deleted successfully
   *         '404':
   *           description: Error deleting user
   * components:
   *   schemas:
   *     UserInput:
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *           description: The name of the user
   *         surname:
   *           type: string
   *           description: The surname of the user
   *         email:
   *           type: string
   *           description: The email of the user
   *         password:
   *           type: string
   *           description: The password of the user
   *         profilePicture:
   *           type: string
   *           description: URL of the user's profile picture
   *         status:
   *           type: string
   *           description: The status message of the user
   *         access_token:
   *           type: string
   *           description: The access token of the user
   *         expiration:
   *           type: string
   *           description: Expiration time of the access token
   *         contacts:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               contactId:
   *                 type: string
   *                 description: The ID of the contact
   *         friendRequests:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               fromUserId:
   *                 type: string
   *                 description: The ID of the user who sent the request
   *               status:
   *                 type: string
   *                 enum: ["Pending", "Accepted", "Rejected"]
   *                 description: The status of the friend request
   *     UserOutput:
   *       type: object
   *       properties:
   *         _id:
   *           type: string
   *           description: The ID of the user
   *         name:
   *           type: string
   *           description: The name of the user
   *         surname:
   *           type: string
   *           description: The surname of the user
   *         email:
   *           type: string
   *           description: The email of the user
   *         password:
   *           type: string
   *           description: The password of the user
   *         profilePicture:
   *           type: string
   *           description: URL of the user's profile picture
   *         status:
   *           type: string
   *           description: The status message of the user
   *         contacts:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 description: The ID of the user
   *               contactId:
   *                 type: object
   *                 properties:
   *                    _id:
   *                      type: string
   *                      description: The ID of the user
   *                    name:
   *                      type: string
   *                      description: The name of the user
   *                    surname:
   *                      type: string
   *                      description: The surname of the user
   *                    email:
   *                      type: string
   *                      description: The email of the user
   *                    password:
   *                      type: string
   *                      description: The password of the user
   *                    profilePicture:
   *                      type: string
   *                      description: URL of the user's profile picture
   *                    status:
   *                      type: string
   *                      description: The status message of the user
   *                    contacts:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                          _id:
   *                            type: string
   *                            description: The ID of the user
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
   *                          fromUserId:
   *                            type: string
   *                            description: The ID of the user who sent the request
   *                          status:
   *                            type: string
   *                            enum: ["Pending", "Accepted", "Rejected"]
   *                            description: The status of the friend request
   *                    access_token:
   *                      type: string
   *                      description: The access token of the user
   *                    expiration:
   *                      type: string
   *                      description: Expiration time of the access token
   *                    createdAt:
   *                      type: string
   *                      format: date-time
   *                      description: The creation timestamp of the user
   *                    updatedAt:
   *                      type: string
   *                      format: date-time
   *                      description: The last update timestamp of the user
   *         friendRequests:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 description: The ID of the user
   *               fromUserId:
   *                 type: object
   *                 properties:
   *                    _id:
   *                      type: string
   *                      description: The ID of the user
   *                    name:
   *                      type: string
   *                      description: The name of the user
   *                    surname:
   *                      type: string
   *                      description: The surname of the user
   *                    email:
   *                      type: string
   *                      description: The email of the user
   *                    password:
   *                      type: string
   *                      description: The password of the user
   *                    profilePicture:
   *                      type: string
   *                      description: URL of the user's profile picture
   *                    status:
   *                      type: string
   *                      description: The status message of the user
   *                    contacts:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                          _id:
   *                            type: string
   *                            description: The ID of the user
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
   *                          fromUserId:
   *                            type: string
   *                            description: The ID of the user who sent the request
   *                          status:
   *                            type: string
   *                            enum: ["Pending", "Accepted", "Rejected"]
   *                            description: The status of the friend request
   *                    access_token:
   *                      type: string
   *                      description: The access token of the user
   *                    expiration:
   *                      type: string
   *                      description: Expiration time of the access token
   *                    createdAt:
   *                      type: string
   *                      format: date-time
   *                      description: The creation timestamp of the user
   *                    updatedAt:
   *                      type: string
   *                      format: date-time
   *                      description: The last update timestamp of the user
   *               status:
   *                 type: string
   *                 enum: ["Pending", "Accepted", "Rejected"]
   *                 description: The status of the friend request
   *         access_token:
   *           type: string
   *           description: The access token of the user
   *         expiration:
   *           type: string
   *           description: Expiration time of the access token
   *         createdAt:
   *           type: string
   *           format: date-time
   *           description: The creation timestamp of the user
   *         updatedAt:
   *           type: string
   *           format: date-time
   *           description: The last update timestamp of the user
   *     UserOutputPostPatch:
   *       type: object
   *       properties:
   *         _id:
   *           type: string
   *           description: The ID of the user
   *         name:
   *           type: string
   *           description: The name of the user
   *         surname:
   *           type: string
   *           description: The surname of the user
   *         email:
   *           type: string
   *           description: The email of the user
   *         password:
   *           type: string
   *           description: The password of the user
   *         profilePicture:
   *           type: string
   *           description: URL of the user's profile picture
   *         status:
   *           type: string
   *           description: The status message of the user
   *         contacts:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 description: The ID of the user
   *               contactId:
   *                 type: string
   *                 description: The contactId of the contact
   *         friendRequests:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 description: The ID of the user
   *               fromUserId:
   *                 type: object
   *                 description: The ID of the user of the request
   *               status:
   *                 type: string
   *                 enum: ["Pending", "Accepted", "Rejected"]
   *                 description: The status of the friend request
   *         access_token:
   *           type: string
   *           description: The access token of the user
   *         expiration:
   *           type: string
   *           description: Expiration time of the access token
   *         createdAt:
   *           type: string
   *           format: date-time
   *           description: The creation timestamp of the user
   *         updatedAt:
   *           type: string
   *           format: date-time
   *           description: The last update timestamp of the user
   */

  // RUTAS
  userRoutes.get('/', userController.getAll);
  userRoutes.post(
    '/',
    uploadProfileImage.single('profile'),
    userController.create
  );
  userRoutes.patch(
    '/:id',
    uploadProfileImage.single('profile'),
    userController.update
  );
  userRoutes.delete('/:id', userController.delete);
  userRoutes.get('/:id', userController.getById);

  return userRoutes;
};
export default UserRouter;
