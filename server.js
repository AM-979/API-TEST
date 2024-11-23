const express = require('express');
const axios = require('axios');
const app = express();
const port = 8444;

let priceData = null;  


async function fetchJbcPrice() {
  try {
    
    const headers = {
      'Transfer-Encoding': 'chunked',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, Second-Factor-Proof-Token, Client-Id, Access-Token, X-Cb-Project-Name, X-Cb-Is-Logged-In, X-Cb-Platform, X-Cb-Session-Uuid, X-Cb-Pagekey, X-Cb-UJS, Fingerprint-Tokens, X-Cb-Device-Id, X-Cb-Version-Name',
      'Access-Control-Allow-Methods': 'GET,POST'
    };

 
    const response = await axios.get('https://api.jibswap.com/api/v1/jbc_price/', { headers });
    const jbcPriceUSD = parseFloat(response.data.jbc_price);


    const forexResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', { headers });
    const rates = forexResponse.data.rates;

    const eurRate = rates.EUR; 
    const thbRate = rates.THB;

    priceData = {
      data: {
        currency: "JBC",
        rates: {
          USD: jbcPriceUSD.toString(),
          JBC: "1.0",
          USDT: jbcPriceUSD.toString(),
          EUR: (jbcPriceUSD * eurRate).toString(),
          THB: (jbcPriceUSD * thbRate).toString()
        }
      }
    };

    console.log("Data updated successfully");
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


fetchJbcPrice();

setInterval(fetchJbcPrice, 10 * 60 * 1000); 

// Route สำหรับเรียก API
app.get('/api/exchange-rates', async (req, res) => {
  if (priceData) {
    res.json(priceData);  // ส่งข้อมูลล่าสุด
  } else {
    res.status(500).json({ error: 'Data not available' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
