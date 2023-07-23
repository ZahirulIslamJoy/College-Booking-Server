const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzxjncj.mongodb.net/?retryWrites=true&w=majority`;

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
    const classCollection = client.db("classCollection").collection("classes");
    const addCollection = client.db("classCollection").collection("addmission");

    app.get("/class", async (req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result);
    });

    app.get("/class/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: id,
      };
      const result = await classCollection.findOne(query);
      res.send(result);
    });

    app.post("/admission", async (req, res) => {
      const data = req.body;
      const result = await addCollection.insertOne(data);
      res.send(result);
    });

    app.get("/admission/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        email: email,
      };
      const result = await addCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/searchclg/:text", async (req, res) => {
      const text = req.params.text;
      const query = {
        college_name: { $regex: text, $options: "i" },
      };
      const result = await classCollection.find(query).toArray();
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);
