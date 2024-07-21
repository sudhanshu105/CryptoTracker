import Head from 'next/head';
import Header from '../components/Header';
import CoinDetails from '../components/CoinDetails';

const CoinPage = () => {
  return (
    <div>
      <Head>
        <title>Cryptocurrency Details</title>
      </Head>
      <Header />
      <CoinDetails />
    </div>
  );
};

export default CoinPage;
