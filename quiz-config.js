/*
  Zentrale Konfiguration für Leopolds Quiz.

  Ordnerstruktur unter "files":
    files/Intro/01.mp4 ... 03.mp4
    files/Fragen/01.mp4 ... 13.mp4
    files/Richtig/01.mp4 ... 13.mp4
    files/Falsch/01.mp4 ... 13.mp4

  Ablauf:
  - Vor dem eigentlichen Rätsel werden die drei Intro-/Moderationsvideos abgespielt.
  - Frage 01 ergibt die Zahl 12.
  - Danach erscheinen 12 Platzhalter für "CANIS AUREUS".
  - Die Fragen 02 bis 13 liefern alle 12 Zeichen – inklusive Leerzeichen.

  Die Texte "eyebrow", "title" und "hint" können pro Frage frei angepasst werden.
*/

window.QUIZ_CONFIG = {
  finalPhrase: "CANIS AUREUS",
  slots: ["C", "A", "N", "I", "S", " ", "A", "U", "R", "E", "U", "S"],

  media: {
    introVideos: [
      "files/Intro/01.mp4",
      "files/Intro/02.mp4",
      "files/Intro/03.mp4"
    ],
    questionsDirectory: "files/Fragen",
    correctDirectory: "files/Richtig",
    wrongDirectory: "files/Falsch",
    postImages: ["files/bild01.png", "files/bild02.png"]
  },

  moderatorOptions: [
    { label: "Johannes / Martin", preferred: true },
    { label: "Günther Jauch" },
    { label: "Stefan Raab" },
    { label: "Thomas Gottschalk" },
    { label: "Leopold selbst" }
  ],

  questions: [
    {
      id: 1,
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
      eyebrow: "Wetterwissen",
      title: "Wie lautet das gesuchte Wort?",
      hint: "Gib das vollständige Lösungswort aus dem Video ein.",
      answers: ["Cumulonimbus"],
      displayAnswer: "Cumulonimbus",
      slotIndex: 0,
      letter: "C"
    },
    {
      id: 3,
      eyebrow: "Werwölfe",
      title: "Wie lautet das gesuchte Wort?",
      hint: "Gib das vollständige Lösungswort aus dem Video ein.",
      answers: ["Amor"],
      displayAnswer: "Amor",
      slotIndex: 1,
      letter: "A"
    },
    {
      id: 4,
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
      eyebrow: "Sport & Physik",
      title: "Wie lautet das gesuchte Wort?",
      hint: "Gib das vollständige Lösungswort aus dem Video ein.",
      answers: ["Spin"],
      displayAnswer: "Spin",
      slotIndex: 4,
      letter: "S"
    },
    {
      id: 7,
      eyebrow: "Eine kleine Lücke",
      title: "Was gehört an diese Stelle?",
      hint: "Auch ein Leerzeichen ist ein Zeichen.",
      answers: ["Leerzeichen", "Leerstelle", "Space"],
      displayAnswer: "Leerzeichen",
      slotIndex: 5,
      letter: " ",
      provisional: true
    },
    {
      id: 8,
      eyebrow: "Ein Name gesucht",
      title: "Welcher Name ist gesucht?",
      hint: "Gib den vollständigen Namen aus dem Video ein.",
      answers: ["Alia"],
      displayAnswer: "Alia",
      slotIndex: 6,
      letter: "A"
    },
    {
      id: 9,
      eyebrow: "Kims Rätsel",
      title: "Wie lautet das gesuchte Wort?",
      hint: "Diese Frage kann später in der Konfiguration ergänzt werden.",
      answers: ["U"],
      displayAnswer: "U (vorläufig)",
      slotIndex: 7,
      letter: "U",
      provisional: true
    },
    {
      id: 10,
      eyebrow: "Physik",
      title: "Welche physikalische Größe ist gesucht?",
      hint: "Gib die vollständige Lösung oder das passende Formelzeichen ein.",
      answers: ["Widerstand", "elektrischer Widerstand", "R"],
      displayAnswer: "Widerstand",
      slotIndex: 8,
      letter: "R"
    },
    {
      id: 11,
      eyebrow: "Schmalkalden",
      title: "Welche Kulturepoche ist gesucht?",
      hint: "Gib die vollständige Kulturepoche ein.",
      answers: ["Renaissance"],
      displayAnswer: "Renaissance",
      slotIndex: 9,
      letter: "E"
    },
    {
      id: 12,
      eyebrow: "Eine kleine Pause",
      title: "Welches Wort bzw. Getränk ist gesucht?",
      hint: "Mehrere passende Antworten werden akzeptiert.",
      answers: ["Ulmer Export", "Ur-Krostitzer", "Ur Krostitzer", "U"],
      displayAnswer: "Ulmer Export / Ur-Krostitzer",
      slotIndex: 10,
      letter: "U"
    },
    {
      id: 13,
      eyebrow: "Letzte Frage",
      title: "Welcher Monat ist gesucht?",
      hint: "Gib den vollständigen Monat ein.",
      answers: ["September"],
      displayAnswer: "September",
      slotIndex: 11,
      letter: "S"
    }
  ]
};
