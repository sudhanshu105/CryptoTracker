import { useEffect, useState, useRef } from 'react';
import { fetchGlobalMarketCapData, fetchPublicCompaniesHoldingsBTC, fetchPublicCompaniesHoldingsETH } from '../lib/api';
import Chart from 'chart.js/auto';
import css from './index.module.css';
import Header from '../components/Header';

const HomePage = () => {
  const [globalMarketCap, setGlobalMarketCap] = useState(null);
  const [publicCompaniesBTC, setPublicCompaniesBTC] = useState([]);
  const [publicCompaniesETH, setPublicCompaniesETH] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const marketCapData = await fetchGlobalMarketCapData();
      setGlobalMarketCap(marketCapData);
      const companiesDataBTC = await fetchPublicCompaniesHoldingsBTC();
      setPublicCompaniesBTC(companiesDataBTC.companies);
      const companiesDataETH = await fetchPublicCompaniesHoldingsETH();
      setPublicCompaniesETH(companiesDataETH.companies);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (globalMarketCap) {
      const lowerLimit = 100000000; // Lower limit for market cap
      const upperLimit = 1000000000000; // Upper limit for market cap

      const filteredData = Object.entries(globalMarketCap.data.total_market_cap).filter(
        ([key, value]) => value >= lowerLimit && value <= upperLimit
      );

      const labels = filteredData.map(([key]) => key);
      const data = filteredData.map(([_, value]) => value);

      const ctx = document.getElementById('globalMarketCapChart').getContext('2d');

      // Destroy previous chart instance if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Global Market Cap in USD',
            data,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4 // to smooth out the line
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'category',
              position: 'bottom'
            }
          }
        }
      });
    }
  }, [globalMarketCap]);

  return (
    <div className={css.outer}>
      <Header />
      <section className={css.sectionClass}>
        <h2 data-text="Global Market Cap Chart">Global Market Cap Chart</h2>
        <div className={css.chartContainer}>
          <canvas id="globalMarketCapChart" className={css.canvas}></canvas>
        </div>
      </section>
      <section className={css.bitcoinSection}>
        <h2 data-text="Public Companies Holdings (BITCOIN)">Public Companies Holdings (BITCOIN)</h2>
        <ul>
          {publicCompaniesBTC.map(company => (
            <li key={company.name}>
              {company.name} - {company.total_holdings} BTC
            </li>
          ))}
        </ul>
      </section>
      <section className={css.ethereumSection}>
        <h2 data-text="Public Companies Holdings (ETHEREUM)">Public Companies Holdings (ETHEREUM)</h2>
        <ul>
          {publicCompaniesETH.map(company => (
            <li key={company.name}>
              {company.name} - {company.total_holdings} ETH
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HomePage;
