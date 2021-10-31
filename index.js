const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId; 


const app = express();
const port = process.env.PORT || 5000 ;

// middleware
app.use(cors());
app.use(express.json());

// start curd oparetion

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cqu9q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);
async function run(){
    try{
        await client.connect();
        const database = client.db('tour');
        const packageCollection = database.collection('package');
        const orderCollection = database.collection('order');
        console.log('database connected successfully');
        // GET API
        app.get('/package', async(req,res)=>{
            const cursor = packageCollection.find({});
            const package = await cursor.toArray();
            res.send(package);
        })

        // POST API (insert data)
        app.post('/package' , async(req,res) =>{
            const newPackage = req.body;
            const result = await packageCollection.insertOne(newPackage);
            res.json(result);
        })
        // GET API
        app.get('/order', async(req,res)=>{
            const cursor = await orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        });

        // POST API for order
        app.post('/order', async(req,res) =>{
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.json(result);
        });
        //update product
        app.put("/confirm/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
 
            orderCollection.updateOne(filter, {
                    $set: {
                        status: "Confirm"
                    },
                })
                .then((result) => {
                    res.send(result);
                });
 
        });
        // delete 
        app.delete('/order/:id', async(req,res)=>{
            const id = req.params.id;
            const query ={_id:ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)
















app.get('/' , (req,res) =>{
    res.send('My Server is running ');
});

app.listen(port , ()=>{
    console.log('My port is :' , port);
})