import { useDrop } from 'react-dnd';
import { useState } from 'react';
import Confetti from 'react-confetti';
import styles from './Watchlist.module.css';

const Watchlist = ({ watchlist, addCoinToWatchlist }) => {
  const [confetti, setConfetti] = useState(false);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'coin',
    drop: (item) => {
      const isNewCoin = addCoinToWatchlist(item);
      if (isNewCoin) {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 4000); // Show confetti for 4 seconds
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className={`${styles.watchlist} ${isOver ? styles.isOver : ''}`}>
      <h2>Watchlist</h2>
      <div className={styles.headerRow}>
        <span className={styles.headerCell}>Coin Name</span>
        <span className={styles.headerCell}>24h Change</span>
      </div>
      {watchlist.length === 0 ? (
        <p>No coins in watchlist</p>
      ) : (
        watchlist.map((coin) => (
          <div key={coin.id} className={styles.coinRow}>
            {confetti && <Confetti />}
            <div className={styles.coin}>
              <img src={coin.image} alt={coin.name} className={styles.coinIcon} />
              <span>{coin.name}</span>
            </div>
            <span
              style={{
                color: coin.price_change_percentage_24h > 0 ? 'green' : 'red',
                marginLeft: '10px',
              }}
            >
              {coin.price_change_percentage_24h !== null && coin.price_change_percentage_24h !== undefined
                ? `${coin.price_change_percentage_24h.toFixed(2)}%`
                : 'N/A'}
            </span>
          </div>
        ))
      )}
      
      <br />
      Drag and Drop coins to add to watchlist
    </div>
  );
};

export default Watchlist;
