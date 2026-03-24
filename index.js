const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <body style="background:#000; color:#fff; font-family:sans-serif; text-align:center; padding:30px;">
            <div style="max-width:400px; margin:auto; background:#111; padding:25px; border:2px solid #00ff00; border-radius:15px; box-shadow: 0 0 20px rgba(0,255,0,0.2);">
                <h1 style="color:#00ff00; margin-bottom:5px;">🎯 SINGLE-SHOT v4.6</h1>
                <p style="color:#666; font-size:11px; margin-bottom:20px;">PRECISION INJECTION • 11s LOCK</p>
                
                <input id="api" placeholder="OPTIONAL API URL" style="width:100%; padding:12px; margin:5px 0; background:#222; border:1px solid #444; color:#fff; border-radius:5px;">
                <input id="cookie" placeholder="PASTE FRESH COOKIE" style="width:100%; padding:12px; margin:5px 0; background:#222; border:1px solid #444; color:#fff; border-radius:5px;">
                <input id="mId" placeholder="MARKET ID" style="width:100%; padding:12px; margin:5px 0; background:#222; border:1px solid #444; color:#fff; border-radius:5px;">

                <div style="background:#1a1a1a; padding:15px; margin:15px 0; border-radius:10px; border:1px dashed #333;">
                    <div id="status" style="font-size:16px; color:#ffcc00; font-weight:bold;">READY FOR SHOT</div>
                    <div id="timer_div" style="display:none; font-size:30px; color:#ff4d4d; font-weight:bold; margin-top:5px;">LOCK: <span id="timer">11</span>s</div>
                </div>

                <button id="btn" onclick="fireShot()" style="width:100%; background:#00ff00; color:#000; border:none; padding:18px; cursor:pointer; font-weight:bold; border-radius:8px; font-size:18px; transition: 0.2s;">EXECUTE SINGLE HIT</button>
            </div>
            <p style="color:#444; font-size:10px; margin-top:20px;">v4.6 Sniper Edition • Bookmaker Only</p>
            <pre id="log" style="margin-top:10px; color:#888; font-size:10px;"></pre>

            <script>
                let isLocked = false;
                let timeLeft = 11;

                async function fireShot() {
                    if(isLocked) return;

                    const btn = document.getElementById('btn');
                    const status = document.getElementById('status');
                    const timerDiv = document.getElementById('timer_div');
                    const timerText = document.getElementById('timer');

                    isLocked = true;
                    btn.disabled = true;
                    btn.style.background = "#333";
                    btn.style.color = "#666";
                    timerDiv.style.display = "block";
                    status.innerText = "INJECTING...";

                    try {
                        const response = await fetch('/execute', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                customApi: document.getElementById('api').value,
                                cookie: document.getElementById('cookie').value,
                                marketId: document.getElementById('mId').value
                            })
                        });
                        status.innerText = "HIT EXECUTED";
                    } catch(e) {
                        status.innerText = "CONNECTION ERROR";
                    }

                    let countdown = setInterval(() => {
                        timeLeft--;
                        timerText.innerText = timeLeft;
                        if(timeLeft <= 0) {
                            clearInterval(countdown);
                            isLocked = false;
                            btn.disabled = false;
                            btn.style.background = "#00ff00";
                            btn.style.color = "#000";
                            timerDiv.style.display = "none";
                            status.innerText = "READY FOR NEXT HIT";
                            timeLeft = 11;
                        }
                    }, 1000);
                }
            </script>
        </body>
    `);
});

app.post('/execute', async (req, res) => {
    const { customApi, cookie, marketId } = req.body;
    const finalApi = customApi || \`https://alidata.wizardnew.com/api/MatchOdds/GetOddslite/4/\${marketId}/35401953\`;
    
    const headers = {
        'authority': 'alidata.wizardnew.com',
        'referer': 'https://wizardnew.com/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'cookie': cookie
    };

    try {
        await axios.get(finalApi, { headers, timeout: 5000 });
        res.json({ status: "OK" });
    } catch (e) {
        res.json({ status: "FAIL" });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Sniper 4.6 Live'));
