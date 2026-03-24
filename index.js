const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

// --- Sniper Dashboard v5.0 ---
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#000; color:#fff; font-family:sans-serif; text-align:center; padding:20px;">
            <div style="max-width:420px; margin:auto; background:#111; padding:25px; border:2px solid #00ffcc; border-radius:15px; box-shadow: 0 0 20px rgba(0,255,204,0.2);">
                <h1 style="color:#00ffcc; letter-spacing:1px; margin-bottom:5px;">🎯 SNIPER v5.0</h1>
                <p style="color:#666; font-size:10px; margin-bottom:20px;">MANUAL RATE • OPTIONAL API • 11s KILL</p>
                
                <input id="api" placeholder="OPTIONAL API URL (Keep empty for Default)" style="width:100%; padding:12px; margin:5px 0; background:#222; border:1px solid #333; color:#fff; border-radius:5px; font-size:12px;">
                <input id="cookie" placeholder="COOKIE (ASP.NET_SessionId)" style="width:100%; padding:12px; margin:5px 0; background:#222; border:1px solid #333; color:#fff; border-radius:5px;">
                
                <div style="display:flex; gap:10px; margin:5px 0;">
                    <input id="mId" placeholder="MARKET ID" style="width:60%; padding:12px; background:#222; border:1px solid #333; color:#fff; border-radius:5px;">
                    <input id="price" type="number" value="100" style="width:40%; padding:12px; background:#222; border:2px solid #00ffcc; color:#fff; border-radius:5px; font-weight:bold; text-align:center;">
                </div>

                <div style="background:#1a1a1a; padding:15px; margin:15px 0; border-radius:10px; border:1px dashed #444;">
                    <div id="status" style="font-size:16px; color:#ffcc00; font-weight:bold;">READY TO TRIGGER</div>
                    <div id="timer_div" style="display:none; font-size:30px; color:#ff4d4d; font-weight:bold; margin-top:5px;">KILL: <span id="timer">11</span>s</div>
                </div>

                <button id="btn" onclick="fireShot()" style="width:100%; background:#00ffcc; color:#000; border:none; padding:18px; cursor:pointer; font-weight:bold; border-radius:8px; font-size:18px;">OPEN MARKET & FIRE (11s)</button>
            </div>

            <script>
                let isLocked = false;
                async function fireShot() {
                    if(isLocked) return;
                    isLocked = true;
                    
                    const btn = document.getElementById('btn');
                    const status = document.getElementById('status');
                    const timerDiv = document.getElementById('timer_div');

                    btn.disabled = true;
                    btn.style.background = "#333";
                    btn.innerText = "WINDOW ACTIVE";
                    timerDiv.style.display = "block";
                    status.innerText = "INJECTING DATA...";

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
                        status.innerText = "HIT SENT AT RATE: " + document.getElementById('price').value;
                    } catch(e) {
                        status.innerText = "FETCH ERROR";
                    }

                    let timeLeft = 11;
                    let countdown = setInterval(() => {
                        timeLeft--;
                        document.getElementById('timer').innerText = timeLeft;
                        if(timeLeft <= 0) {
                            clearInterval(countdown);
                            status.innerText = "WINDOW KILLED / EXPIRED";
                            status.style.color = "#ff4d4d";
                            btn.innerText = "REFRESH TO RESET";
                        }
                    }, 1000);
                }
            </script>
        </body>
    `);
});

// --- Server-Side Logic ---
app.post('/execute', async (req, res) => {
    try {
        const { customApi, cookie, marketId, price } = req.body;
        // Agar Optional API khali hai toh Default use karega
        const finalUrl = customApi || \`https://alidata.wizardnew.com/api/MatchOdds/GetOddslite/4/\${marketId}/35401953\`;
        
        await axios.get(finalUrl, {
            headers: {
                'authority': 'alidata.wizardnew.com',
                'referer': 'https://wizardnew.com/',
                'cookie': cookie,
                'x-requested-with': 'XMLHttpRequest',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            },
            params: { odds: price }, // Manipulated Rate
            timeout: 5000
        });
        res.status(200).json({ s: 1 });
    } catch (error) {
        res.status(200).json({ s: 0 });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log('Sniper v5.0 Live on Port ' + PORT));
