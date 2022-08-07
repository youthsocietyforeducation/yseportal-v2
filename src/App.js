import React from 'react';

import routes from 'src/routes';

const App = () => {
  return <div data-testid="App">{routes()}</div>;
};

export default App;
