const express = require('express');
const cors = require('cors'); // Standard CORS middleware
const app = express();

app.use(cors());
// Parse incoming JSON bodies so we can forward them if needed
app.use(express.json());

// Handle ALL requests (*)
app.all('*', async (req, res) => {
    // 1. Construct the target URL (Binance) using the incoming path and query
    const targetUrl = 'https://api.binance.com' + req.originalUrl;
    
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);

    try {
        // 2. Build the Headers for Binance (Clean Slate)
        const binanceHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // If the bot sent an API Key, pass it through.
        // We do NOT pass 'x-forwarded-for' or 'via'.
        if (req.headers['x-mbx-apikey']) {
            binanceHeaders['X-MBX-APIKEY'] = req.headers['x-mbx-apikey'];
        }

        // 3. Perform the Manual Fetch to Binance
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: binanceHeaders,
            // Only attach body for POST/DELETE/PUT
            body: (req.method !== 'GET' && req.method !== 'HEAD') ? JSON.stringify(req.body) : undefined
        });

        // 4. Get the text response
        const data = await response.text();
        
        console.log(`Binance responded: ${response.status}`);

        // 5. Send it back to Google
        res.status(response.status).send(data);

    } catch (e) {
        console.error("Relay Error:", e.message);
        res.status(500).send({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EU Manual Relay active on port ${PORT}`));
