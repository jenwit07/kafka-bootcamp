const { Kafka } = require('kafkajs');

// const kafka = new Kafka({
//   clientId: 'my-app',
//   brokers: ['localhost:9092']
// });

// const producer = kafka.producer();

// const produceMessages = async () => {
//   await producer.connect();
//   for (let i = 0; i < 10; i++) {
//     const partition = i % 2; // Simple partitioning strategy based on even/odd
//     await producer.send({
//       topic: 'my-partitioned-topic',
//       messages: [
//         { value: `Message ${i}`, partition }
//       ],
//     });
//     console.log(`Produced message ${i} to partition ${partition}`);
//   }
//   await producer.disconnect();
// };

// produceMessages().catch(console.error);


// more complex partitioning strategy
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
  // Use a custom partitioner
  partitioners: [
    ({ topic }) => {
      return ({ message }) => {
        // Use a simple hash function to determine the partition based on the message value
        const hash = message.value.toString().split('').reduce((acc, char) => {
          return (acc + char.charCodeAt(0)) % 256;
        }, 0);
        // Assume we have 4 partitions for this topic
        console.log(`Hash: ${hash} for message: ${message.value.toString()}`);
        return hash % 4;
      };
    },
  ],
});

const producer = kafka.producer();

const produceMessages = async () => {
  await producer.connect();
  for (let i = 0; i < 20; i++) {
    const message = `Message ${i}`;
    await producer.send({
      topic: 'my-partitioned-topic',
      messages: [{ value: message }],
    });
    console.log(`Produced: ${message}`);
  }
  await producer.disconnect();
};

produceMessages().catch(console.error);
