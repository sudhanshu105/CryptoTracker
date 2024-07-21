import { Provider } from 'react-redux';
import { store } from '../store/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './global.css';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
      <Component {...pageProps} />
      </DndProvider>
    </Provider>
  );
}

export default MyApp;
