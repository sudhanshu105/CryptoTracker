import axios from 'axios';

const PROXY_URL = '/api/proxy?url=';

export const fetchCoinsList = async (searchTerm) => {
    const response = await axios.get(`${PROXY_URL}${encodeURIComponent(`https://api.coingecko.com/api/v3/search?query=${searchTerm}`)}`);
    return response.data.coins.map(coin => ({
      id: coin.id,
      name: coin.name
    }));
  };

export const fetchCoinDetails = async (coinId) => {
  try {
    const response = await axios.get(`${PROXY_URL}${encodeURIComponent(`https://api.coingecko.com/api/v3/coins/${coinId}`)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for coin ${coinId}:`, error);
    return {};
  }
};

export const fetchCoins = async (page = 1, perPage = 20) => {
    try {
      const response = await axios.get(`${PROXY_URL}${encodeURIComponent(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`)}`);
      const data = response.data;
  
      if (!Array.isArray(data)) {
        throw new Error('API response is not an array');
      }
  
      return data.map(coin => ({
        id: coin.id,
        name: coin.name,
        image: coin.image,
        market_cap: coin.market_cap,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h ?? null,
      }));
    } catch (error) {
      console.error('Error fetching coins:', error);
      throw error;
    }
  };
  

export const fetchCoinHistoricalData = async (coinId) => {
  try {
    const response = await axios.get(`${PROXY_URL}${encodeURIComponent(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30&interval=daily`)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching historical data for coin ${coinId}:`, error);
    return {};
  }
};

export const fetchGlobalMarketCapData = async () => {
  try {
    const response = await axios.get(`${PROXY_URL}${encodeURIComponent('https://api.coingecko.com/api/v3/global')}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching global market cap data:', error);
    return {};
  }
};

export const fetchPublicCompaniesHoldingsBTC = async () => {
  try {
    const response = await axios.get(`${PROXY_URL}${encodeURIComponent('https://api.coingecko.com/api/v3/companies/public_treasury/bitcoin')}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching public companies holdings BTC:', error);
    return {};
  }
};

export const fetchPublicCompaniesHoldingsETH = async () => {
  try {
    const response = await axios.get(`${PROXY_URL}${encodeURIComponent('https://api.coingecko.com/api/v3/companies/public_treasury/ethereum')}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching public companies holdings ETH:', error);
    return {};
  }
};
