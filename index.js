const axios = require('axios');
const express = require('express');
const app = express();

app.use(express.json());

// Sniper Dashboard UI
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#000; color:#fff; font-family:sans-serif; text-align:center; padding:30px;">
            <div style="max-width:400px; margin:auto; background:#111; padding:25px; border:2px solid #00ff00; border-radius:15px; box-shadow: 0 0 20px rgba(0,255,0,0.2);">
                <h1 style="color:#00ff00; margin-bottom:5px;">🎯 SNIPER v4.6 FIXED</h1>
                <p style="color:#666; font-size:11px; margin-bottom:20px;">ONE HIT • 11s LOCK</p>
                
                <input id="api" placeholder="OPTIONAL API URL" style="width:100%; padding:12px; margin:5px 0; background:#222; border:1px solid #444; color:#fff; border-radius:5px;">
                <input id="cookie" placeholder="PASTE FRESH COOKIE" style="width:100%; padding:12px; margin:5px 0; background:#222; border:1px solid #444; color:#fff; border-radius:5px;">
                <input id="mId" placeholder="MARKET ID" style="width:100%; padding:12px; margin:5px 0; background:#222; border:1px solid #444; color:#fff; border-radius:5px;">

                <div style="background:#1a1a1a; padding:15px; margin:15px 0; border-radius:10px; border:1px dashed #333;">
                    <div id="status" style="font-size:16px; color:#ffcc00; font-weight:bold;">SYSTEM READY</div>
                    <div id="timer_div" style="display:none; font-size:30px; color:#ff4d4d; font-weight:bold; margin-top:5px;">LOCK: <span id="timer">11</span>s</div>
                </div>

                <button id="btn" onclick="fireShot()" style="width:100%; background:#00ff00; color:#000; border:none; padding:18px; cursor:pointer; font-weight:bold; border-radius:8px; font-size:18px;">EXECUTE SINGLE HIT</button>
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
                    timerDiv.style.display = "block";
                    status.innerText = "INJECTING...";

                    try {
                        await fetch('/execute', {
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
                        status.innerText = "ERROR";
                    }

                    let timeLeft = 11;
                    let countdown = setInterval(() => {
                        timeLeft--;
                        document.getElementById('timer').innerText = timeLeft;
                        if(timeLeft <= 0) {
                            clearInterval(countdown);
                            isLocked = false;
                            btn.disabled = false;
                            btn.style.background = "#00ff00";
                            timerDiv.style.display = "none";
                            status.innerText = "READY FOR NEXT HIT";
                        }
                    }, 1000);
                }
            </script>
        </body>
    `);
});

// Injection Engine
app.post('/execute', async (req, res) => {
    try {
        const { customApi, cookie, marketId } = req.body;
        const finalApi = customApi || `https://alidata.wizardnew.com/api/MatchOdds/GetOddslite/4/${marketId}/35401953`;
        
        await axios.get(finalApi, {
            headers: {
                'authority': 'alidata.wizardnew.com',
                'referer': 'https://wizardnew.com/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'cookie': cookie
            },
            timeout: 5000
        });
        res.status(200).json({ status: "OK" });
    } catch (error) {
        res.status(200).json({ status: "FAIL" }); // Error par bhi crash nahi hoga
    }
});

// Railway Fix: Listen on 0.0.0.0 and dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sniper v4.6 is running on port ${PORT}`);
});
