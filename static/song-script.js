function getRandomInt(amount_posible) {
  return Math.floor(Math.random() * amount_posible);
}

async function loadSongs() {
  const response = await fetch("/static/songs.json");
  const json = await response.json();
  return json;
}

async function storeSong(song_id) {
  try {
    const response = await fetch(`/static/songs/${song_id}.json`);
    const json = await response.json();
    localStorage.setItem(song_id, JSON.stringify(json));
    localStorage.setItem(`${song_id}.created`, new Date().toISOString());
    return json;
  } catch {
    return false;
  }
}

async function getSong(song_id) {
  const ONE_DAY = 1000 * 60 * 60 * 24;
  if (
    localStorage.getItem(song_id) &&
    localStorage.getItem(`${song_id}.created`) &&
    new Date(localStorage.getItem(`${song_id}.created`)) - new Date() < ONE_DAY
  ) {
    const string = await localStorage.getItem(song_id);

    return await JSON.parse(string);
  } else {
    const response = await storeSong(song_id);
    if (response == false) {
      window.location.replace("/");
    } else {
      return await response;
    }
  }
}

function setupSong() {
  const searchParams = new URLSearchParams(window.location.search);

  const song_id = searchParams.get("song_id");
  const song_wrapper = document.getElementById("line_wrapper");
  const song_title = document.getElementById("song_title");

  getSong(song_id).then((song_object) => {
    const lyric_constructor = song_object["lyric_constructor"];
    song_title.innerHTML = song_object["song_title"];

    for (lyric of lyric_constructor) {
      let line = document.createElement("span");
      switch (lyric["style"]) {
        case "static":
          line.classList.add("lyric-static");
          break;

        case "dynamic":
          line.classList.add("lyric-dynamic");
          break;

        default:
          line.classList.add("lyric-static");
          break;
      }
      for (item of lyric["lyrics"]) {
        split_reference = item.split(".");
        switch (split_reference[0]) {
          case "static":
            line.appendChild(
              document.createTextNode(
                song_object["components"][split_reference[0]][
                  split_reference[1]
                ]
              )
            );
            break;

          default:
            let dynamic_ele = document.createElement("span");
            dynamic_ele.dataset.lyricType = "dynamic";
            dynamic_ele.dataset.component = item;
            line.appendChild(dynamic_ele);
            break;
        }
      }
      song_wrapper.appendChild(line);
    }
    updateLyric();
    document.getElementById("main").style.visibility = "visible";
  });
}

function updateLyric() {
  const searchParams = new URLSearchParams(window.location.search);
  const song_id = searchParams.get("song_id");

  getSong(song_id).then((song_object) => {
    let components = {};

    dynamic_lyrics = document.querySelectorAll("[data-lyric-type=dynamic]");

    for (item of dynamic_lyrics) {
      split_reference = item.dataset.component.split(".");

      if (components[split_reference[0]] == undefined) {
        random = -1;
        while ((random == -1) | (random == item.dataset.previous)) {
          random = getRandomInt(
            Object.keys(song_object["components"][split_reference[0]]).length
          );
        }
        let component = song_object["components"][split_reference[0]][random];
        item.dataset.previous = random;

        components[split_reference[0]] = component;
      }

      dynamic_component = components[split_reference[0]];

      item.replaceChildren(
        document.createTextNode(dynamic_component[split_reference[1]])
      );
    }
  });
}
