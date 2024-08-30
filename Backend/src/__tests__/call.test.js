import request from 'supertest';
import app from '../app.js';

// GET ALL CALLS TEST
describe('GET /api/calls', () => {
  it('responds with JSON containing a list of calls', async () => {
    const response = await request(app)
      .get('/api/calls')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toBeInstanceOf(Array); 
  });
});

// POST CALL TEST
describe('POST /api/calls', () => {
  it('adds a new call to the database', async () => {
    const newCall = {
      chatId: "6606dd4f06febca76189fa1b",
      callType: "Audio",
      participants: [
        {
          userId: "6606dd4f06febca76189fa1c"
        },
        {
          userId: "6606dd4f06febca76189fa1d"
        }
      ],
      startTime: new Date()
    };
    const response = await request(app)
      .post('/api/calls')
      .send(newCall)
      .expect('Content-Type', /json/)
      .expect(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.callType).toBe('Audio');
  });
});

// PATCH CALL TEST
describe('PATCH /api/calls/:id', () => {
  it('updates an existing call in the database', async () => {
    const updatedCall = {
      status: "Completed",
      endTime: new Date()
    };
    const response = await request(app)
      .patch('/api/calls/6606dd4f06febca76189fa1b') 
      .send(updatedCall)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.status).toBe('Completed');
    expect(response.body.endTime).toBeDefined();
  });
});

// DELETE CALL TEST
describe('DELETE /api/calls/:id', () => {
  it('deletes an existing call from the database', async () => {
    const response = await request(app)
      .delete('/api/calls/6606dd4f06febca76189fa1b') 
      .expect(200);
    expect(response.body).toHaveProperty('message', 'Call deleted sucessfull');
  });
});

// GET CALL BY ID TEST
describe('GET /api/calls/:id', () => {
  it('responds with JSON containing the details of a specific call', async () => {
    const response = await request(app)
      .get('/api/calls/6606dd4f06febca76189fa1b') 
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toHaveProperty('_id');
  });
});

// GET CALL BY USER ID TEST
describe('GET /api/calls/participant/:participantId', () => {
  it('responds with JSON containing a list of calls for a specific participant', async () => {
    const response = await request(app)
      .get('/api/calls/participant/6606dd4f06febca76189fa1c') 
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toBeInstanceOf(Array); 
  });
});
