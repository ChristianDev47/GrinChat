import request from 'supertest';
import app from '../app.js';

// GET TEST
describe('GET /api/users', () => {
  it('responds with JSON containing a list of users', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200)
      expect(response.body).toBeInstanceOf(Array); 
  });
});

// POST TEST
describe('POST /api/users', () => {
  it('adds a new user to the database', async () => {
    const newUser = {
      name: "Pedro",
      surname: "Flores",
      email: "pedro@example.com",
      password: "Password1234%",
      pasprofilePicture: "https://test/miprofile.jpg",
      status: "Buen estado",
      access_token: "QWEWQRERERRTYRGHKHJHI",
      expiration: "2024-09-14"
    };
    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(201)
      expect(response.body).toHaveProperty('id');
  });
});

// PATCH TEST
describe('PATCH /api/users/:id', () => {
  it('updates an existing user in the database', async () => {
      const updatedUser = {
          name: 'Ibai'
      };
      const response = await request(app)
        .patch('/api/users/6606dd4f06febca76189fa1b') 
        .send(updatedUser)
        .expect('Content-Type', /json/)
        .expect(200)
        expect(response.body.name).toBe('Updated User');
  });
});

// DELETE TEST
describe('DELETE /api/users/:id', () => {
  it('deletes an existing user from the database', async () => {
    const response = await request(app)
      .delete('/api/users/6686b0276478ffd0ab9b22b4') 
      .expect(200);
  });
});

// GETBYID TEST
describe('GET /api/users/:id', () => {
  it('responds with JSON containing the details of a specific user', async () => {
    const response = await request(app)
      .get('/api/users/6685e7a76b02fb2cf21e9e98') 
      .expect('Content-Type', /json/)
      .expect(200)
  });
});
