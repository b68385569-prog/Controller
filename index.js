const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// --- Simple Dashboard ---
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#000; color:#00ffcc; font-family:sans-serif; text-align:center; padding:20px;">
            <div style="max-width:400px; margin:auto; border:1px solid #00ffcc; padding:20px; border-radius:10px;">
                <h2>🚀 GHOST V11.2 (FIXED)</h2>
                <input id="mId" placeholder="MARKET ID" style="width:90%; padding:10px; margin:5px; background:#111; color:#fff; border:1px solid #333;">
                <input id="sId" placeholder="SELECTION ID" style="width:90%; padding:10px; margin:5px; background:#111; color:#fff; border:1px solid #333;">
                <input id="cookie" placeholder="COOKIE" style="width:90%; padding:10px; margin:5px; background:#111; color:#fff; border:1px solid #333;">
                
                <div style="margin:15px 0;">
                    <label>ODDS: 100 | STAKE: 500</label>
                </div>

                <button id="btn" onclick="start()" style="width:100%; padding:15px; background:#00ffcc; color:#000; font-weight:bold; border:none; border-radius:5px; cursor:pointer;">ACTIVATE 11s</button>
                <p id="status" style="color:#ffcc00; margin-top:15px;">READY</p>
                <h1 id="timer" style="color:#ff4d4d; display:none;">11</h1>
            </div>

            <script>
                async function start() {
                    const mId = document.getElementById('mId').value;
                    const sId = document.getElementById('sId').value;
                    if(!mId || !sId) return alert("IDs dalo bhai!");

                    document.getElementById('btn').disabled = true;
                    document.getElementById('status').innerText = "INJECTING...";
                    
                    try {
                        const res = await fetch('/execute', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                mId, sId, 
                                cookie: document.getElementById('cookie').value,
                                price: 100, 
                                stake: 500
                            })
                        });
                        const data = await res.json();
                        document.getElementById('status').innerText = data.s ? "SENT!" : "FAILED";
                    } catch(e) { document.getElementById('status').innerText = "OFFLINE"; }

                    document.getElementById('timer').style.display = "block";
                    let t = 11;
                    let c = setInterval(() => {
                        t--; document.getElementById('timer').innerText = t;
                        if(t<=0) { clearInterval(c); location.reload(); }
                    }, 1000);
                }
            </script>
        </body>
    `);
});

// --- Simple Backend ---
app.post('/execute', async (req, res) => {
    try {
        const { mId, sId, cookie, price, stake } = req.body;
        const url = \`https://alidata.wizardnew.com/api/MatchOdds/GetOddslite/4/\${mId}/\${sId}\`;
        
        await axios.get(url, {
            headers: { 'cookie': cookie || '', 'referer': 'https://wizardnew.com/' },
            params: { odds: price, stake: stake },
            timeout: 4000
        });
        res.json({ s: 1 });
    } catch (err) {
        res.json({ s: 0 });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server Running on ' + PORT));
