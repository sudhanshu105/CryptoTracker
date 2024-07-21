import { createRouter } from 'next-connect';
import axios from 'axios';

const router = createRouter();
const cache = new Map();
const CACHE_DURATION = 60 * 1000; // Cache duration in milliseconds (1 minute)
const RETRY_DELAY = 2000; // Retry delay in milliseconds (2 seconds)
const MAX_RETRIES = 3; // Maximum number of retries

const fetchWithRetry = async (url, retries = 0) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, retries + 1);
    }
    throw error;
  }  
};

router.get(async (req, res) => {
  const { url } = req.query;
//   console.log(`Received request to proxy: ${url}`);

  if (cache.has(url)) {
    const { data, timestamp } = cache.get(url);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return res.status(200).json(data);
    } else {
      cache.delete(url);
    }
  }

  try {
    const data = await fetchWithRetry(url);
    cache.set(url, { data, timestamp: Date.now() });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router.handler();
