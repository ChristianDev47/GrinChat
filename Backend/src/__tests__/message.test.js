import request from 'supertest';
import app from '../app.js';

// GET ALL MESSAGES TEST
describe('GET /api/messages', () => {
  it('responds with JSON containing a list of messages', async () => {
    const response = await request(app)
      .get('/api/messages')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toBeInstanceOf(Array);
  });
});

// POST MESSAGE TEST
describe('POST /api/messages', () => {
  it('adds a new message to the database', async () => {
    const newMessage = {
      chatId: "61234abcd5678efgh90ijkl",
      senderId: "61234abcd5678efgh90ijkl",
      messageType: "Text",
      content: "Este es un mensaje de prueba",
      status: "Sent"
    };

    const response = await request(app)
      .post('/api/messages')
      .send(newMessage)
      .expect('Content-Type', /json/)
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
  });
});

// PATCH MESSAGE TEST
describe('PATCH /api/messages/:id', () => {
  it('updates an existing message in the database', async () => {
    const updatedMessage = {
      content: 'Mensaje actualizado'
    };

    const response = await request(app)
      .patch('/api/messages/61234abcd5678efgh90ijkl') // Reemplaza por un ID válido
      .send(updatedMessage)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.content).toBe('Mensaje actualizado');
  });
});

// DELETE MESSAGE TEST
describe('DELETE /api/messages/:id', () => {
  it('deletes an existing message from the database', async () => {
    const response = await request(app)
      .delete('/api/messages/61234abcd5678efgh90ijkl') // Reemplaza por un ID válido
      .expect(200);

    expect(response.body.message).toBe('Message deleted successfully');
  });
});

// GET MESSAGE BY ID TEST
describe('GET /api/messages/:id', () => {
  it('responds with JSON containing the details of a specific message', async () => {
    const response = await request(app)
      .get('/api/messages/61234abcd5678efgh90ijkl') // Reemplaza por un ID válido
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toHaveProperty('id');
  });
});

// GET MESSAGES BY CHAT ID TEST
describe('GET /api/messages/chat/:chatId', () => {
  it('responds with JSON containing a list of messages for a specific chat', async () => {
    const response = await request(app)
      .get('/api/messages/chat/61234abcd5678efgh90ijkl') // Reemplaza por un chatId válido
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toBeInstanceOf(Array);
  });
});
