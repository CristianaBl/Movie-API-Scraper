const apiKey = "47226e31aaefba58f37530043bafdf17";
const apiUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;

const moviesContainer = document.getElementById("movies");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const themeToggle = document.getElementById("themeToggle");
const body = document.getElementById("body");

let moviesData = [];

async function fetchMovies() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        moviesData = data.results;
        displayMovies(moviesData);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayMovies(movies) {
    moviesContainer.innerHTML = "";

    movies.forEach(media => {
        const { title, name, backdrop_path, vote_average } = media;
        const movieCard = document.createElement("div");

        movieCard.className = "bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl dark:bg-purple-900 dark:text-white";

        movieCard.innerHTML = `
            <img src="http://image.tmdb.org/t/p/w500/${backdrop_path}" class="w-full object-cover">
            <div class="text-center text-xl font-semibold text-pink-700 py-2 dark:text-pink-200">${title || name}</div>
            <div class="text-center pb-4 text-pink-500 dark:text-pink-300">⭐ ${vote_average.toFixed(1)}</div>
        `;

        moviesContainer.appendChild(movieCard);
    });
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredMovies = moviesData.filter(media =>
        (media.title || media.name).toLowerCase().includes(query)
    );
    displayMovies(filteredMovies);
});

sortSelect.addEventListener("change", () => {
    const sortType = sortSelect.value;
    let sorted = [...moviesData];

    if (sortType === "rating") {
        sorted.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortType === "az") {
        sorted.sort((a, b) => (a.title || a.name).localeCompare(b.title || b.name));
    } else if (sortType === "za") {
        sorted.sort((a, b) => (b.title || b.name).localeCompare(a.title || a.name));
    }

    displayMovies(sorted);
});

function applyTheme(theme) {
    const isDark = theme === "dark";
    body.classList.toggle("dark", isDark);
    themeToggle.textContent = isDark ? "🌞" : "🌙";
}

themeToggle.addEventListener("click", () => {
    const newTheme = body.classList.contains("dark") ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
});

window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
    fetchMovies();
});
