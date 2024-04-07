import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Schedule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/schedules (POST)', () => {
    return request(app.getHttpServer())
      .post('/schedules')
      .send({
        title: 'Test Schedule',
        details: 'Some details',
        startTime: '2024-01-01T00:00:00.000Z',
        endTime: '2024-01-02T00:00:00.000Z',
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          id: expect.any(Number),
          title: 'Test Schedule',
          details: 'Some details',
          startTime: '2024-01-01T00:00:00.000Z',
          endTime: '2024-01-02T00:00:00.000Z',
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
