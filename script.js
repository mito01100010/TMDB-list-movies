const API_SEARCH_URL = "https://api.themoviedb.org/3/search/movie?api_key=###&query=";
const IMG_URL = "https://image.tmdb.org/t/p/w500"

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
            reqMovie(API_SEARCH_URL + e.value.replaceAll(/\s+/g, '+'));
        });

        changeToSave();
    };
}

function reqMovie(url) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            showMovie(data.results[0]); // [0] is most relevant movie title
        });
}

function showMovie(data) {
    const {poster_path, overview, title} = data;
    const ul = document.getElementById("list-movie-titles");
    const input = ul.querySelector(`input[value="${title.toLowerCase()}"]`);
    const movieEle = document.createElement("div");

    movieEle.classList.add("movie");
    movieEle.innerHTML = `
        <figure class="movie__image">
            <img src="${IMG_URL+poster_path}" alt="${title}">
        </figure>

        <div class="movie__overview">
            <p>${overview}</p>
        </div>
    `;

    input.parentElement.appendChild(movieEle);
}

function changeToSave() {
    let btn = document.getElementById("btn-prev");

    btn.id = "btn-save";
    btn.textContent = "Save";
    clickOnCheckbox();
}

function clickOnCheckbox() {
    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    
    checkboxes.forEach(box => box.onclick = () => { changeToPrev() });
}

function changeToPrev() {
    let btn = document.getElementById("btn-save");

    btn.id = "btn-prev";
    btn.textContent = "Preview";

    clickOnPreview();
}