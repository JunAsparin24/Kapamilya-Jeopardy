/* =========================================================
   questions.js — ALL trivia content lives here.

   To change a question, edit its line. For example:
     { value: 300, question: "What is...?", answer: "...", special: false },

   - The board draws itself from this data, so there's no HTML to touch.
   - Questions are listed top-to-bottom as they appear on the board.
   - Each round has its own category names (the "name" lines).
   - "image" (optional) shows a picture on the question card, e.g.
       image: "assets/images/flags/philippines.svg"
     Put picture files in assets/images/. "imageAlt" (optional) describes
     the picture for screen readers — never include the answer in it.
     A picture question can have no text at all (question: ""), like the
     Flags — then the card shows just the picture, bigger.
   - "answerImage" (optional) is a second picture that replaces "image"
     when the answer is shown, like a silhouette turning into the real thing.
   - The hidden GOLDEN BOOST lands on a RANDOM question each round, so
     it's somewhere new every game. To pick the spot yourself instead,
     set RANDOM_GOLDEN_BOOST to false in game.js and put "special: true"
     on the question you want (one per round).
   ========================================================= */

const gameData = {
  // -------------------------------------------------------
  // ROUND 1 — $100 to $500
  // -------------------------------------------------------
  round1: {
    categories: [
      {
        name: "High School Trivia",
        questions: [
          { value: 100, question: "This is the chemical formula for water", answer: "H2O", special: false },
          { value: 200, question: "In this Shakespeare play, a Scottish general murders the king after three witches tell him he will take the throne", answer: "Macbeth", special: false },
          { value: 300, question: "Each angle of an equilateral triangle measures this many degrees", answer: "60 degrees", special: false },
          { value: 400, question: "In chemistry, this is the name for the number of protons in an atom", answer: "Atomic number", special: false },
          { value: 500, question: "This is the name of the famous sequence where each number is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8, 13...", answer: "The Fibonacci sequence", special: false },
        ],
      },
      {
        // Picture questions: name the brand. The logos are in assets/images/logos/.
        name: "Logo Motion",
        questions: [
          { value: 100, question: "", answer: "Target", image: "assets/images/logos/target.svg", imageAlt: "A company's logo", special: false },
          { value: 200, question: "", answer: "Mastercard", image: "assets/images/logos/mastercard.svg", imageAlt: "A company's logo", special: false },
          { value: 300, question: "", answer: "Audi", image: "assets/images/logos/audi.svg", imageAlt: "A company's logo", special: false },
          { value: 400, question: "", answer: "Mitsubishi", image: "assets/images/logos/mitsubishi.svg", imageAlt: "A company's logo", special: false },
          { value: 500, question: "", answer: "Beats (by Dr. Dre)", image: "assets/images/logos/beats.svg", imageAlt: "A company's logo", special: false },
        ],
      },
      {
        name: "Creature Feature",
        questions: [
          { value: 100, question: "This is the only mammal that can truly fly", answer: "Bat", special: false },
          { value: 200, question: "This tiny bird is the only one that can fly backwards", answer: "Hummingbird", special: false },
          { value: 300, question: "This Australian animal has fingerprints so similar to a human's that they have confused crime scene investigators", answer: "Koala", special: false },
          { value: 400, question: "This is the name for a group of flamingos", answer: "A flamboyance", special: false },
          { value: 500, question: "This is the only mammal covered in scales, and it rolls into a tight ball when it feels threatened", answer: "Pangolin", special: false },
        ],
      },
      {
        // Silhouettes, like the TV show: "image" is the shadow, and "answerImage"
        // is the full-colour picture that replaces it when the answer is shown.
        name: "Who's That Pokémon?",
        questions: [
          { value: 100, question: "", answer: "Squirtle", image: "assets/images/pokemon/squirtle-silhouette.png", answerImage: "assets/images/pokemon/squirtle.png", imageAlt: "The silhouette of a Pokémon", special: false },
          { value: 200, question: "", answer: "Mew", image: "assets/images/pokemon/mew-silhouette.png", answerImage: "assets/images/pokemon/mew.png", imageAlt: "The silhouette of a Pokémon", special: false },
          { value: 300, question: "", answer: "Giratina", image: "assets/images/pokemon/giratina-silhouette.png", answerImage: "assets/images/pokemon/giratina.png", imageAlt: "The silhouette of a Pokémon", special: false },
          { value: 400, question: "", answer: "Groudon", image: "assets/images/pokemon/groudon-silhouette.png", answerImage: "assets/images/pokemon/groudon.png", imageAlt: "The silhouette of a Pokémon", special: false },
          { value: 500, question: "", answer: "Celebi", image: "assets/images/pokemon/celebi-silhouette.png", answerImage: "assets/images/pokemon/celebi.png", imageAlt: "The silhouette of a Pokémon", special: false },
        ],
      },
      {
        // The host reads a statement. "Cap" = it's false. "No cap" = it's true.
        name: "Cap or No Cap?",
        questions: [
          { value: 100, question: "Goldfish only have a three-second memory", answer: "Cap", special: false },
          { value: 200, question: "Honey never goes bad. Jars found in ancient Egyptian tombs were still safe to eat", answer: "No cap", special: false },
          { value: 300, question: "Lightning never strikes the same place twice", answer: "Cap", special: false },
          { value: 400, question: "Sharks have been around longer than trees", answer: "No cap", special: false },
          { value: 500, question: "On Venus, one day is longer than one year", answer: "No cap", special: false },
        ],
      },
    ],
  },

  // -------------------------------------------------------
  // ROUND 2 — $200 to $1000
  // -------------------------------------------------------
  round2: {
    categories: [
      {
        // The number of letters in each answer matches the value: $800 = 8 letters
        name: "Spell Your Worth",
        questions: [
          { value: 200,  question: "This ancient Chinese board game is played with black and white stones on a grid", answer: "Go", special: false },
          { value: 400,  question: "This city is the capital of Peru", answer: "Lima", special: false },
          { value: 600,  question: "This Italian city is built on water and is famous for its canals and gondolas", answer: "Venice", special: false },
          { value: 800,  question: "This scientist came up with the theory of relativity and the equation E = mc²", answer: "Einstein", special: false },
          { value: 1000, question: "This icicle-shaped rock formation hangs down from the ceiling of a cave", answer: "Stalactite", special: false },
        ],
      },
      {
        // Rearrange every letter of the word in CAPITALS to make the answer
        name: "Anagrams",
        questions: [
          { value: 200,  question: "Rearrange the letters of EARTH to get the organ that pumps your blood", answer: "Heart", special: false },
          { value: 400,  question: "Rearrange the letters of LISTEN to get a word that means quiet", answer: "Silent", special: false },
          { value: 600,  question: "Rearrange the letters of STRESSED to get something sweet you eat after dinner", answer: "Desserts", special: false },
          { value: 800,  question: "Rearrange the letters of DORMITORY to get two words that describe a messy bedroom", answer: "Dirty room", special: false },
          { value: 1000, question: "Rearrange the letters of ASTRONOMER to get two words for someone who gazes at the night sky", answer: "Moon starer", special: false },
        ],
      },
      {
        name: "Flags",
        questions: [
          { value: 200,  question: "", answer: "Philippines", image: "assets/images/flags/philippines.svg", imageAlt: "A country's flag", special: false },
          { value: 400,  question: "", answer: "Egypt", image: "assets/images/flags/egypt.svg", imageAlt: "A country's flag", special: false },
          { value: 600,  question: "", answer: "Nepal", image: "assets/images/flags/nepal.svg", imageAlt: "A country's flag", special: false },
          { value: 800,  question: "", answer: "Singapore", image: "assets/images/flags/singapore.svg", imageAlt: "A country's flag", special: false },
          { value: 1000, question: "", answer: "Czech Republic", image: "assets/images/flags/czech-republic.svg", imageAlt: "A country's flag", special: false },
        ],
      },
      {
        // Which was searched more on Google? Every answer is a category winner
        // from Google's "25 Years in Search" list (December 2023).
        name: "What's Trending?",
        questions: [
          { value: 200,  question: "Which sport has been searched more on Google of all time: basketball or soccer?", answer: "Soccer", special: false },
          { value: 400,  question: "Which landmark has been searched more on Google of all time: the Eiffel Tower or the Statue of Liberty?", answer: "The Eiffel Tower", special: false },
          { value: 600,  question: "Which superhero has been searched more on Google of all time: Batman or Spider-Man?", answer: "Spider-Man", special: false },
          { value: 800,  question: "Which boy band has been searched more on Google of all time: BTS or One Direction?", answer: "BTS", special: false },
          { value: 1000, question: "Which princess has been searched more on Google of all time: Cinderella or Ariel?", answer: "Ariel", special: false },
        ],
      },
      {
        name: "Spelling Bee",
        questions: [
          // "wordInfo" only shows on the host's phone, to read out if teams ask
          { value: 200,  question: "Spell this word", answer: "Lieutenant", special: false, wordInfo: {
            definition: "An officer in the military or the police, ranked just below a captain",
            origin: "French: \"lieu\" (place) + \"tenant\" (holding), someone who holds the place of a superior",
            sentence: "The lieutenant gave the order to move out.",
          } },
          { value: 400,  question: "Spell this word", answer: "Pterodactyl", special: false, wordInfo: {
            definition: "A flying reptile with leathery wings that lived in the time of the dinosaurs",
            origin: "Greek: \"pteron\" (wing) + \"daktylos\" (finger), so \"winged finger\"",
            sentence: "The pterodactyl swooped down over the water to catch a fish.",
          } },
          { value: 600,  question: "Spell this word", answer: "Vinaigrette", special: false, wordInfo: {
            definition: "A salad dressing made from oil and vinegar, often with herbs or mustard",
            origin: "French, from \"vinaigre\" (vinegar), which literally means \"sour wine\"",
            sentence: "She tossed the salad with a lemon vinaigrette.",
          } },
          { value: 800,  question: "Spell this word", answer: "Dilettante", special: false, wordInfo: {
            definition: "Someone who dabbles in an art or a subject for fun, without studying it seriously",
            origin: "Italian, from \"dilettare\" (to delight), from Latin \"delectare\"",
            sentence: "He called himself a painter, but he was really a dilettante who never finished a canvas.",
          } },
          { value: 1000, question: "Spell this word", answer: "Asphyxiation", special: false, wordInfo: {
            definition: "Being unable to breathe, so the body does not get enough oxygen",
            origin: "Greek: \"a-\" (without) + \"sphyxis\" (pulse), so \"without a pulse\"",
            sentence: "Firefighters wear masks to protect themselves from asphyxiation by smoke.",
          } },
        ],
      },
    ],
  },
};

