const {
  MongoClient
} = require("mongodb");

const url = "mongodb+srv://Ashermanli:<password>@cluster0-wxc9j.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    console.log("connected correctly to server");
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);