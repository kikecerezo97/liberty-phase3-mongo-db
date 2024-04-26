const express = require('express');
const path = require('path');  // for handling file paths
const bodyParser = require('body-parser');
const da = require("./data-access");

const app = express();
const port = process.env.PORT || 4000;  // use env var or default to 4000


function checkApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key']; // Assuming the API key is sent in the header named 'x-api-key'

    // Check if API key is present
    if (!apiKey) {
        return res.status(401).json({ message: 'Unauthorized: Missing API key' });
    }

    // Compare the received key with the stored key (from environment variable or configuration file)
    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ message: 'Forbidden: Invalid API key' });
    }

    // If valid key, continue processing the request
    next();
}

app.use(bodyParser.json());

// Set the static directory to serve files from
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log("staticDir: " + staticDir);
    console.log('APIKEY  is ' + process.env.API_KEY);
});

app.get("/customers",checkApiKey, async (req, res) => {

    const [cust, err] = await da.getCustomers();
    if(cust){
        res.send(cust);
    }else{
        res.status(500);
        res.send(err);
    }
});

app.get("/reset", async (req, res) => {
    const [result, err] = await da.resetCustomers();
    if(result){
        res.send(result);
    }else{
        res.status(500);
        res.send(err);
    }
});

app.post('/customers', async (req, res) => {
    const newCustomer = req.body;
    if (newCustomer === null) {
        res.status(400);
        res.send("missing request body");
    } else {
        // return array format [status, id, errMessage]
        const [status, id, errMessage] = await da.addCustomer(newCustomer);
        if (status === "success") {
            res.status(201);
            let response = { ...newCustomer };
            response["_id"] = id;
            res.send(response);
        } else {
            res.status(400);
            res.send(errMessage);
        }
    }
});

app.get("/customers/:id", async (req, res) => {
    const id = req.params.id;
    // return array [customer, errMessage]
    const [cust, err] = await da.getCustomerById(id);
    if(cust){
        res.send(cust);
    }else{
        res.status(404);
        res.send(err);
    }
});

app.put('/customers/:id', async (req, res) => {
    const id = req.params.id;
    const updatedCustomer = req.body;
    if (updatedCustomer === null) {
        res.status(400);
        res.send("missing request body");
    } else {
        delete updatedCustomer._id;
        // return array format [message, errMessage]
        const [message, errMessage] = await da.updateCustomer(updatedCustomer);
        if (message) {
            res.send(message);
        } else {
            res.status(400);
            res.send(errMessage);
        }
    }
});

app.delete("/customers/:id", async (req, res) => {
    const id = req.params.id;
    // return array [message, errMessage]
    const [message, errMessage] = await da.deleteCustomerById(id);
    if (message) {
        res.send(message);
    } else {
        res.status(404);
        res.send(errMessage);
    }
});