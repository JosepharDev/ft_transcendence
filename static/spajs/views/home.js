import {pushUrl} from './../utils/urlRoute.js';
import { AJAX_ } from './checkAuth.js';

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
    // dataGlobal.csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    // </div>


}





function homeHtml()
{
    return (`
    <div class="container mt-5">
    <div class="row">
        <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div class="card h-100 bg-lightblue small-card">
                <div class="card-body d-flex flex-column justify-content-center text-center">
                    <h6 class="card-title" data-localize="tournament">Search</h6>
                    <p class="card-text" data-localize="tournament-desc">Search.</p>
                    <a href="/s" class="btn btn-primary mt-auto btn-sm" data-localize="go">Go</a>
                </div>
            </div>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div class="card h-100 bg-lightgreen small-card">
                <div class="card-body d-flex flex-column justify-content-center text-center">
                    <h6 class="card-title" data-localize="training">Training</h6>
                    <p class="card-text" data-localize="training-desc">Improve your skills.</p>
                    <a href="/search" class="btn btn-primary mt-auto btn-sm" data-localize="go">Go</a>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div class="card h-100 bg-lightgreen small-card">
                <div class="card-body d-flex flex-column justify-content-center text-center">
                    <h6 class="card-title" data-localize="training">1vs1local</h6>
                    <p class="card-text" data-localize="training-desc">localgame.</p>
                    <a href="/localgame" class="btn btn-primary mt-auto btn-sm" data-localize="go">Go</a>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
        <div class="card h-100 bg-lightgreen small-card">
            <div class="card-body d-flex flex-column justify-content-center text-center">
                <h6 class="card-title" data-localize="training">1vs1local</h6>
                <p class="card-text" data-localize="training-desc">remo.</p>
                <a href="/remote" class="btn btn-primary mt-auto btn-sm" data-localize="go">Go</a>
            </div>
        </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div class="card h-100 bg-lightgreen small-card">
                <div class="card-body d-flex flex-column justify-content-center text-center">
                    <h6 class="card-title" data-localize="training">set</h6>
                    <p class="card-text" data-localize="training-desc">set.</p>
                    <a href="/settings" class="btn btn-primary mt-auto btn-sm" data-localize="go">Go</a>
                </div>
            </div>
        </div>




    </div>
</div>
    `);
}