const express = require('express');
const cors = require('cors');
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
const port =process.env.PORT|| 9000;


console.log(process.env.DB_PASS);
//midleware

const corsOption={
  origin:['http://localhost:5173', 'http://localhost:5174'],
  Credential:true,
  optionSuccessStatus:200
}

app.use(cors(corsOption));
app.use(express.json());

//mongodb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ptxksnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})


async function run() {
  try {
    const postsCollection=client.db('volunteer').collection('posts')
    const addvolunteerCollection=client.db('volunteer').collection('add-volunteer')

//get all data from mongodb
app.get('/posts', async (req, res) => {

const result= await postsCollection.find().toArray();
res.send(result);

})

//update
app.put('/post/:id', async (req, res) => {
  const id=req.params.id;
  const query=  {_id: new ObjectId(id)}


  const result= await addvolunteerCollection.findOne(query);
  res.send(result);
  
  })

//delete item
app.delete('/post/:id', async (req,res)=>{
  const id=req.params.id;
  const query=  {_id: new ObjectId(id)}
  const result= await addvolunteerCollection.deleteOne(query);
  res.send(result);
})

app.get('/post', async(req,res)=>{
  const result= await addvolunteerCollection.find().toArray();
  res.send(result);
})

//my list
app.get('/post',async(req,res) => {
  const result= await addvolunteerCollection.find().toArray();
  res.send(result);
})


app.post('/post',async(req,res)=>{
  const newPost=req.body;
  console.log(newPost);
  const result=await addvolunteerCollection.insertOne(newPost);
  res.send(result);
})



    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close(); 
  }
}
run().catch(console.dir);


app.get('/',(req,res) => {
res.send('volunteer management system is running')
})
app.listen(port,()=>{
console.log(`volunteer management server is running on port ${port}`);


})
