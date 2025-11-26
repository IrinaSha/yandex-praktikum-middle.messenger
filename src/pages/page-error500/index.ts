import '../../assets/styles/styles.scss'
import '../../assets/styles/variables.scss'

import { ErrorView } from '../../view/view-error.ts';

const view = new ErrorView('500', 'Мы уже фиксим');

view.renderPage();
