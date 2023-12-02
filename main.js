const apiKey = import.meta.env.VITE_TMDB_API_KEY;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: apiKey
  }
};

fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc', options)
    .then(response => response.json())
    .then(data => {
        const movies = data.results;
        const moviesContainer = document.getElementById('movies-container');

        movies.forEach(movie => {

            fetch(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers`, options)
                .then(response => response.json())
                .then(providerData => {
                  const providersGB = providerData.results.GB || {};
                  console.log(providerData.results.GB)
                    let providersHTML = `
                        <h3>Title: ${movie.title}</h3>
                        <p>Release Date: ${movie.release_date}</p>
                        <p>ID: ${movie.id}</p>
                        <h4>Available Providers (GB)</h4>
                    `;
                    providersHTML += '<h5>Buy:</h5><ul>';
                    providersGB.buy && providersGB.buy.forEach(provider => {
                        providersHTML += `<li>${provider.provider_name} <img src="https://image.tmdb.org/t/p/original${provider.logo_path}" alt="${provider.provider_name} logo" style="height: 20px;"></li>`;
                    });
                    providersHTML += '</ul>';

                    providersHTML += '<h5>Rent:</h5><ul>';
                    providersGB.rent && providersGB.rent.forEach(provider => {
                        providersHTML += `<li>${provider.provider_name} <img src="https://image.tmdb.org/t/p/original${provider.logo_path}" alt="${provider.provider_name} logo" style="height: 20px;"></li>`;
                    });
                    providersHTML += '</ul>';

                    providersHTML += '<h5>Subscription:</h5><ul>';
                    providersGB.flatrate && providersGB.flatrate.forEach(provider => {
                        providersHTML += `<li>${provider.provider_name} <img src="https://image.tmdb.org/t/p/original${provider.logo_path}" alt="${provider.provider_name} logo" style="height: 20px;"></li>`;
                    });
                    providersHTML += '</ul>';
                    const movieElement = document.createElement('div');
                    movieElement.innerHTML = providersHTML;
                    moviesContainer.appendChild(movieElement);

                })
                .catch(err => console.error(err));
        });
    })
    .catch(err => console.error(err));