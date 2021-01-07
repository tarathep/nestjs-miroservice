import { Controller, Get } from '@nestjs/common';
import { Client, ClientKafka, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  //--------- CONSUMER ----------

  @MessagePattern('topicA') // TOPIC NAME FOR SUBSCRIBE
  subscribeMessage(@Payload() message) {
    //show message to console
    console.log(message.value);
    return 'Hello World';
  }

  //--------- PRODUCER -----------

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'kafkaSample',
        brokers: ['10.138.38.65:9092'],
      },
      consumer: {
        groupId: 'my-kafka-consumer' // Should be the same thing we give in consumer
      }
    }
  })
  
  client: ClientKafka;

  async onModuleInit() {
    // Need to subscribe to topic 
    // so that we can get the response from kafka microservice
    this.client.subscribeToResponseOf('topicA');
    await this.client.connect();
  }
  

  // localhost:3000/
  @Get()
  PublishMessage() {
    //model message
    var message = {
      "uuid": '941a3018-d599-4f9a-9365-17e2c397aa00',
      "timestamp": new Date(),
      "topic": 'topicA',
      "payload": '{"say","Hello message"}'
    }
    return this.client.send(message.topic, JSON.stringify(message)); // args - topic, message
  }

}
