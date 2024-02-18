const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'my-group' });

const consumeMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'my-partitioned-topic', fromBeginning: true });
  // await consumer.assign([{ topic: 'my-partitioned-topic', partition: 0 }]);

  await consumer.run({
    eachMessage: async ( { topic, partition, message } ) => {
      //if(partition !== 0) return; // we can only consume from partition 0
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

consumeMessages().catch(console.error);
