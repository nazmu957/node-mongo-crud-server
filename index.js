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
        
        //products server get method
        app.get('/products', async(req, res) =>{
            const query ={};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products); 
        });
         //sorting data from low price
         app.get('/products/sort', async(req, res) =>{
            const cursor = productCollection.find({}).sort({productPrice: 1})
            const sort = await cursor.toArray();
            res.send(sort);
            // console.log(sort);
         })
         //sorting data from high price
         app.get('/products/dsort', async(req, res) =>{
            const cursor = productCollection.find({}).sort({productPrice: -1})
            const dsort = await cursor.toArray();
            res.send(dsort);
            // console.log(dsort);
         })
        //specific product get method
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

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const product = req.body;
            const option = {upsert: true};
            const updatedProduct = {
                $set: {
                    productName: product.productName,
                    productPrice: product.productPrice,
                    imageLink: product.imageLink
                }
            }
            console.log(updatedProduct);
            const result = await productCollection.updateOne(filter, updatedProduct, option);
            res.send(result);
        } )
       //delete code updated
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