function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function (...args) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}
async function fetchMovies(query) {
  const apiKey = "4d04ee0a";
  const response = await fetch(
    `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`
  );
  const data = await response.json();
  return data.Search || [];
}
function showMovies(movies) {
  const resultsBox = document.getElementById("results-box");
  resultsBox.innerHTML = "";
  movies.forEach((movie) => {
    const movieTitleDiv = document.createElement("div");
    movieTitleDiv.textContent = movie.Title;
    movieTitleDiv.className = "movie-title";
    movieTitleDiv.onclick = () => showMovieDetails(movie);
    resultsBox.appendChild(movieTitleDiv);
  });
}
function showMovieDetails(movie) {
  const movieDetails = document.getElementById("movie-details");
  movieDetails.innerHTML = `
        <h2>${movie.Title}</h2>
        <p>Year: ${movie.Year}</p>
        <p>Type: ${movie.Type}</p>
        <img src="${movie.Poster}" alt="${movie.Title} Poster" style="width:200px;">
    `;
  movieDetails.style.display = "block";
}
function handleSearch() {
  const query = document.getElementById("search-input").value;
  if (query) {
    fetchMovies(query).then(showMovies);
  }
}

// Add event listener to the input with throttling

document
  .getElementById("search-input")
  .addEventListener("input", throttle(handleSearch, 1000));
