import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const apps = await NestFactory.create(AppModule);
  await apps.listen(3000);

  
  //Config Consumer Server
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        //kafka server : support cluster
        brokers: ['10.138.38.65:9092'],
      },
      consumer: {
        //group id like app name
          groupId: 'my-kafka-consumer',
      }
    }
  });

  app.listen(() => console.log('Kafka consumer service is listening!'))

}
bootstrap();
