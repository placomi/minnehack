import Docker from "dockerode";
import { DynamoDBClient, CreateTableCommand, CreateTableCommandInput, ScalarAttributeType } from "@aws-sdk/client-dynamodb";

const docker = new Docker();
const LOCAL_PORT = 8000;
const CONTAINER_NAME = "dynamodb-local";

async function startDynamo() {
  const containers = await docker.listContainers({ all: true });
  const existing = containers.find(c => c.Names.includes(`/${CONTAINER_NAME}`));

  if (!existing) {
    console.log("Starting local DynamoDB container...");
    await docker.createContainer({
      Image: "amazon/dynamodb-local",
      name: CONTAINER_NAME,
      HostConfig: {
        PortBindings: { "8000/tcp": [{ HostPort: LOCAL_PORT.toString() }] },
      },
    }).then(c => c.start());
  } else {
    console.log("DynamoDB container already exists, starting if stopped...");
    const container = docker.getContainer(CONTAINER_NAME);
    await container.start().catch(() => {});
  }

  console.log("Waiting a few seconds for DynamoDB to initialize...");
  await new Promise(res => setTimeout(res, 3000));
}

const client = new DynamoDBClient({
  region: "local",
  endpoint: `http://localhost:${LOCAL_PORT}`,
  credentials: {
    accessKeyId: "fakeAccessKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  },
});

async function createTables() {
  const tables: CreateTableCommandInput[] = [
    {
      TableName: "SNIPPETS",
      AttributeDefinitions: [
        { AttributeName: "geohash", AttributeType: ScalarAttributeType.S },       // HASH key (PK)
        { AttributeName: "timestamp_id", AttributeType: ScalarAttributeType.S },  // RANGE key (SK)
      ],
      KeySchema: [
        { AttributeName: "geohash", KeyType: "HASH" },
        { AttributeName: "timestamp_id", KeyType: "RANGE" },
      ],
      BillingMode: "PAY_PER_REQUEST",
      // if we want a gsi
    //   GlobalSecondaryIndexes: [
    //     {
    //       IndexName: "user-id-index",
    //       KeySchema: [
    //         { AttributeName: "user_id", KeyType: "HASH" }
    //       ],
    //       Projection: { ProjectionType: "ALL" },
    //     },
    //   ],
    },
  ];

  for (const t of tables) {
    try {
      await client.send(new CreateTableCommand(t as CreateTableCommandInput));
      console.log(`Created table: ${t.TableName}`);
    } catch (err: any) {
      if (err.name === "ResourceInUseException") {
        console.log(`Table already exists: ${t.TableName}`);
      } else {
        console.error(`Error creating table ${t.TableName}:`, err);
      }
    }
  }
}

async function main() {
  await startDynamo();
  await createTables();
  console.log("Local DynamoDB setup complete");
}

main().catch(console.error);