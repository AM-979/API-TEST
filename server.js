const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;


async function fetchJbcPrice() {
  try {

    const response = await axios.get('https://api.jibswap.com/api/v1/jbc_price/');
    const jbcPrice = response.data.jbc_price;

    const result = {
      data: {
        currency: "JBC",
        rates: {
          USD: jbcPrice,
          USDT: jbcPrice
        }
      }
    };

    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: 'Failed to fetch data' };
  }
}


app.get('/api/jbc-price', async (req, res) => {
  const priceData = await fetchJbcPrice();
  res.json(priceData);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
