const Counter = ({ value = 0, status = 'idle' } = {}) => ({
  value: Number(value),
  status: String(status),
});

export default Counter;
