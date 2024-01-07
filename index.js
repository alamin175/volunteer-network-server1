const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

// middleware use
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Volunteer network are coming");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kflht43.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const networkCollection = await client
      .db("network")
      .collection("charity-data");
    const volunteerCollecetion = await client
      .db("network")
      .collection("volunteer-data");

    app.get("/data", async (req, res) => {
      const query = {};
      const cursor = networkCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/volunteer/:id", async (req, res) => {
      const data = req.body;
      // console.log(data);
      const result = await volunteerCollecetion.insertOne(data);
      res.send(result);
    });

    app.get("/events", async (req, res) => {
      const query = {};
      const cursor = volunteerCollecetion.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/volunteer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const cursor = await networkCollection.findOne(query);
      res.send(cursor);
    });

    app.delete("/event/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await volunteerCollecetion.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("The listening port is", port);
});