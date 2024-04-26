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

module.exports = {checkApiKey};