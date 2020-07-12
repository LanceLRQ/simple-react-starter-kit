import 'styles/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

const render = () => {
  ReactDOM.render(
    <div>Hello World!</div>,
    document.getElementById('root')
  );
};

render();
// if (module.hot) {
//   module.hot.accept('./root.jsx', () => {
//     render(require('./root.jsx').default);
//   });
// }
