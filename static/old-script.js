const LINES = [
  ["were", "rats, rats, as big as bloomin' cats"],
  ["was", "gravy, gravy, enough to sink the Navy"],
  ["were", "beans, beans, big as submarines"],
  ["was", "cheese, cheese, that smelled like sailors knees"],
  ["were", "peas, peas, with kilts and hairy knees"],
  ["were", "snakes, snakes, as big as garden rakes"],
  ["were", "goats, goats, eating all the oats"],
  ["were", "chips, chips, as big as battleships"],
];

let PREVIOUS;
function getRandomInt(amount_posible) {
  return Math.floor(Math.random() * amount_posible);
}
function getLine(line_number) {
  return LINES[line_number];
}
function getRandomLine() {
  let line_number = getRandomInt(LINES.length);
  while (line_number == PREVIOUS) {
    line_number = getRandomInt(LINES.length);
  }
  PREVIOUS = line_number;
  let line = getLine(line_number);
  return line;
}

function generate() {
  line = getRandomLine();
  document.getElementById("word").innerHTML = line[0];
  document.getElementById("line").innerHTML = line[1];
}
