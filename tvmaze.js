/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */
/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
const MISSING_IMAGE_URL = "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png";

async function searchShows(query) {
  let result = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);

  let shows = result.data.map(({show}) => ({
        id: show.id,
        name: show.name,
        summary: show.summary,
        image: show.image ? show.image.medium : MISSING_IMAGE_URL,
      }));
  return shows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    // console.log(show);
    let $item = $(
      `<div class="col-md-6 col-lg-3 text-dark bg-light Show" data-show-id="${show.id}">
         <div class="card border-primary" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body shadow-lg p-3 mb-5 bg-body rounded">
             <h5 class="card-title card-header">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary mt-3 get-episodes 
              data-toggle="tooltip" data-placement="bottom" 
              title="Episodes will display below on this page!">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
};

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
async function getEpisodes(id) {
  // TODO: get episodes from tvmaze with id
  let result = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = result.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));
  return episodes;
};

// add episodes to the DOM by using the given list of episodes
async function populateEpisodes(episodes){
  const $episodesList = $('#episodes-list');
  $episodesList.empty();

  for(let episode of episodes){
    let $item = $(
      `<li class="list-group-item list-group-item list-group-item-dark text-center">
      ${episode.name} (season ${episode.season}, episode ${episode.number})</li>`);
    $episodesList.append($item);
  }
  $('#episodes-area').show();
};

//eventHandler for adding the episodes to the shows-list
$('#shows-list').on('click', '.get-episodes', async function episodesOnClick(event) {
  let showId = $(event.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});

