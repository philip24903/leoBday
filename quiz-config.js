/*
  Alle Quiz-Inhalte an einer Stelle.
  Die 12 Videos liegen im Unterordner files und heißen Frage01.mp4 bis Frage12.mp4.

  Ablauf:
  - Frage 01 ergibt die Zahl 12.
  - Danach erscheinen die 12 Stellen des Lösungsworts.
  - Das Leerzeichen an Stelle 6 wird automatisch geschenkt.
  - Die Fragen 02 bis 12 liefern die 11 Buchstaben.

  Die Texte in "eyebrow" stehen rechts über der jeweiligen Frage und können frei angepasst werden.

  WICHTIG:
  - Frage 08 (Kim / U) hat im gelieferten Quiz noch keinen vollständigen Fragetext.
    Die vorläufig akzeptierte Antwort ist deshalb nur "U" und kann später hier geändert werden.
*/

window.QUIZ_CONFIG = {
  finalPhrase: "CANIS AUREUS",
  slots: ["C", "A", "N", "I", "S", " ", "A", "U", "R", "E", "U", "S"],
  giftedSlots: [5],
  postImages: ["files/bild01.png", "files/bild02.png"],

  questions: [
    {
      id: 1,
      video: "files/Frage01.mp4",
      eyebrow: "Dein Einstieg",
      title: "Was ist die Lösung?",
      hint: "Die erste Antwort verrät dir, wie viele Zeichen du suchst.",
      answers: ["12", "zwölf", "zwoelf"],
      displayAnswer: "12",
      slotIndex: null,
      letter: null
    },
    {
      id: 2,
      video: "files/Frage02.mp4",
      eyebrow: "Wetterwissen",
      title: "Wie lautet das gesuchte Wort?",
      answers: ["Cumulonimbus"],
      displayAnswer: "Cumulonimbus",
      slotIndex: 0,
      letter: "C"
    },
    {
      id: 3,
      video: "files/Frage03.mp4",
      eyebrow: "Werwölfe",
      title: "Wie lautet das gesuchte Wort?",
      answers: ["Amor"],
      displayAnswer: "Amor",
      slotIndex: 1,
      letter: "A"
    },
    {
      id: 4,
      video: "files/Frage04.mp4",
      eyebrow: "Gemeinsamkeit gesucht",
      title: "Was ist die gesuchte Gemeinsamkeit?",
      hint: "Gib die vollständige Lösung aus dem Video ein.",
      answers: ["N"],
      displayAnswer: "N",
      slotIndex: 2,
      letter: "N"
    },
    {
      id: 5,
      video: "files/Frage05.mp4",
      eyebrow: "Um die Ecke gedacht",
      title: "Wie lautet deine Lösung?",
      hint: "Mehrere Schreibweisen werden akzeptiert.",
      answers: ["9", "neun", "I"],
      displayAnswer: "9 → I",
      slotIndex: 3,
      letter: "I"
    },
    {
      id: 6,
      video: "files/Frage06.mp4",
      eyebrow: "Sport & Physik",
      title: "Wie lautet das gesuchte Wort?",
      answers: ["Spin"],
      displayAnswer: "Spin",
      slotIndex: 4,
      letter: "S"
    },
    {
      id: 7,
      video: "files/Frage07.mp4",
      eyebrow: "Ein Name gesucht",
      title: "Welcher Name ist gesucht?",
      answers: ["Alia"],
      displayAnswer: "Alia",
      slotIndex: 6,
      letter: "A"
    },
    {
      id: 8,
      video: "files/Frage08.mp4",
      eyebrow: "Kims Rätsel",
      title: "Wie lautet das gesuchte Wort?",
      hint: "Diese Frage wird ergänzt, sobald Kims Rätsel feststeht.",
      answers: ["U"],
      displayAnswer: "U (vorläufig)",
      slotIndex: 7,
      letter: "U",
      provisional: true
    },
    {
      id: 9,
      video: "files/Frage09.mp4",
      eyebrow: "Physik",
      title: "Welche physikalische Größe ist gesucht?",
      answers: ["Widerstand", "elektrischer Widerstand", "R"],
      displayAnswer: "Widerstand",
      slotIndex: 8,
      letter: "R"
    },
    {
      id: 10,
      video: "files/Frage10.mp4",
      eyebrow: "Schmalkalden",
      title: "Welche Kulturepoche ist gesucht?",
      answers: ["Renaissance"],
      displayAnswer: "Renaissance",
      slotIndex: 9,
      letter: "E"
    },
    {
      id: 11,
      video: "files/Frage11.mp4",
      eyebrow: "Eine kleine Pause",
      title: "Welches Wort bzw. Getränk ist gesucht?",
      answers: ["Ulmer Export", "Ur-Krostitzer", "Ur Krostitzer", "U"],
      displayAnswer: "Ulmer Export / Ur-Krostitzer",
      slotIndex: 10,
      letter: "U"
    },
    {
      id: 12,
      video: "files/Frage12.mp4",
      eyebrow: "Letzte Frage",
      title: "Welcher Monat ist gesucht?",
      answers: ["September"],
      displayAnswer: "September",
      slotIndex: 11,
      letter: "S"
    }
  ]
};
