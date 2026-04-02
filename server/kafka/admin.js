import kafka from './config.js'

async function init() {
  const admin = kafka.admin();
  console.log("Admin connecting...");
  admin.connect();
  console.log("Admin Connection Success...");

  console.log("Creating Topic [lumina-user-events]");
  await admin.createTopics({
    topics: [
      {
        topic: "lumina-user-events",
        numPartitions: 3,
      },
    ],
  });
  console.log("Topic Created Success [lumina-user-events]");

  // console.log("Resetting offset...")
  // await admin.setOffsets({ 
  //   groupId: "test-group", 
  //   topic: "lumina-user-events", 
  //   partitions: [
  //       { partition: 0, offset: '0' },
  //       { partition: 1, offset: '0' },
  //       { partition: 2, offset: '0' },
  //   ]
  // })

  console.log("Disconnecting Admin..");
  await admin.disconnect();
}

init();