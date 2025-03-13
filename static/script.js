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
};

function getRandomInt(amount_posible) {
  return Math.floor(Math.random() * amount_posible);
}

function updateLine(song_name) {
  switch (song_name) {
    case "quartermasters-store":
      lyric_set = SONGS.quartermasters_store.lyric_set;
      line_number = getRandomInt(lyric_set.length);
      while (
        line_number == document.getElementById("previous_line").innerHTML
      ) {
        line_number = getRandomInt(lyric_set.length);
      }
      document.getElementById("fore_word").innerHTML =
        lyric_set[line_number][0];
      document.getElementById("dynamic_lyric").innerHTML =
        lyric_set[line_number][1];
      document.getElementById("previous_line").innerHTML = line_number;

      break;
  }
}
