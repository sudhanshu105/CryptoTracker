import { useDrag } from 'react-dnd';
import styles from './CoinList.module.css';
import Link from 'next/link';

const CoinList = ({ coins, addCoinToWatchlist }) => {
  return (
    <div className={styles.coinList}>
      <table className={styles.coinTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Market Cap</th>
            <th>Current Price</th>
            <th>24h Change</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <CoinRow key={coin.id} coin={coin} addCoinToWatchlist={addCoinToWatchlist} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CoinRow = ({ coin, addCoinToWatchlist }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'coin',
    item: { 
      id: coin.id, 
      name: coin.name, 
      image: coin.image,
      price_change_percentage_24h: coin.price_change_percentage_24h,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <tr ref={drag} className={isDragging ? styles.isDragging : ''}>
      <td>
        <Link href={`/${coin.id}`} legacyBehavior>
          <a className={styles.coinLink}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={coin.image} alt={coin.name} className={styles.coinIcon} />
              {coin.name}
            </div>
          </a>
        </Link>
      </td>
      <td>${coin.market_cap.toLocaleString()}</td>
      <td>${coin.current_price.toLocaleString()}</td>
      <td
        style={{
          color: coin.price_change_percentage_24h > 0 ? 'green' : 'red',
        }}
      >
        {coin.price_change_percentage_24h.toFixed(2)}%
      </td>
      <td>
        <button 
          onClick={() => addCoinToWatchlist(coin)} 
          className={styles.addButton}
        >
          +
        </button>
      </td>
    </tr>
  );
};

export default CoinList;
