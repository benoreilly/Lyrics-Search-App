const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");
const resultCount = document.getElementById("result-count");

const apiURL = "https://api.lyrics.ovh";

// Search by song or artist
async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();
  const songData = data.data;

  // songData.forEach((element, index, array) => {
  //   var artistName = element.artist.name;
  //   console.log(artistName);

  // });
  showData(data);
}

// Show song and artist in DOM
function showData(data) {
  result.innerHTML = `
    <div class="container">
    <div class="row">
    <div class="col s12">
    <div class="card z-depth-4">
    <ul class="collection songs">
      ${data.data
        .map(
          (song) =>
            `<li class="collection-item left-align">
              <div class="song-list"><i class="material-icons">queue_music</i><strong>${song.artist.name}</strong> - ${song.title}</div>
              <a href="#!" class="secondary-content"><button class="btn btn-small lyrics-btn" data-artist="${song.artist.name}" data-songtitle="${song.title}" data-img="${song.artist.picture_xl}" data-preview="${song.preview}">Get Lyrics</button></a>
        </li>`
        )
        .sort()
        .join("")}
    </ul>
    </div>
    </div>
    </div>
    </div>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
      ${
        data.prev
          ? `<a href="#!" class="btn prev-link" onclick="getMoreSongs('${data.prev}')">Prev</a>`
          : ""
      }
      ${
        data.next
          ? `<a href="#!" class="btn next-link" onclick="getMoreSongs('${data.next}')">Next</a>`
          : ""
      }
    `;
  } else {
    more.innerHTML = "";
  }

  resultCount.innerHTML = data.total + " " + "results";
}

// Get prev and next songs
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

// Get lyrics for song
async function getLyrics(artist, songTitle, artistImg, songPreview) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  if (data.error) {
    result.innerHTML =
      "<h2>Gah! Lyrics for this tune arent available quite yet!</h2>";
  } else {
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

    result.innerHTML = `
            <div class="container center">
              <div class="row">
                <div class="col s12">
                  <div class="card z-depth-4">
                    <div class="lyrics-page--header">
                      <div id="img-container">
                        <div class="card">
                          <span class="songInfo songInfo-artist white-text"><strong>${artist}</strong></span>
                          <span class="songInfo songInfo-song white-text">${songTitle}</span>
                        </div>
                        <audio 
                          controls
                          src="${songPreview}" type="audio/mpeg">
                          Your browser does not support the <code>audio</code> element.
                        </audio>
                      </div>
                    </div>
                    <span class="lyrics">${lyrics}</span>
                    <div class="container center">
                      <a class="btn go-back" href="index.html">
                        <i class="material-icons">arrow_back</i>Back
                      </a>
                    </div>

                  </div>
                </div>
              </div>
            </div>
        `;

    const getImg = document.getElementById("img-container");
    getImg.style.backgroundImage = "url(" + artistImg + ")";
  }

  more.innerHTML = "";
}

// Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();

  var searchTerm = search.value.trim();

  if (!searchTerm) {
    alert("Please type in a search term");
  } else {
    searchSongs(searchTerm);
  }
});

// Get lyrics button click
result.addEventListener("click", (e) => {
  const clickedEl = e.target;
  if (clickedEl.tagName === "BUTTON") {
    const artist = clickedEl.getAttribute("data-artist");
    const songTitle = clickedEl.getAttribute("data-songtitle");
    const artistImg = clickedEl.getAttribute("data-img");
    const songPreview = clickedEl.getAttribute("data-preview");

    getLyrics(artist, songTitle, artistImg, songPreview);
  }
});

$(document).ready(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $("#scroll").fadeIn();
    } else {
      $("#scroll").fadeOut();
    }
  });
  $("#scroll").click(function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      600
    );
    return false;
  });
});
