import UserModel from '../models/user.js';

export const UserSocketHandlers = (socket, io, users) => {
  socket.on('connected', (data) => {
    if (!(data.origin in users)) {
      users[data.origin] = socket.id;
    }
    io.emit('get-users', users);
  });

  socket.on('request-users', () => {
    io.emit('get-users', users);
  });

  socket.on('friend_request', async ({ user, friend }) => {
    try {
      const updateUsersRequest = await UserModel.update({
        userId: friend._id,
        user: {
          friendRequests: [...friend.friendRequests, { fromUserId: user._id }],
        },
      });
      const myUser = await UserModel.getById({
        userId: updateUsersRequest._id,
      });
      io.to(users[friend._id]).emit('update_users_existen', myUser);
      io.to(users[user._id]).emit('update_users_existen', user);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  });

  socket.on('friend_request_accept', async ({ user, friend }) => {
    try {
      const newListFriend = user.friendRequests.map((myuser) => {
        if (myuser.fromUserId._id === friend._id) {
          return {
            fromUserId: myuser.fromUserId._id,
            status: 'Accepted',
          };
        } else {
          return {
            fromUserId: myuser.fromUserId._id,
            status: myuser.status,
          };
        }
      });

      const updateUsersRequest = await UserModel.update({
        userId: user._id,
        user: {
          friendRequests: newListFriend,
          contacts: [...user.contacts, { contactId: friend._id }],
        },
      });
      const updateFriend = await UserModel.update({
        userId: friend._id,
        user: { contacts: [...friend.contacts, { contactId: user._id }] },
      });
      const myUser = await UserModel.getById({
        userId: updateUsersRequest._id,
      });
      const myFriend = await UserModel.getById({ userId: updateFriend._id });
      io.to(users[user._id]).emit('update_users_existen', myUser);
      io.to(users[friend._id]).emit('update_users_existen', myFriend);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  });

  socket.on('friend_request_rejected', async ({ user, friend }) => {
    try {
      const newListFriend = user.friendRequests.map((myuser) => {
        if (myuser.fromUserId._id === friend._id) {
          return {
            fromUserId: myuser.fromUserId._id,
            status: 'Rejected',
          };
        } else {
          return {
            fromUserId: myuser.fromUserId._id,
            status: myuser.status,
          };
        }
      });
      const updateUsersRequest = await UserModel.update({
        userId: user._id,
        user: { friendRequests: newListFriend },
      });
      io.to(users[user._id]).emit('update_users_existen', updateUsersRequest);
      io.to(users[friend._id]).emit('update_users_existen', friend);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  });

  socket.on('disconnect', () => {
    const online = users;
    for (const [key, val] of Object.entries(users)) {
      if (val === socket.id) {
        delete online[key];
      }
    }
    io.emit('get-users', online);
  });
};
