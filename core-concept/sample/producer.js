const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const produceMessages = async () => {
  await producer.connect();
  for (let i = 0; i < 10; i++) {
    await producer.send({
      topic: 'test-topic',
      messages: [{ value: `Hello Kafka ${i}` }],
    });
    console.log(`Sent message ${i}`);
  }
  await producer.disconnect();
};

produceMessages().catch(console.error);
