SONGS = {
  quartermasters_store: {
    lyric_set: [
      ["were", "rats, rats, as big as bloomin' cats"],
      ["was", "gravy, gravy, enough to sink the Navy"],
      ["were", "beans, beans, big as submarines"],
      ["was", "cheese, cheese, that smelled like sailors knees"],
      ["were", "peas, peas, with kilts and hairy knees"],
      ["were", "snakes, snakes, as big as garden rakes"],
      ["were", "goats, goats, eating all the oats"],
      ["were", "chips, chips, as big as battleships"],
    ],
  },
  never_get_to_heaven: {
    lyric_set: [
      ["in Akela's car", "Akela's car won't, drive that far"],
      ["in a jumbo-jet", "the Lord ain't got, no runways yet"],
      ["in a biscuit tin", "the Lord don't let, any crummy ones in"],
      ["on a Boy Scout's knee", "a Boy Scout's knee, is to wobbly"],
      ["in a Girl Guide's bra", "a Girl Guide's bra, won't stretch that far"],
      ["in a baked bean tin", "a baked bean tin, has baked beans in"],
      ["on roller skates", "you might roll past, thoes pearly gates"],
      ["on water skis", "the Lord don't allow, any hairy knees"],
      ["in a bottle of gin", "the Lord don't let, any spirits in"],
      ["in dirty jeans", "the Lord ain't got, any washing machines"],
      ["in a Sea Scout's boat", "a Sea Scout's boat, won't stay afloat"],
    ],
  },
};

function getRandomInt(amount_posible) {
  return Math.floor(Math.random() * amount_posible);
}

function setupSong() {
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams.has("song_name")) {
    document.location.pathname = "/";
  }

  const song_name = searchParams.get("song_name");
  const song_wrapper = document.getElementById("line_wrapper");
  switch (song_name) {
    // Quartermaster's Store
    case "quartermasters-store":
      document.getElementById("song_title").innerHTML = "Quartermaster's Store";
      break;
    // Never get to heaven
    case "never-get-to-heaven":
      document.getElementById("song_title").innerHTML =
        "You'll never get to heaven";
  }
  updateLyric(song_name);
  document.getElementById("main").style.visibility = "visible";
}

function updateLyric() {
  const searchParams = new URLSearchParams(window.location.search);
  const song_name = searchParams.get("song_name");

  const fore_lyric = document.getElementById("fore_lyric");
  const dynamic_lyric = document.getElementById("dynamic_lyric");
  const post_lyric = document.getElementById("post_lyric");

  switch (song_name) {
    // Quartermaster's Store
    case "quartermasters-store":
      lyric_set = SONGS.quartermasters_store.lyric_set;
      line_number = getRandomInt(lyric_set.length);

      while (line_number == dynamic_lyric.getAttribute("prev_line")) {
        line_number = getRandomInt(lyric_set.length);
      }

      fore_lyric.innerHTML = `There ${lyric_set[line_number][0]}`;
      post_lyric.innerHTML = `in the stores, in the stores.`;
      dynamic_lyric.innerHTML = `${lyric_set[line_number][1]},`;
      dynamic_lyric.setAttribute("prev_line", line_number);

      break;
    // Never get to heaven
    case "never-get-to-heaven":
      lyric_set = SONGS.never_get_to_heaven.lyric_set;
      line_number = getRandomInt(lyric_set.length);

      while (line_number == dynamic_lyric.getAttribute("prev_line")) {
        line_number = getRandomInt(lyric_set.length);
      }

      fore_lyric.innerHTML = `Oh, you'll never get to heaven,`;
      dynamic_lyric.innerHTML = `${lyric_set[line_number][0]}, because ${lyric_set[line_number][1]}.`;
      dynamic_lyric.setAttribute("prev_line", line_number);
      post_lyric.innerHTML = ``;

      break;
  }
}
