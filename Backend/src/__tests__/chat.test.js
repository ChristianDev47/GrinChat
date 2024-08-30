import request from 'supertest';
import app from '../app.js';

// GET ALL CHATS TEST
describe('GET /api/chats', () => {
  it('responds with JSON containing a list of chats', async () => {
    const response = await request(app)
      .get('/api/chats')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toBeInstanceOf(Array); 
  });
});

// POST CHAT TEST
describe('POST /api/chats', () => {
  it('adds a new chat to the database', async () => {
    const newChat = {
      participants: [
        {
          userId: "6606dd4f06febca76189fa1b",
          status: "Active"
        },
        {
          userId: "6606dd4f06febca76189fa1c",
          status: "Active"
        }
      ]
    };
    const response = await request(app)
      .post('/api/chats')
      .send(newChat)
      .expect('Content-Type', /json/)
      .expect(201);
    expect(response.body).toHaveProperty('_id');
  });
});

// PATCH CHAT TEST
describe('PATCH /api/chats/:id', () => {
  it('updates an existing chat in the database', async () => {
    const updatedChat = {
      participants: [
        {
          userId: "6606dd4f06febca76189fa1b",
          status: "Blocked"
        }
      ]
    };
    const response = await request(app)
      .patch('/api/chats/6606dd4f06febca76189fa1b') 
      .send(updatedChat)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.participants[0].status).toBe('Blocked');
  });
});

// DELETE CHAT TEST
describe('DELETE /api/chats/:id', () => {
  it('deletes an existing chat from the database', async () => {
    const response = await request(app)
      .delete('/api/chats/6606dd4f06febca76189fa1b') 
      .expect(200);
    expect(response.body).toHaveProperty('message', 'Chat deleted successfully');
  });
});

// GET CHAT BY ID TEST
describe('GET /api/chats/:id', () => {
  it('responds with JSON containing the details of a specific chat', async () => {
    const response = await request(app)
      .get('/api/chats/6606dd4f06febca76189fa1b') 
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toHaveProperty('_id');
  });
});

// GET CHAT BY USER ID TEST
describe('GET /api/chats/participant/:id', () => {
  it('responds with JSON containing a list of chats for a specific participant', async () => {
    const response = await request(app)
      .get('/api/chats/participant/6606dd4f06febca76189fa1b') 
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toBeInstanceOf(Array); 
  });
});
