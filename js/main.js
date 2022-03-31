import './form.js';
import {renderMiniatures} from './miniatures.js';
import {onFailure} from './full-size-mode.js';
import {getData} from './server.js';

getData(renderMiniatures, onFailure);
