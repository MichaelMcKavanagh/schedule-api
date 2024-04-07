import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as serverlessHttp from 'serverless-http';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const expressApp = express();
const adapter = new ExpressAdapter(expressApp);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, adapter);
  await app.init();

  await app.listen(3333);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

const handler = serverlessHttp(expressApp);
export { handler };
