window.QUIZ_CONFIG = {
  finalPhrase: "CANIS AUREUS",
  slots: ["C", "A", "N", "I", "S", " ", "A", "U", "R", "E", "U", "S"],
  media: {
    introVideos: [
      "files/Intro/01.mp4",
      "files/Intro/02.mp4",
      "files/Intro/03.mp4"
    ],
    finaleVideo: "files/Intro/04..mp4",
    questionsDirectory: "files/Fragen",
    correctDirectory: "files/Richtig",
    wrongDirectory: "files/Falsch",
    postImages: ["files/bild01.png", "files/bild02.png"]
  },
  moderatorOptions: [
    { label: "Johannes / Martin", preferred: true },
    { label: "Günther Jauch" },
    { label: "Stefan Raab" },
    { label: "Thomas Gottschalk" }
  ],
  questions: [
    {
      id: 1,
      eyebrow: "Zum Warmwerden",
      title: "Welche Zahl ist gesucht?",
      hint: "f(x)=x²−24x+180 - Bestimme die x-Koordinate des Scheitelpunkts der Parabel. Gib nur das Ergebnis ein. Es verrät dir gleich, wie viele Zeichen dein Lösungswort hat.",
      answers: ["12", "zwölf", "zwoelf"],
      displayAnswer: "12",
      slotIndex: null,
      letter: null
    },
    {
      id: 2,
      eyebrow: "Wetterexperte gefragt",
      title: "Welches Lösungswort ist gesucht?",
      hint: "Gib den vollständigen Namen der Wolke ein. Ist er richtig, landet automatisch der erste Buchstabe im Lösungswort.",
      answers: ["Cumulonimbus"],
      displayAnswer: "Cumulonimbus",
      slotIndex: 0,
      letter: "C"
    },
    {
      id: 3,
      eyebrow: "K1 lässt grüßen",
      title: "Welcher Name ist gesucht?",
      hint: "Gib den vollständigen Namen ein. Ist er richtig, wird automatisch der passende Anfangsbuchstabe übernommen.",
      answers: ["Alia"],
      displayAnswer: "Alia",
      slotIndex: 1,
      letter: "A"
    },
    {
      id: 4,
      eyebrow: "Leo, responde huic quaestioni!",
      title: "Was verbindet die genannten Lehrer?",
      hint: "Denk nicht zu kompliziert, die Lösung ist sehr kurz.",
      answers: ["N"],
      displayAnswer: "N",
      slotIndex: 2,
      letter: "N"
    },
    {
      id: 5,
      eyebrow: "Ortschaften verbinden",
      title: "Was haben die genannten Orte gemeinsam?",
      hint: "Hierfür musst du vielleicht mal um die Ecke denken. Es geht hier nämlich nicht nur um Buchstaben… und doch ist ein Buchstabe die Lösung.",
      answers: ["I"],
      displayAnswer: "I",
      slotIndex: 3,
      letter: "I"
    },
    {
      id: 6,
      eyebrow: "Sport trifft Physik",
      title: "Welches Lösungswort ist gesucht?",
      hint: "Gib das ganze Wort ein. Ist es richtig, wird automatisch der erste Buchstabe übernommen.",
      answers: ["Spin"],
      displayAnswer: "Spin",
      slotIndex: 4,
      letter: "S"
    },
    {
      id: 7,
      landscape: true,
      eyebrow: "Mut zur Lücke",
      title: "Welches Zeichen ist gesucht?",
      hint: "Gib den Namen des Zeichens ein. Ist es richtig, wird die Lücke im Lösungswort automatisch gefüllt.",
      answers: ["Leerzeichen", "Leerstelle", "Space"],
      displayAnswer: "Leerzeichen",
      slotIndex: 5,
      letter: " "
    },
    {
      id: 8,
      videoFiles: ["08-1.mp4", "08-2.mp4"],
      eyebrow: "Die Wölfe sind los!",
      title: "Welche Spielfigur ist gesucht?",
      hint: "Gib den vollständigen Namen der Figur ein. Ist er richtig, wird automatisch ihr Anfangsbuchstabe übernommen.",
      answers: ["Amor"],
      displayAnswer: "Amor",
      slotIndex: 6,
      letter: "A"
    },
    {
      id: 9,
      eyebrow: "Kurz und persönlich",
      title: "Was das wohl bedeutet?",
      hint: "Perhaps, Leonard can answer?",
      answers: ["U"],
      displayAnswer: "U",
      slotIndex: 7,
      letter: "U"
    },
    {
      id: 10,
      correctVideoFiles: ["10-1.mp4", "10-2.mp4", "10-3.mp4"],
      eyebrow: "Newton, Tesla, Einstein, Wolf",
      title: "Welches Formelzeichen ist gesucht?",
      hint: "Diese Frage kannst du nur beantworten, wenn du auch Teil der Physik-Elite bist",
      answers: ["R"],
      displayAnswer: "R",
      slotIndex: 8,
      letter: "R"
    },
    {
      id: 11,
      eyebrow: "Schmalkalden mit Geschichte",
      title: "Welche Kulturepoche ist gesucht?",
      hint: "Gib das ganze Wort ein. Ist es richtig, wird automatisch der letzte Buchstabe ausgewählt.",
      answers: ["Renaissance"],
      displayAnswer: "Renaissance",
      slotIndex: 9,
      letter: "E"
    },
    {
      id: 12,
      eyebrow: "Zeit für eine kurze Pause",
      title: "Endlich kannst du dich einfach mal entspannen. Schön, oder?",
      hint: "Wenn du nicht weiter weißt, trink doch einfach mal ein Bier!",
      answers: ["U"],
      displayAnswer: "U",
      slotIndex: 10,
      letter: "U"
    },
    {
      id: 13,
      eyebrow: "Finale in Fambach",
      title: "Welcher Monat ist gesucht?",
      hint: "Gib den vollständigen Monat ein. Ist er richtig, wird automatisch sein erster Buchstabe als letztes Zeichen übernommen.",
      answers: ["September"],
      displayAnswer: "September",
      slotIndex: 11,
      letter: "S"
    }
  ]
};
