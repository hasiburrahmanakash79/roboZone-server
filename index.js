const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()

// middleWare
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvcivem.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toyCollection = client.db('robotWorld').collection('allToys')

    app.post('/allToys', async(req, res) => {
        const haiku = req.body
        console.log("data", haiku);
        const result = await toyCollection.insertOne(haiku)
        res.send(result)
    })

    app.get('/allToys', async(req, res) => {
      const toys = toyCollection.find()
      const result = await toys.toArray()
      res.send(result)
    })

    app.get('/singleToy/:id', async(req, res) =>{
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await toyCollection.findOne(query)
      res.send(result)
    })

    app.get('/myToy', async(req, res) => {
      let query = {}
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const cursor =  toyCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    // app.get('/categories', async(req, res) => {
    //   const query = {}
    //   if(req.query?.category){
    //     query = {category: req.query.category}
    //   }
    //   const cursor = toyCollection.find(query)
    //   const result = await cursor.toArray()
    //   res.send(result)
    // })

    app.delete('/allToys/items/:id', async(req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await toyCollection.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Welcome To RoboticWorld Server')
})

app.listen(port, () => {
  console.log(`Robot world is running on port ${port}`)
})