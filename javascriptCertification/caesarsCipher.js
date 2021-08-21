const rot13 = (str, alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ") => {
  return str
    .split("")
    .map((letter) => {
      let shiftedLetter = (letter.charCodeAt(0) - 13 - 65) % 26
      shiftedLetter = shiftedLetter >= 0 ? shiftedLetter : shiftedLetter + 26

      return letter.match(/[A-Z]/) ? alphabet.charAt(shiftedLetter) : letter
    })
    .join("")
}

console.log(rot13("SERR PBQR PNZC"))
rot13("SERR CVMMN!")
