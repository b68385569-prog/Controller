const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

// 1. Dashboard UI (Frontend)
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#050505; color:#fff; font-family:sans-serif; text-align:center; padding:20px;">
            <div style="max-width:420px; margin:auto; background:#111; padding:25px; border:2px solid #00ffcc; border-radius:15px;">
                <h1 style="color:#00ffcc;">🎯 SNIPER v5.5</h1>
                <input id="cookie" placeholder="COOKIE" style="width:100%; padding:12px; margin:5px 0; background:#222; border:1px solid #333; color:#fff; border-radius:5px;">
                <input id="api" placeholder="OPTIONAL API (F12 LINK)" style="width:100%; padding:12px; margin:5px 0; background:#222; border:1px solid #333; color:#fff; border-radius:5px; font-size:11px;">
                <div style="display:flex; gap:10px; margin:10px 0;">
                    <input id="mId" placeholder="MARKET ID" style="width:50%; padding:12px; background:#222; border:1px solid #444; color:#fff; border-radius:5px;">
                    <input id="sId" placeholder="SELECTION ID" style="width:50%; padding:12px; background:#222; border:1px solid #444; color:#fff; border-radius:5px;">
                </div>
                <div style="display:flex; gap:10px; margin:15px 0;">
                    <div style="width:50%;">
                        <label style="font-size:11px; color:#00ffcc;">ODDS</label>
                        <input id="price" type="number" value="100" style="width:100%; padding:15px; background:#1a1a1a; border:2px solid #00ffcc; color:#fff; border-radius:10px; font-weight:bold; font-size:20px; text-align:center;">
                    </div>
                    <div style="width:50%;">
                        <label style="font-size:11px; color:#ffcc00;">STAKE</label>
                        <input id="stake" type="number" value="500" style="width:100%; padding:15px; background:#1a1a1a; border:2px solid #ffcc00; color:#fff; border-radius:10px; font-weight:bold; font-size:20px; text-align:center;">
                    </div>
                </div>
                <div id="status" style="padding:10px; color:#00ff00; font-weight:bold;">READY</div>
                <button id="btn" onclick="fire()" style="width:100%; background:#00ffcc; color:#000; border:none; padding:20px; cursor:pointer; font-weight:bold; border-radius:10px; font-size:22px;">FORCE BET (11s)</button>
            </div>
            <script>
                async function fire() {
                    document.getElementById('btn').disabled = true;
                    document.getElementById('status').innerText = "INJECTING...";
                    try {
                        const res = await fetch('/execute', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                cookie: document.getElementById('cookie').value,
                                customApi: document.getElementById('api').value,
                                marketId: document.getElementById('mId').value,
                                selectionId: document.getElementById('sId').value,
                                price: document.getElementById('price').value,
                                stake: document.getElementById('stake').value
                            })
                        });
                        const data = await res.json();
                        document.getElementById('status').innerText = data.s ? "SUCCESS" : "ERROR: " + data.error;
                    } catch(e) { document.getElementById('status').innerText = "FAILED"; }
                    setTimeout(() => { location.reload(); }, 11000);
                }
            </script>
        </body>
    `);
});

// 2. Execution Logic (Jo aapke screenshot mein tha)
app.post('/execute', async (req, res) => {
    try {
        const { customApi, cookie, marketId, selectionId, price, stake } = req.body;
        let finalUrl = customApi || "https://alidata.wizardnew.com/api/MatchOdds/GetOddslite/4/" + marketId + "/" + selectionId;
        
        const response = await axios.get(finalUrl, {
            headers: {
                'authority': 'alidata.wizardnew.com',
                'cookie': cookie,
                'referer': 'https://wizardnew.com/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest'
            },
            params: { odds: price, stake: stake },
            timeout: 6000
        });
        res.json({ s: 1 });
    } catch (err) {
        res.status(200).json({ s: 0, error: err.response ? "Status " + err.response.status : err.message });
    }
});

// 3. Railway Port Fix (Sabse Zaroori)
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log('Sniper Live on ' + PORT));
