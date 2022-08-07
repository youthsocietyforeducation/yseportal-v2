import { configureStore } from '@reduxjs/toolkit';
import counter from 'src/redux/reducers/counter';

export const store = configureStore({
  reducer: {
    counter,
  },
});
