const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

// --- DASHBOARD UI ---
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#0a0a0a; color:#eee; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align:center; padding:30px;">
            <div style="max-width:500px; margin:auto; background:#161616; padding:30px; border-radius:15px; border: 1px solid #333; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <h1 style="color:#ff4d4d; margin-bottom:10px;">⚡ DOMINATOR v4.3</h1>
                <p style="color:#888; font-size:12px; margin-bottom:25px;">GLOBAL AUTO-INJECTION SYSTEM</p>
                
                <input id="api" placeholder="OPTIONAL CUSTOM API URL" style="width:100%; padding:12px; margin:8px 0; background:#222; border:1px solid #444; color:#fff; border-radius:5px;">
                <input id="cookie" placeholder="PASTE FRESH COOKIE HERE" style="width:100%; padding:12px; margin:8px 0; background:#222; border:1px solid #444; color:#fff; border-radius:5px;">
                <div style="display:flex; gap:10px;">
                    <input id="mId" placeholder="MARKET ID" style="width:50%; padding:12px; margin:8px 0; background:#222; border:1px solid #444; color:#fff; border-radius:5px;">
                    <input id="sId" placeholder="SELECTION ID" style="width:50%; padding:12px; margin:8px 0; background:#222; border:1px solid #444; color:#fff; border-radius:5px;">
                </div>

                <div style="background:#222; padding:15px; margin:20px 0; border-radius:8px;">
                    <div style="font-size:14px; color:#aaa;">STATUS: <span id="status" style="color:#ffcc00; font-weight:bold;">READY</span></div>
                    <div style="font-size:24px; margin-top:5px;">NEXT HIT: <span id="timer" style="color:#00ff00;">11</span>s</div>
                </div>

                <button id="btn" onclick="toggleAuto()" style="width:100%; background:#ff4d4d; color:#fff; border:none; padding:15px; cursor:pointer; font-weight:bold; border-radius:5px; font-size:16px; transition:0.3s;">START AUTO-TIMER (11s)</button>
                
                <pre id="log" style="margin-top:20px; background:#000; color:#0f0; padding:10px; font-size:11px; text-align:left; border-radius:5px; max-height:150px; overflow-y:auto; border:1px solid #333;"></pre>
            </div>

            <script>
                let isRunning = false;
                let timeLeft = 11;
                let interval;

                async function run() {
                    const status = document.getElementById('status');
                    const log = document.getElementById('log');
                    status.innerText = "INJECTING...";
                    status.style.color = "#00ffff";

                    try {
                        const response = await fetch('/execute', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                customApi: document.getElementById('api').value,
                                cookie: document.getElementById('cookie').value,
                                marketId: document.getElementById('mId').value,
                                selectionId: document.getElementById('sId').value
                            })
                        });
                        const resData = await response.json();
                        log.innerText = "[" + new Date().toLocaleTimeString() + "] " + (resData.status === "SUCCESS" ? "HIT OK" : "ERROR");
                        if(resData.data) log.innerText += "\\nData: " + JSON.stringify(resData.data).substring(0,100) + "...";
                        
                        status.innerText = resData.status;
                        status.style.color = resData.status === "SUCCESS" ? "#00ff00" : "#ff4d4d";
                    } catch(e) {
                        status.innerText = "SERVER ERROR";
                        status.style.color = "#ff4d4d";
                    }
                }

                function toggleAuto() {
                    const btn = document.getElementById('btn');
                    if(!isRunning) {
                        isRunning = true;
                        btn.innerText = "STOP AUTO-INJECTION";
                        btn.style.background = "#444";
                        run(); 
                        interval = setInterval(() => {
                            timeLeft--;
                            document.getElementById('timer').innerText = timeLeft;
                            if(timeLeft <= 0) {
                                timeLeft = 11;
                                run();
                            }
                        }, 1000);
                    } else {
                        isRunning = false;
                        btn.innerText = "START AUTO-TIMER (11s)";
                        btn.style.background = "#ff4d4d";
                        clearInterval(interval);
                        timeLeft = 11;
                        document.getElementById('timer').innerText = timeLeft;
                        document.getElementById('status').innerText = "STOPPED";
                    }
                }
            </script>
        </body>
    `);
});

// --- INJECTION ENGINE ---
app.post('/execute', async (req, res) => {
    const { customApi, cookie, marketId, selectionId } = req.body;
    
    // Default API Logic for Wizardnew
    const finalApi = customApi || `https://alidata.wizardnew.com/api/MatchOdds/GetOddslite/4/${marketId}/35401953`;

    const headers = {
        'authority': 'alidata.wizardnew.com',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'referer': 'https://wizardnew.com/',
        'origin': 'https://wizardnew.com',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',
        'cookie': cookie
    };

    try {
        const response = await axios.get(finalApi, { headers, timeout: 7000 });
        res.json({ status: "SUCCESS", data: response.data });
    } catch (err) {
        res.json({ status: "FAILED", error: err.message, code: err.response ? err.response.status : 500 });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('v4.3 Global Active!'));
