const express = require('express');
const path = require('path');  // for handling file paths
const da = require("./data-access");

const app = express();
const port = process.env.PORT || 4000;  // use env var or default to 4000

// Set the static directory to serve files from
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log("staticDir: " + staticDir);
});

app.get("/customers", async (req, res) => {
    const cust = await da.getCustomers();
    res.send(cust);
});