const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

app.post('/execute', async (req, res) => {
    // Dashboard se aane wala data
    const { customApi, cookie, marketId, selectionId, stake } = req.body;

    // Wizardnew/Darkexch ke liye 'Default API' agar optional khali ho toh
    const finalApi = customApi || `https://alidata.wizardnew.com/api/MatchOdds/GetOddslite/4/${marketId}/35401953`;

    const headers = {
        'authority': 'alidata.wizardnew.com',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'origin': 'https://darkexch9.com',
        'referer': 'https://darkexch9.com/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'x-requested-with': 'XMLHttpRequest',
        'cookie': cookie // Yahan dashboard wali fresh cookie jayegi
    };

    try {
        console.log("Hitting API:", finalApi);
        
        const response = await axios.get(finalApi, { headers, timeout: 5000 });
        
        res.status(200).json({
            status: "SUCCESS",
            message: "Injection Active",
            market: marketId,
            apiUsed: finalApi,
            data: response.data
        });

    } catch (error) {
        console.error("Error Status:", error.response ? error.response.status : "No Response");
        
        res.status(error.response ? error.response.status : 500).json({
            status: "FAILED",
            error: error.message,
            code: error.response ? error.response.status : 404,
            hint: "Check if Cookie is fresh or IP is blocked"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`v4.2 Wizard Server Live on Port ${PORT}`));
