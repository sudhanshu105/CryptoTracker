import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchCoinsList } from '../lib/api';
import styles from './Header.module.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.length > 0) {
        try {
          const results = await fetchCoinsList(searchTerm);
          setSearchResults(results.slice(0, 10)); // Show only the first 10 results
        } catch (err) {
          console.error('Error fetching search results:', err);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setIsDropdownVisible(event.target.value.length > 0);
  };

  const handleResultClick = (coinId) => {
    setIsDropdownVisible(false);
    setSearchTerm('');
    router.push(`/${coinId}`);
  };

  return (
    <header className={styles.header}>
      <h1>Cryptocurrency Tracker</h1>
      <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for a coin..."
          className={styles.searchInput}
        />
       {isDropdownVisible && (
          <div className={styles.dropdown}>
            {searchResults.map((result) => (
              <div
                key={result.id}
                className={styles.dropdownItem}
                onClick={() => handleResultClick(result.id)}
              >
                {result.name}
              </div>
            ))}
          </div>
        )}

<div className={styles.navLinks}>
        <a href="/">Home</a>
        <a href="/explore">Explore</a>
      </div>
      {/* {isDropdownVisible && <div className={styles.overlay}></div>} */}
    </header>
  );
};

export default Header;
