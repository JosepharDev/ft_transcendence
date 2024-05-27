import {tuto} from './views/views.js'
import {dataGlobal, url} from './views/globalData.js'
import {homeView} from './views/home.js'
import {urlLocationHandler} from './utils/locationHandles.js'
import {urlRoute} from './utils/urlRoute.js'



dataGlobal.csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

tuto();
console.log(url);
homeView();
window.onpopstate = urlLocationHandler;
window.route = urlRoute;
urlLocationHandler();
