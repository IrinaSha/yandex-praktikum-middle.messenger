import './assets/styles/styles.scss';
import './assets/styles/variables.scss';
import './components/error-block/error-block.scss';
import './components/button/button.scss';
import './components/flat-button/flat-button.scss';
import './components/nav/nav.scss';

import { Router } from './services/router';
import { ChatsView } from './pages/page-chats';
import { LoginView } from './pages/page-login';
import { RegistrationView } from './pages/page-registration';
import { ProfileView } from './pages/page-profile';

const router = new Router('.app');

router
  .use('/', LoginView)
  .use('/login', LoginView)
  .use('/registration', RegistrationView)
  .use('/chats', ChatsView)
  .use('/profile', ProfileView)
  .start();

(window as any).router = router;
