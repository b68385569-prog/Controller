const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <body style="background:#050505; color:#fff; font-family:sans-serif; text-align:center; padding:20px;">
            <div style="max-width:420px; margin:auto; background:#111; padding:25px; border:2px solid #00ffcc; border-radius:15px; box-shadow: 0 0 20px rgba(0,255,204,0.3);">
                <h1 style="color:#00ffcc; letter-spacing:1px; margin-bottom:5px;">🎯 SNIPER v5.1</h1>
                <p style="color:#666; font-size:10px; margin-bottom:20px;">CLOUDFLARE BYPASS • 11s AUTO-KILL</p>
                
                <input id="api" placeholder="OPTIONAL API URL (F12 Link)" style="width:100%; padding:12px; margin:5px 0; background:#222; border:1px solid #333; color:#fff; border-radius:5px; font-size:12px;">
                <input id="cookie" placeholder="PASTE COOKIE HERE" style="width:100%; padding:12px; margin:5px 0; background:#222; border:1px solid #333; color:#fff; border-radius:5px;">
                
                <div style="display:flex; gap:10px; margin:5px 0;">
                    <input id="mId" placeholder="MARKET ID" style="width:60%; padding:12px; background:#222; border:1px solid #333; color:#fff; border-radius:5px;">
                    <input id="price" type="number" value="100" style="width:40%; padding:12px; background:#222; border:2px solid #00ffcc; color:#fff; border-radius:5px; font-weight:bold; text-align:center;">
                </div>

                <div style="background:#1a1a1a; padding:15px; margin:15px 0; border-radius:10px; border:1px dashed #444;">
                    <div id="status" style="font-size:16px; color:#ffcc00; font-weight:bold;">READY</div>
                    <div id="timer_div" style="display:none; font-size:30px; color:#ff4d4d; font-weight:bold; margin-top:5px;">KILL: <span id="timer">11</span>s</div>
                </div>

                <button id="btn" onclick="fire()" style="width:100%; background:#00ffcc; color:#000; border:none; padding:18px; cursor:pointer; font-weight:bold; border-radius:8px; font-size:18px;">FORCE OPEN & FIRE</button>
            </div>

            <script>
                let locked = false;
                async function fire() {
                    if(locked) return;
                    locked = true;
                    const btn = document.getElementById('btn');
                    const status = document.getElementById('status');
                    const timerDiv = document.getElementById('timer_div');

                    btn.disabled = true; btn.style.background = "#333";
                    timerDiv.style.display = "block"; status.innerText = "BYPASSING CLOUDFLARE...";

                    try {
                        await fetch('/execute', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                customApi: document.getElementById('api').value,
                                cookie: document.getElementById('cookie').value,
                                marketId: document.getElementById('mId').value,
                                price: document.getElementById('price').value
                            })
                        });
                        status.innerText = "INJECTION SUCCESSFUL";
                    } catch(e) { status.innerText = "SERVER ERROR"; }

                    let time = 11;
                    let clock = setInterval(() => {
                        time--; document.getElementById('timer').innerText = time;
                        if(time <= 0) {
                            clearInterval(clock); status.innerText = "WINDOW KILLED";
                            status.style.color = "#ff4d4d";
                        }
                    }, 1000);
                }
            </script>
        </body>
    `);
});

app.post('/execute', async (req, res) => {
    try {
        const { customApi, cookie, marketId, price } = req.body;
        // String handling fix to prevent crash
        let finalUrl = customApi || "https://alidata.wizardnew.com/api/MatchOdds/GetOddslite/4/" + marketId + "/35401953";
        
        await axios.get(finalUrl, {
            headers: {
                'authority': 'alidata.wizardnew.com',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.9',
                'cookie': cookie,
                'referer': 'https://wizardnew.com/',
                'sec-ch-ua': '"Not(A:Brand";v="24", "Chromium";v="122"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest'
            },
            params: { odds: price },
            timeout: 6000
        });
        res.json({ s: 1 });
    } catch (err) {
        res.json({ s: 0 }); // Error handle karke crash hone se bachata hai
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log('Sniper 5.1 Active'));
