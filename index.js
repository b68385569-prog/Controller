const axios = require('axios');
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

// --- YE SECTION DASHBOARD DIKHAYEGA ---
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#000; color:#fff; font-family:sans-serif; text-align:center; padding:50px;">
            <h1 style="color:#ff4d4d;">🚀 MARKET DOMINATOR v4.2</h1>
            <div style="background:#111; padding:20px; border:1px solid #333; display:inline-block; border-radius:10px;">
                <input id="api" placeholder="OPTIONAL CUSTOM API" style="width:300px; padding:10px; margin:5px;"><br>
                <input id="cookie" placeholder="COOKIE ACCESS" style="width:300px; padding:10px; margin:5px;"><br>
                <input id="mId" placeholder="MARKET ID" style="width:145px; padding:10px; margin:5px;">
                <input id="sId" placeholder="SELECTION ID" style="width:145px; padding:10px; margin:5px;"><br>
                <button onclick="run()" style="background:#ff4d4d; color:#fff; border:none; padding:15px 30px; cursor:pointer; margin-top:20px; font-weight:bold;">EXECUTE INJECTION</button>
            </div>
            <pre id="log" style="margin-top:20px; color:#0f0;"></pre>
            <script>
                async function run() {
                    const log = document.getElementById('log');
                    log.innerText = "Processing...";
                    const res = await fetch('/execute', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            customApi: document.getElementById('api').value,
                            cookie: document.getElementById('cookie').value,
                            marketId: document.getElementById('mId').value,
                            selectionId: document.getElementById('sId').value
                        })
                    });
                    const data = await res.json();
                    log.innerText = JSON.stringify(data, null, 2);
                }
            </script>
        </body>
    `);
});

// --- YE SECTION ATTACK EXECUTE KAREGA ---
app.post('/execute', async (req, res) => {
    const { customApi, cookie, marketId, selectionId } = req.body;
    const finalApi = customApi || `https://alidata.wizardnew.com/api/MatchOdds/GetOddslite/4/${marketId}/35401953`;

    const headers = {
        'authority': 'alidata.wizardnew.com',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'referer': 'https://wizardnew.com/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'cookie': cookie
    };

    try {
        const response = await axios.get(finalApi, { headers });
        res.json({ status: "SUCCESS", data: response.data });
    } catch (err) {
        res.json({ status: "FAILED", error: err.message, code: err.response ? err.response.status : 404 });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server is running!'));
