const { Kafka } = require('kafkajs');

const consumerId = process.argv[2]; // Pass the consumer ID as an argument

const kafka = new Kafka({
  clientId: `payment-consumer-${consumerId}`,
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'payment-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'payment', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`[Payment Group - Consumer ${consumerId}] Received message:`, message.value.toString());
    }
  });
};

run().catch(console.error);
