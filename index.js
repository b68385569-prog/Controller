const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('<html><body style="background:#000;color:#0f0;text-align:center;padding:50px;">' +
        '<h1>GHOST V11.4 LIVE</h1>' +
        '<div style="border:1px solid #0f0;padding:20px;display:inline-block;border-radius:10px;">' +
        '<input id="m" placeholder="Market ID" style="display:block;margin:10px auto;padding:10px;width:250px;">' +
        '<input id="s" placeholder="Selection ID" style="display:block;margin:10px auto;padding:10px;width:250px;">' +
        '<input id="c" placeholder="Cookie" style="display:block;margin:10px auto;padding:10px;width:250px;">' +
        '<button onclick="run()" style="padding:15px;width:100%;background:#0f0;font-weight:bold;cursor:pointer;">START 11s GHOST</button>' +
        '<h2 id="st">READY</h2>' +
        '</div>' +
        '<script>' +
        'async function run(){' +
        'const m=document.getElementById("m").value;' +
        'const s=document.getElementById("s").value;' +
        'const c=document.getElementById("c").value;' +
        'if(!m||!s) return alert("IDs dalo!");' +
        'document.getElementById("st").innerText="INJECTING...";' +
        'try {' +
        'await fetch("/execute",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({m,s,c})});' +
        'document.getElementById("st").innerText="SENT!";' +
        '} catch(e){document.getElementById("st").innerText="ERROR";}' +
        'setTimeout(()=>location.reload(), 11000);' +
        '}' +
        '</script></body></html>');
});

app.post('/execute', async (req, res) => {
    try {
        const { m, s, c } = req.body;
        const target = "https://alidata.wizardnew.com/api/MatchOdds/GetOddslite/4/" + m + "/" + s;
        await axios.get(target, {
            headers: { 'cookie': c || '', 'referer': 'https://wizardnew.com/' },
            params: { odds: 100, stake: 500 },
            timeout: 5000
        });
        res.json({ s: 1 });
    } catch (e) {
        res.json({ s: 0 });
    }
});

app.listen(process.env.PORT || 8080);
