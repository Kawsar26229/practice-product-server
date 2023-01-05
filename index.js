const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

// MongoDB Connected
/**
 * dbName: dbUser3
 * dbPassword: TUxF9txgbWZXIkRD
 */

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =
  'mongodb+srv://dbUser3:TUxF9txgbWZXIkRD@cluster0.271e7ea.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productCollection = client.db('productCrud').collection('products');
    app.get('/products', async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });
    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const product = req.body;
      const options = { upsert: true };
      const updatedProduct = {
        $set: {
          title: product.title,
          description: product.description,
          price: product.price,
          stock: product.stock,
          thumbnail: product.thumbnail,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedProduct,
        options
      );
      res.send(result);
    });
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => {
  console.log(error);
});

app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.listen(port, () => {
  console.log(`Listening on the port ${port}`);
});
