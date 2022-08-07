import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CounterActions from 'src/redux/actions/CounterActions';

import styles from './Counter.module.css';

const propTypes = {};
const defaultProps = {};

const Counter = () => {
  const dispatch = useDispatch();

  const { value } = useSelector((state) => state.counter);

  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

  const handleAddIfOddOnClick = () => {
    if (value % 2) {
      dispatch(CounterActions.updateCounter({ value: value + incrementValue }));
    }
  };

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(CounterActions.updateCounter({ value: value - 1 }))}
        >
          -
        </button>
        <span className={styles.value}>{value}</span>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(CounterActions.updateCounter({ value: value + 1 }))}
        >
          +
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => dispatch(CounterActions.updateCounter({ value: value + incrementValue }))}
        >
          Add Amount
        </button>
        <button
          className={styles.asyncButton}
          onClick={() => dispatch(CounterActions.incrementAsync(incrementValue))}
        >
          Add Async
        </button>
        <button className={styles.button} onClick={handleAddIfOddOnClick}>
          Add If Odd
        </button>
      </div>
    </div>
  );
};

Counter.propTypes = propTypes;
Counter.defaultProps = defaultProps;

export default Counter;
