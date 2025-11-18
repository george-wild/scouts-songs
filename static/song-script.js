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
      // window.location.replace("/");
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
  const buttons_wrapper = document.getElementById("buttons_wrapper");

  getSong(song_id).then((song_object) => {
    const lyric_constructor = song_object["lyric_constructor"];
    song_title.innerHTML = song_object["song_title"];
    let first_update = "random";

    switch (song_object["button_mode"]) {
      case "random":
        new_button = document.createElement("button");
        new_button.type = "button";
        new_button.onclick = function () {
          updateLyric(song_id, song_object["button_mode"]);
        };
        new_button.appendChild(document.createTextNode("Random"));
        buttons_wrapper.appendChild(new_button);
        break;

      case "sequence":
        new_button = document.createElement("button");
        new_button.type = "button";
        new_button.onclick = function () {
          updateLyric(song_id, "previous");
        };
        new_button.appendChild(document.createTextNode("Previous"));
        new_button.disabled = true;
        new_button.id = "previous_button";
        buttons_wrapper.appendChild(new_button);

        new_button = document.createElement("button");
        new_button.type = "button";
        new_button.onclick = function () {
          updateLyric(song_id, "next");
        };
        new_button.appendChild(document.createTextNode("Next"));
        new_button.disabled = true;
        new_button.id = "next_button";
        buttons_wrapper.appendChild(new_button);
        first_update = "first";
        break;

      default:
        // line.classList.add("lyric-static");
        break;
    }

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
    updateLyric(song_id, first_update);
    document.getElementById("main").style.visibility = "visible";
  });
}

function updateLyric(song_id = "", mode = "random") {
  console.log(mode);

  getSong(song_id).then((song_object) => {
    const dynamic_components = document.querySelectorAll(
      "[data-lyric-type=dynamic]"
    );
    let components = {};
    let smallest_len = Infinity;

    switch (mode) {
      case "random":
        for (dynamic_ele of dynamic_components) {
          let split_reference = dynamic_ele.dataset.component.split(".");

          if (!(split_reference[0] in components)) {
            let random = -1;
            while ((random == -1) | (random == dynamic_ele.dataset.previous)) {
              random = getRandomInt(
                song_object["components"][split_reference[0]].length
              );
            }
            components[split_reference[0]] = random;
          }
          dynamic_ele.replaceChildren(
            document.createTextNode(
              song_object["components"][split_reference[0]][
                components[split_reference[0]]
              ][split_reference[1]]
            )
          );
          dynamic_ele.dataset.previous = components[split_reference[0]];
        }
        break;

      case "first":
        for (dynamic_ele of dynamic_components) {
          let split_reference = dynamic_ele.dataset.component.split(".");
          if (!(split_reference[0] in components)) {
            components[split_reference[0]] = 0;
          }
          dynamic_ele.replaceChildren(
            document.createTextNode(
              song_object["components"][split_reference[0]][
                components[split_reference[0]]
              ][split_reference[1]]
            )
          );
          dynamic_ele.dataset.previous = components[split_reference[0]];

          console.log();
          if (
            song_object["components"][split_reference[0]].length < smallest_len
          ) {
            smallest_len = song_object["components"][split_reference[0]].length;
          }
        }

        if (smallest_len > 1) {
          document.getElementById("next_button").disabled = false;
        }
        break;

      case "next":
        currentIndex = 0;
        for (dynamic_ele of dynamic_components) {
          let split_reference = dynamic_ele.dataset.component.split(".");
          if (!(split_reference[0] in components)) {
            components[split_reference[0]] =
              Number(dynamic_ele.dataset.previous) + 1;
            currentIndex = Number(dynamic_ele.dataset.previous) + 1;
          }
          console.log(components);

          dynamic_ele.replaceChildren(
            document.createTextNode(
              song_object["components"][split_reference[0]][
                components[split_reference[0]]
              ][split_reference[1]]
            )
          );
          dynamic_ele.dataset.previous = components[split_reference[0]];

          console.log();
          if (
            song_object["components"][split_reference[0]].length < smallest_len
          ) {
            smallest_len = song_object["components"][split_reference[0]].length;
          }
        }
        console.log(currentIndex);

        if (smallest_len - 1 == currentIndex) {
          document.getElementById("next_button").disabled = true;
        }
        if (currentIndex > 0) {
          document.getElementById("previous_button").disabled = false;
        }
        break;

      case "previous":
        currentIndex = 0;
        for (dynamic_ele of dynamic_components) {
          let split_reference = dynamic_ele.dataset.component.split(".");
          if (!(split_reference[0] in components)) {
            components[split_reference[0]] =
              Number(dynamic_ele.dataset.previous) - 1;
            currentIndex = Number(dynamic_ele.dataset.previous) - 1;
          }
          console.log(components);

          dynamic_ele.replaceChildren(
            document.createTextNode(
              song_object["components"][split_reference[0]][
                components[split_reference[0]]
              ][split_reference[1]]
            )
          );
          dynamic_ele.dataset.previous = components[split_reference[0]];

          console.log();
          if (
            song_object["components"][split_reference[0]].length < smallest_len
          ) {
            smallest_len = song_object["components"][split_reference[0]].length;
          }
        }
        console.log(currentIndex);

        if (currentIndex == 0) {
          document.getElementById("previous_button").disabled = true;
        }
        if (smallest_len - 1 > currentIndex) {
          document.getElementById("next_button").disabled = false;
        }
        break;

      default:
        break;
    }
  });
}
