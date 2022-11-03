const API_SEARCH_URL = "https://api.themoviedb.org/3/search/movie" + secrets.API_KEY + "&query=";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
let apiData = [];

function readTextFile(file) {
    if (file.files && file.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const allText = e.target.result;
            const lines = allText.split("\n");

            for (let i = 0; i < lines.length; i++) {
                addSelectOpt(lines[i]);
            }
            addPreviewBtn();
            clickOnPreview();
        }
        reader.readAsText(file.files[0]);
    }
}

function addSelectOpt(str) {
    const movieTitles = document.getElementById("list-movie-titles");
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");

    checkbox.classList.add("movie-title-opt");
    checkbox.type = "checkbox";
    checkbox.value = str.trim();

    movieTitles.appendChild(li);
    li.appendChild(checkbox);
    li.appendChild(label);
    label.appendChild(document.createTextNode(str));
}

function addPreviewBtn() {
    const movieInformation = document.getElementById("movie-information");
    const btn = document.createElement("button");

    btn.setAttribute("id", "btn-prev");
    btn.textContent = "Preview";
    movieInformation.appendChild(btn);
}

function clickOnPreview() {
    const btnPrev = document.getElementById("btn-prev");

    btnPrev.onclick = () => {
        let checkedValue = document.querySelectorAll('.movie-title-opt:checked');
        let movie = document.querySelectorAll('.movie');

        if (movie) {
            movie.forEach(e => e.remove());
        }

        checkedValue.forEach(e => {
            getMovie(API_SEARCH_URL + e.value.replaceAll(/\s+/g, '+'));
        });

        changeToSave();
    };
}

function getMovie(url) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            apiData.push(data.results[0]);
            showMovie(data.results[0]); // [0] is most relevant movie title
        });
}

function showMovie(data) {
    const { poster_path, overview, title, id } = data;
    const ul = document.getElementById("list-movie-titles");
    const input = ul.querySelector(`input[value="${title.toLowerCase()}"]`);
    const movieEle = document.createElement("div");

    (async () => {
        let ress = await getCredits(id);
        let { actorOne, actorTwo, director } = ress;

        movieEle.classList.add("movie");
        movieEle.innerHTML = `
            <figure class="movie__image">
                <img src="${IMG_URL + poster_path}" alt="${title}">
            </figure>

            <div class="movie__overview">
                <p>${overview}</p>
            </div>

            <div class="movie__about">
                <p>Main actors: ${actorOne} ${actorTwo}</p>
                <p>Director: ${director}</p>
            </div>
        `;

        input.parentElement.appendChild(movieEle);
    })()
}

function changeToSave() {
    let btn = document.getElementById("btn-prev");

    if (btn !== null) {
        btn.id = "btn-save";
        btn.textContent = "Save";
        clickOnCheckbox();
        clickOnSave();
    }
}

function clickOnCheckbox() {
    const checkboxes = document.querySelectorAll("input[type=checkbox]");

    apiData = [];

    checkboxes.forEach(box => box.onclick = () => { changeToPrev() });
}

function changeToPrev() {
    let btn = document.getElementById("btn-save");

    if (btn !== null) {
        btn.id = "btn-prev";
        btn.textContent = "Preview";
    }

    clickOnPreview();
}

function clickOnSave() {
    const btn = document.getElementById("btn-save");

    btn.onclick = () => {
        let movie = document.querySelectorAll('.movie');

        if (movie) {
            movie.forEach(e => e.remove());
        }

        apiData.forEach(e => endpoint(e));

        changeToPrev();
    }
}

function endpoint(data) {
    const jsonString = JSON.stringify(data);
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "receive.php");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonString);
}

async function getCredits(id) {
    const API_CREDITS = "https://api.themoviedb.org/3/movie/" + id + "/credits" + secrets.API_KEY + "&language=en-US";

    let res = await fetch(API_CREDITS)
        .then((response) => response.json())
        .then((data) => {
            const { cast, crew } = data;
            let actorOne, actorTwo, director;

            crew.forEach(e => {
                if (e.job === "Director") {
                    director = e.name;
                }
            })

            actorOne = cast[0].name;
            actorTwo = cast[1].name;
            
            return { actorOne, actorTwo, director };
        });

    return res;
}