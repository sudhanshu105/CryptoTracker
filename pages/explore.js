import Head from 'next/head';
import Header from '../components/Header';
import CoinList from '../components/CoinList';
import Watchlist from '../components/Watchlist';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoinsStart, fetchCoinsSuccess, fetchCoinsFailure, setPage } from '../store/coinSlice';
import { fetchCoins } from '../lib/api';
import styles from './Explore.module.css';

const Explore = () => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coin.coins);
  const loading = useSelector((state) => state.coin.loading);
  const error = useSelector((state) => state.coin.error);
  const page = useSelector((state) => state.coin.page);
  const totalPages = 10;
  const [watchlist, setWatchlist] = useState([]);

  const addCoinToWatchlist = (coin) => {
    let isNewCoin = false;
    setWatchlist((prevWatchlist) => {
      if (!prevWatchlist.find((c) => c.id === coin.id)) {
        isNewCoin = true;
        return [...prevWatchlist, coin];
      }
      return prevWatchlist;
    });
    return isNewCoin;
  };

  useEffect(() => {
    const getCoins = async () => {
      dispatch(fetchCoinsStart());
      try {
        const data = await fetchCoins(page);
        dispatch(fetchCoinsSuccess({ coins: data }));
      } catch (err) {
        dispatch(fetchCoinsFailure(err.toString()));
      }
    };
    getCoins();
  }, [dispatch, page]);

  const handlePageClick = (pageNum) => {
    dispatch(setPage(pageNum));
  };

  return (
    <>
      <Head>
        <title>CryptoTracker</title>
      </Head>
      <Header />
      <div className={styles.outer}>
        <div className={styles.container}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <CoinList coins={coins} addCoinToWatchlist={addCoinToWatchlist} />
          )}
          <div className={styles.pagination}>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`${styles.pageButton} ${page === index + 1 ? styles.active : ''}`}
                onClick={() => handlePageClick(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <Watchlist watchlist={watchlist} addCoinToWatchlist={addCoinToWatchlist} />
      </div>
    </>
  );
};

export default Explore;