// -------------------------------------------------------
// FINAL WAGER — after the last round (final-wager.js).
// The host presses a button and ONE category is picked at random.
// Then teams wager on their phones (up to the points they have)
// and answer on their whiteboards within FINAL_WAGER_SECONDS.
// Right = + wager, wrong = − wager.
//
// Each category has several questions; one is picked AT RANDOM
// every game. Add or remove questions freely (at least one each),
// and add whole categories too.
// -------------------------------------------------------
const FINAL_WAGER_SECONDS = 60;

const finalWagerQuestions = [
  {
    name: "Pop Culture",
    questions: [
      { question: "In the TV show Friends, what is the name of the coffee shop where the group always hangs out?", answer: "Central Perk" },
      { question: "In the TV show The Office, what is the name of the paper company everyone works for?", answer: "Dunder Mifflin" },
      { question: "In Star Wars, what is the name of Han Solo's ship?", answer: "The Millennium Falcon" },
      { question: "In The Hunger Games, which district is Katniss Everdeen from?", answer: "District 12" },
      { question: "In the show Squid Game, what is the player number of the main character, Seong Gi-hun?", answer: "456" },
    ],
  },
  {
    name: "History",
    questions: [
      { question: "Which wall, built to split a European city in two, was torn down in 1989?", answer: "The Berlin Wall" },
      { question: "Who was the first woman to win a Nobel Prize?", answer: "Marie Curie" },
      { question: "Which ancient empire built Machu Picchu, high in the mountains of Peru?", answer: "The Inca Empire" },
      { question: "In what year did World War II end?", answer: "1945" },
      { question: "Which Filipino chieftain defeated Ferdinand Magellan at the Battle of Mactan in 1521?", answer: "Lapulapu" },
    ],
  },
  {
    name: "Science",
    questions: [
      { question: "What is the only metal that is a liquid at room temperature?", answer: "Mercury" },
      { question: "Which gas do plants take in from the air to make their food?", answer: "Carbon dioxide" },
      { question: "What is the largest organ inside the human body?", answer: "The liver" },
      { question: "Which tiny particle in an atom has a negative charge?", answer: "The electron" },
      { question: "What is the most common blood type in the world?", answer: "O positive" },
    ],
  },
  {
    name: "Common Knowledge",
    questions: [
      { question: "Airplanes carry a \"black box\" flight recorder. What color is it actually painted?", answer: "Orange" },
      { question: "What are the first six letters on the top row of a standard keyboard?", answer: "QWERTY" },
      { question: "How many cards are in a standard deck, not counting the jokers?", answer: "52" },
      { question: "What do the letters \"www\" at the start of a web address stand for?", answer: "World Wide Web" },
      { question: "Counting the goalie, how many players does a hockey team have on the ice at full strength?", answer: "6" },
    ],
  },
  {
    name: "Geography",
    questions: [
      { question: "What is the capital city of Australia?", answer: "Canberra" },
      { question: "What is the longest river in South America?", answer: "The Amazon" },
      { question: "Which country has the most people in the world?", answer: "India" },
      { question: "What is the largest island in the Philippines?", answer: "Luzon" },
      { question: "What is the smallest province in Canada?", answer: "Prince Edward Island" },
    ],
  },
  {
    name: "Music",
    questions: [
      { question: "Which Filipino rock band, formed in the late 1980s, recorded \"Ang Huling El Bimbo\"?", answer: "Eraserheads" },
      { question: "How many strings does a violin have?", answer: "4" },
      { question: "Freddie Mercury was the lead singer of which band?", answer: "Queen" },
      { question: "The saxophone is made of brass, but which family of instruments does it actually belong to?", answer: "Woodwinds" },
      { question: "Which rapper from Toronto first became famous as an actor on the TV show Degrassi?", answer: "Drake" },
      { question: "What do you call a long piece of music written for a full orchestra, like Beethoven's Fifth?", answer: "A symphony" },
    ],
  },
];

