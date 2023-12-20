require(`dotenv`).config();

const connectDB = require(`./db/connect`);
const product = require(`./models/product`);

const jsonProduct = require(`./products.json`);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await product.deleteMany(); //  remove all the previous products
        await product.create(jsonProduct);
        console.log(`Success!!!`);
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

start();