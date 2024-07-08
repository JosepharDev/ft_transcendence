import {pushUrl} from './../utils/urlRoute.js';
import { AJAX_ } from './checkAuth.js';
import { dataGlobal } from './globalData.js';
import { translations } from '../utils/localization.js';
export async function  homeView()
{
    let app = document.getElementById('app');
    app.innerHTML = homeHtml();
    const matches = document.querySelectorAll(".btn-sm");
    if (matches)
    {
        matches.forEach(match =>{
            match.addEventListener("click", (e) => {
                e.preventDefault();
                pushUrl(e.target.href);
            })
        })   
    }
}





function homeHtml()
{
    return (`
    <div class="container mt-5">
    <div class="row">
        

        <div class="col-lg-4 col-md-6 col-sm-12 mb-4 bobo">
            <div class="card h-100 bg-lightgreen small-card">
                <div class="card-body d-flex flex-column justify-content-center text-center">
                    <a href="/localgame" class="btn btn-primary mt-auto btn-sm dodo" data-localize="local">${translations[dataGlobal.selectedLanguage]['local']}</a>
                    <a href="/remote" class="btn btn-primary mt-auto btn-sm dodo" data-localize="online1">${translations[dataGlobal.selectedLanguage]['online1']}</a>
                    <a href="/remote4" class="btn btn-primary mt-auto btn-sm dodo" data-localize="online2">${translations[dataGlobal.selectedLanguage]['online2']}</a>
                    <a href="/tournament" class="btn btn-primary mt-auto btn-sm dodo" data-localize="tournament">${translations[dataGlobal.selectedLanguage]['tournament']}</a>
                </div>
            </div>
        </div>

    </div>
</div>
    `);
}