const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());







const uri = "mongodb+srv://dbUser2:vv2fcT1cv7Q7HsAr@cluster0.rpi3hpm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        
        const productCollection = client.db('gadgetDevice').collection('products');
        
        app.get('/products', async(req, res) =>{
            const query ={};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products); 
        });
        app.get('/products/:id', async(req, res) =>{
            const id = req.params.id;
            const query= { _id: new ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        app.post('/products', async(req, res) =>{
            const product = req.body;
            console.log(product);
            const result = await productCollection.insertOne(product);
            res.send(result);
        });

        app.delete('/products/:id', async(req, res) =>{
            const id = req.params.id;
            
            const query = {_id: new ObjectId(id)}
            const result = await productCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })
        

    }
    finally{

    }
}
run().catch(err => console.log(err))



app.get('/', (req, res) =>{
    res.send('hello from node mongo crud server');

})

// app.get('/mobiles', async(req, res) => {
//     try {
//             const mobiles = await mobiles.find();
//             if(mobiles){
//                 res.status(200).send(mobiles);
//             }
//             else {
//                 res.status(404).send({
//                     message:"product not found",
//                 })
//     } 
//     }
//     catch (error) {
//         res.status(500).send({ message: error.message});
//     }
// })

app.listen(port, () =>{
    console.log(`Listen to port ${port}`);
})