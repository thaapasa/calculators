import './index.css';

import { AppRouterProvider } from 'app/ui/Routes';
import ReactDOM from 'react-dom/client';

import { assertDefined, fixConsole } from './app/util/util';

// Ensure that there is a console
fixConsole();

const container = document.getElementById('root');
assertDefined(container);

ReactDOM.createRoot(container).render(<AppRouterProvider />);
