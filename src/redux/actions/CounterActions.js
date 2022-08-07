import { createAsyncThunk } from '@reduxjs/toolkit';

import { UPDATE_COUNTER } from 'src/constants/CounterConstants';

const fetchCount = (amount = 1) => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: amount }), 2000));
};

const updateCounter = (payload) => ({
  type: UPDATE_COUNTER,
  payload,
});

const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount, { dispatch, getState }) => {
    dispatch(updateCounter({ status: 'loading' }));

    const response = await fetchCount(amount);

    const {
      counter: { value: oldValue },
    } = getState();

    // The value we return becomes the `fulfilled` action payload
    return dispatch(updateCounter({ value: oldValue + response.data, status: 'idle' }));
  }
);

export default { updateCounter, incrementAsync };
