import request from 'supertest';
import app from '../app.js';

// GET ALL GROUP CHATS TEST
describe('GET /api/groupChats', () => {
  it('responds with JSON containing a list of group chats', async () => {
    const response = await request(app)
      .get('/api/groupChats')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toBeInstanceOf(Array); 
  });
});

// POST GROUP CHAT TEST
describe('POST /api/groupChats', () => {
  it('adds a new group chat to the database', async () => {
    const newGroupChat = {
      name: "Group Chat Example",
      participants: [
        {
          userId: "6606dd4f06febca76189fa1b",
          role: "Admin",
          status: "Active"
        },
        {
          userId: "6606dd4f06febca76189fa1c",
          role: "Member",
          status: "Active"
        }
      ]
    };
    const response = await request(app)
      .post('/api/groupChats')
      .send(newGroupChat)
      .expect('Content-Type', /json/)
      .expect(201);
    expect(response.body).toHaveProperty('_id');
  });
});

// PATCH GROUP CHAT TEST
describe('PATCH /api/groupChats/:id', () => {
  it('updates an existing group chat in the database', async () => {
    const updatedGroupChat = {
      name: "Updated Group Chat Example",
      participants: [
        {
          userId: "6606dd4f06febca76189fa1b",
          role: "Admin",
          status: "Eliminated"
        }
      ]
    };
    const response = await request(app)
      .patch('/api/groupChats/6606dd4f06febca76189fa1b') 
      .send(updatedGroupChat)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.name).toBe('Updated Group Chat Example');
    expect(response.body.participants[0].status).toBe('Eliminated');
  });
});

// DELETE GROUP CHAT TEST
describe('DELETE /api/groupChats/:id', () => {
  it('deletes an existing group chat from the database', async () => {
    const response = await request(app)
      .delete('/api/groupChats/6606dd4f06febca76189fa1b') 
      .expect(200);
    expect(response.body).toHaveProperty('message', 'GroupChat deleted sucessfull');
  });
});

// GET GROUP CHAT BY ID TEST
describe('GET /api/groupChats/:id', () => {
  it('responds with JSON containing the details of a specific group chat', async () => {
    const response = await request(app)
      .get('/api/groupChats/6606dd4f06febca76189fa1b') 
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toHaveProperty('_id');
  });
});

// GET GROUP CHAT BY USER ID TEST
describe('GET /api/groupChats/participant/:participantId', () => {
  it('responds with JSON containing a list of group chats for a specific participant', async () => {
    const response = await request(app)
      .get('/api/groupChats/participant/6606dd4f06febca76189fa1b') 
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toBeInstanceOf(Array); 
  });
});
