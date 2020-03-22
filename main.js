const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');




const apiURL = 'https://api.lyrics.ovh';



// Search by song or artist
async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}


// Show song and artist in DOM
function showData(data) {
    result.innerHTML = `
    <ul class="collection songs">
      ${data.data
        .map(
          song => `<li class="collection-item transparent left-align">
      <span class="songInfo"><strong>${song.artist.name}</strong> - ${song.title}</span>
      <a href="#!" class="secondary-content"><button class="getLyricsLink" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button></a>
    </li>`
        )
        .sort()
        .join('')}
    </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
      ${
        data.prev
          ? `<a href="#!"><button class="getLyricsLink moreLink" onclick="getMoreSongs('${data.prev}')">Prev</button></a>`
          : ''
      }
      ${
        data.next
          ? `<a href="#!"><button class="getLyricsLink moreLink" onclick="getMoreSongs('${data.next}')">Next</button></a>`
          : ''
      }
    `;
  } else {
    more.innerHTML = '';
  }
  


}


// Get prev and next songs
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

// Get lyrics for song
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

   if (data.error) {
        result.innerHTML = data.error;
   } else {
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

        result.innerHTML = `
            <div class="container>
            <div class="row">
            <div class="col s12">
            <div class="card-panel transparent">
            <h2 class="songInfo"><strong>${artist}</strong> - ${songTitle}</h2>
            <span class="lyrics">${lyrics}</span>
            <div class="container center"><a class="goBack" href="index.html"><i class="material-icons">arrow_back</i>Back</a></div>
            </div>
            </div>
            </div>
            </div>

        `;
  }

  more.innerHTML = '';
}

// Event listeners
form.addEventListener('submit', e => {
  e.preventDefault();

  var searchTerm = search.value.trim();

  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});

// Get lyrics button click
result.addEventListener('click', e => {
  const clickedEl = e.target;

  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});