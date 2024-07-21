import styles from './CoinDetails.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchCoinDetails, fetchCoinHistoricalData } from '../lib/api';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const CoinDetails = () => {
  const router = useRouter();
  const { coinId } = router.query;
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCoinDetails = async () => {
      try {
        const data = await fetchCoinDetails(coinId);
        setCoin(data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    if (coinId) {
      getCoinDetails();
      fetchHistoricalData();
    }
  }, [coinId]);

  const fetchHistoricalData = async () => {
    try {
      const historicalData = await fetchCoinHistoricalData(coinId);
      const labels = historicalData.prices.map(price => new Date(price[0]).toLocaleDateString());
      const data = historicalData.prices.map(price => price[1]);

      setChartData({
        labels,
        datasets: [
          {
            label: `${coin ? coin.name : ''} Price`,
            data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          },
        ],
      });
    } catch (err) {
      console.error('Error fetching historical data:', err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (coinId) {
        fetchHistoricalData();
      }
    }, 60000); // Fetch data every minute

    return () => clearInterval(interval);
  }, [coinId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.details}>
      <h1>{coin.name}</h1>
      <div className={styles.header}>
        <img src={coin.image.large} alt={coin.name} className={styles.coinImage} />
        <div className={styles.price}>
          <p>Price: ${coin.market_data.current_price.usd.toLocaleString()}</p>
          <p>
            24h Change: <span style={{ color: coin.market_data.price_change_percentage_24h > 0 ? 'green' : 'red' }}>
              {coin.market_data.price_change_percentage_24h.toFixed(2)}%
            </span>
          </p>
        </div>
      </div>
      <div className={styles.chart}>
        <Line data={chartData} />
      </div>

      <h2 className={styles.statHeading}>Statistics</h2>

      <div className={styles.statistics}>
        
        <ul>
          <div className={styles.liBoxes}>
          <li>Market Cap: <span className={styles.numbers} >${coin.market_data.market_cap.usd.toLocaleString()} </span></li>
          </div>
          <div className={styles.liBoxes}>
          <li>Circulating Supply: <span className={styles.numbers} >{coin.market_data.circulating_supply.toLocaleString()} </span></li> </div>
          <div className={styles.liBoxes}><li>Total Supply: <span className={styles.numbers} >{coin.market_data.total_supply ? coin.market_data.total_supply.toLocaleString() : 'N/A'} </span> </li></div>
          <div className={styles.liBoxes}><li>Max Supply: <span className={styles.numbers} >{coin.market_data.max_supply ? coin.market_data.max_supply.toLocaleString() : 'N/A'} </span> </li></div>
          <div className={styles.liBoxes}><li>24h Trading Volume: <span className={styles.numbers} >${coin.market_data.total_volume.usd.toLocaleString()} </span></li></div>
          <div className={styles.liBoxes}><li>All-Time High: <span className={styles.numbers} >${coin.market_data.ath.usd.toLocaleString()} </span> on <span className={styles.numbers} >{new Date(coin.market_data.ath_date.usd).toLocaleDateString()} </span></li></div>
          <div className={styles.liBoxes}><li>All-Time Low: <span className={styles.numbers} >${coin.market_data.atl.usd.toLocaleString()}</span> on <span className={styles.numbers} >{new Date(coin.market_data.atl_date.usd).toLocaleDateString()}</span></li></div>
        </ul>
      </div>
      <div className={styles.description}>
        <h2>About {coin.name}</h2>
        <p dangerouslySetInnerHTML={{ __html: coin.description.en }} />
      </div>
    </div>
  );
};

export default CoinDetails;
