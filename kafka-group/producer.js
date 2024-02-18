const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'producer',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();

    let index = 1;
    while ( true ) {
        const partition = index % 2; // Simple partitioning strategy based on even/odd
        const message = { value: `Message to partition ${partition} ${index}` };

        // Send message to 'commission' topic
        await producer.send({
          topic: 'commission',
          messages: [message],
          partition: partition
        });
    
        // Send message to 'payment' topic
        await producer.send({
          topic: 'payment',
          messages: [message],
          partition: partition
        });
        //delay
        await new Promise( resolve => setTimeout( resolve, 500 ) );
        index++;
    }
  // Assuming each topic has 2 partitions (0 and 1)
  for (let partition = 0; partition < 2; partition++) {
    const message = { value: `Message to partition ${partition}` };

    // Send message to 'commission' topic
    await producer.send({
      topic: 'commission',
      messages: [message],
      partition: partition
    });

    // Send message to 'payment' topic
    await producer.send({
      topic: 'payment',
      messages: [message],
      partition: partition
    });

    console.log(`Message sent to partition ${partition} of both topics`);
  }

  await producer.disconnect();
};

run().catch(console.error);
