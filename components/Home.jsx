import styles from './Home.module.css';
import CoinList from './CoinList';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoinsStart, fetchCoinsSuccess, fetchCoinsFailure } from '../store/coinSlice';
import { fetchCoins } from '../lib/api';

const Home = () => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coin.coins);
  const loading = useSelector((state) => state.coin.loading);
  const error = useSelector((state) => state.coin.error);

  useEffect(() => {
    const getCoins = async () => {
      dispatch(fetchCoinsStart());
      try {
        const data = await fetchCoins();
        dispatch(fetchCoinsSuccess(data));
      } catch (err) {
        dispatch(fetchCoinsFailure(err.toString()));
      }
    };
    getCoins();
  }, [dispatch]);

  return (
    <div className={styles.container}>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className={styles.chart}>
        {/* Placeholder for Global Market Cap Chart */}
      </div>
      <div className={styles.list}>
        <CoinList coins={coins} />
      </div>
    </div>
  );
};

export default Home;
