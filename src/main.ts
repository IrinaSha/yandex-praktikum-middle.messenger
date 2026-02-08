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
import { userStore } from './stores/user-store';

const router = Router.getInstance('.app');

router.setAuthCheck(async () => userStore.checkAuth());

router
  .use('/', LoginView, false)
  .use('/sign-up', RegistrationView, false)
  .use('/settings', ProfileView, true)
  .use('/messenger', ChatsView, true)
  .use('/messenger/:chatId', ChatsView, true)
  .start();

(window as any).router = router;
