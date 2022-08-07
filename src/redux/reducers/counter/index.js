import { UPDATE_COUNTER } from 'src/constants/CounterConstants';

import Counter from 'src/model/Counter';

const initialState = Counter();

const counter = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COUNTER: {
      const { payload } = action;

      return {
        ...state,
        ...payload,
      };
    }
    default:
      return state;
  }
};

export default counter;
