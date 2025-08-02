import request from 'supertest';
import { buildServer } from '../src/buildServer.js';
import { jest } from '@jest/globals';


jest.setTimeout(15000); 

let app;

beforeAll(async () => {
  app = await buildServer();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test('GET / tests the server returns 200', async () => {
  const res = await request(app.server).get('/');
  expect(res.statusCode).toBe(200);
});



test('POST /tasks creates task and stores in Redis', async () => {
 
  app.redis = {
    set: jest.fn().mockResolvedValue('OK'),
    sadd: jest.fn().mockResolvedValue(1)
  };

 
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      suggested_task: 'Write blog post',
      category: 'Content Creation'
    })
  });

  const res = await request(app.server)
    .post('/tasks')
    .send({
      taskId: 'test-task-1',
      payload: 'Write something about AI'
    });

  expect(res.statusCode).toBe(201);
  expect(res.body).toEqual({
    taskId: 'test-task-1',
    status: 'scheduled'
  });

  expect(app.redis.set).toHaveBeenCalled();
  expect(app.redis.sadd).toHaveBeenCalled();

  expect(global.fetch).toHaveBeenCalledWith(
    'http://localhost:8001/suggest',
    expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: 'Write something about AI' })
    })
  );
});
