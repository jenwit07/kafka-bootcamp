const { Kafka } = require('kafkajs');

const clientIdSuffix = process.argv[2] || '1'; // Default to '1' if no argument is provided
const kafka = new Kafka({
  clientId: `commission-consumer-${clientIdSuffix}`,
  brokers: ['localhost:9092']
});

//const consumer = kafka.consumer({ groupId: 'commission-group'+clientIdSuffix }); // run all 
const consumer = kafka.consumer({ groupId: 'commission-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'commission', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`[${clientIdSuffix}] Received message:`, message.value.toString());
    }
  });
};

run().catch(console.error);