// -------------------------------------------------------
// FAST MONEY — the final showdown between the top two teams
// (fast-money.js). Each team gets FAST_MONEY_SECONDS to answer
// all five questions; the host types in what they said.
//
//   answers: the survey answers and their points.
//     "Food/Snacks" matches either word.
//   also (optional): other ways people might say the same answer,
//     e.g. { answer: "Check their phone", points: 34, also: ["Scroll TikTok"] }
// -------------------------------------------------------
const FAST_MONEY_SECONDS = 60;

const fastMoneyQuestions = [
  {
    question: "Name a body part with 3 letters",
    answers: [
      { answer: "Eye", points: 22, also: ["Eyes"] },
      { answer: "Arm", points: 18, also: ["Arms"] },
      { answer: "Leg", points: 16, also: ["Legs"] },
      { answer: "Ear", points: 14, also: ["Ears"] },
      { answer: "Toe", points: 9, also: ["Toes"] },
      { answer: "Lip", points: 7, also: ["Lips"] },
      { answer: "Hip", points: 5, also: ["Hips"] },
      { answer: "Jaw", points: 4, also: ["Jaws"] },
      { answer: "Rib", points: 3, also: ["Ribs"] },
      { answer: "Gum", points: 2, also: ["Gums"] },
    ],
  },
  {
    question: "Name something you'd never share",
    answers: [
      { answer: "Toothbrush", points: 30, also: ["Tooth brush"] },
      { answer: "Underwear", points: 18, also: ["Undies", "Boxers", "Panties", "Bra", "Socks"] },
      { answer: "Password", points: 12, also: ["Passwords", "Passcode", "PIN"] },
      { answer: "Deodorant", points: 8, also: ["Deo"] },
      { answer: "Phone", points: 7, also: ["Cellphone", "Cell phone", "iPhone"] },
      { answer: "Money", points: 6, also: ["Wallet", "Bank account", "Credit card", "Cash"] },
      { answer: "Food", points: 6, also: ["Drink", "Fries", "Snacks", "Straw", "Dessert", "My plate"] },
      { answer: "Boyfriend/Girlfriend", points: 5, also: ["Husband", "Wife", "Partner", "Spouse", "My man"] },
      { answer: "Secrets", points: 4, also: ["Secret", "Diary", "Journal"] },
      { answer: "Razor", points: 2, also: ["Shaver"] },
      { answer: "Towel", points: 2, also: ["Bath towel"] },
    ],
  },
  {
    question: "Name something you squeeze to get more out of it",
    answers: [
      { answer: "Toothpaste", points: 34, also: ["Toothpaste tube", "Colgate", "Tooth paste"] },
      { answer: "Lemon", points: 16, also: ["Lemons", "Lime", "Calamansi"] },
      { answer: "Ketchup", points: 13, also: ["Ketchup bottle", "Mustard", "Mayo", "Sauce", "Condiments"] },
      { answer: "Sponge", points: 9, also: ["Rag", "Washcloth", "Wet towel", "Mop"] },
      { answer: "Lotion", points: 8, also: ["Sunscreen", "Shampoo", "Conditioner", "Soap", "Body wash"] },
      { answer: "Orange", points: 7, also: ["Oranges", "Fruit", "Juice"] },
      { answer: "Juice box", points: 5, also: ["Juice pouch", "Capri Sun", "Zesto"] },
      { answer: "Pimple", points: 4, also: ["Zit", "Pimples"] },
      { answer: "Stress ball", points: 2, also: ["Stressball"] },
      { answer: "Glue", points: 2, also: ["Glue bottle"] },
    ],
  },
  {
    question: "Name something you'd have a hard time doing if you didn't have any lips",
    answers: [
      { answer: "Talking", points: 28, also: ["Talk", "Speak", "Speaking"] },
      { answer: "Eating/Drinking", points: 22, also: ["Eat", "Drink", "Chew", "Sip", "Using a straw", "Straw"] },
      { answer: "Whistling", points: 16, also: ["Whistle"] },
      { answer: "Kissing", points: 14, also: ["Kiss", "Making out"] },
      { answer: "Smiling", points: 7, also: ["Smile"] },
      { answer: "Blowing", points: 4, also: ["Blow", "Blow out candles", "Blowing bubbles", "Bubble gum"] },
      { answer: "Putting on lipstick", points: 4, also: ["Lipstick", "Lip balm", "Chapstick", "Lip gloss", "Makeup"] },
      { answer: "Playing an instrument", points: 3, also: ["Instrument", "Trumpet", "Flute", "Play the trumpet"] },
      { answer: "Singing", points: 2, also: ["Sing"] },
    ],
  },
  {
    question: "Name a sound a farm animal makes",
    answers: [
      { answer: "Moo", points: 34, also: ["Mooo", "Cow"] },
      { answer: "Oink", points: 18, also: ["Oink oink", "Pig", "Snort"] },
      { answer: "Baa", points: 13, also: ["Baaa", "Bah", "Sheep", "Bleat"] },
      { answer: "Neigh", points: 11, also: ["Nay", "Horse", "Whinny"] },
      { answer: "Cluck", points: 8, also: ["Bawk", "Bok", "Chicken", "Hen"] },
      { answer: "Cock-a-doodle-doo", points: 7, also: ["Cockadoodledoo", "Crow", "Rooster", "Tiktilaok"] },
      { answer: "Quack", points: 6, also: ["Duck"] },
      { answer: "Maa", points: 2, also: ["Meh", "Goat"] },
      { answer: "Gobble", points: 1, also: ["Gobble gobble", "Turkey"] },
    ],
  },
];
