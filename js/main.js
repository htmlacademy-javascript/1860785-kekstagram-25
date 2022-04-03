import './form.js';
import {renderMiniatures, onErrorDataDownload} from './miniatures.js';
import {getData} from './server.js';

getData(renderMiniatures, onErrorDataDownload);
