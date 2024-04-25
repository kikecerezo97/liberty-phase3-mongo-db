const MongoClient = require('mongodb').MongoClient;
const dbName = 'custdb';
const baseUrl = "mongodb://127.0.0.1:27017";
const collectionName = "customers"
const connectString = baseUrl + "/" + dbName;
let collection;

async function dbStartup() {
    const client = new MongoClient(connectString);
    await client.connect();
    collection = client.db(dbName).collection(collectionName);
}

async function getCustomers() {
    try {
        const customerData = await collection.find().toArray();
        //throw {"message":"an error occured"};
        return [customerData, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }

}

dbStartup();
module.exports = { getCustomers };