async function loadSongs() {
  const response = await fetch("/static/songs.json");
  const json = await response.json();
  return json;
}

function populateSongs(list_id) {
  const songs_list = document.getElementById(list_id);

  loadSongs().then((songs) => {
    for (song of songs) {
      let list_item = document.createElement("li");
      let anchor = document.createElement("a");
      anchor.href = `/song?song_id=${song["song_id"]}`;
      anchor.appendChild(document.createTextNode(song["song_title"]));
      list_item.appendChild(anchor);
      songs_list.appendChild(list_item);
    }
  });
}
