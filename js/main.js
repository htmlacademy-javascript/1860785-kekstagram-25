import './form.js';
import {renderMiniatures, showErrorMessage} from './miniatures.js';
import {getData} from './server.js';

getData(renderMiniatures, showErrorMessage);
