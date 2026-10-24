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
        // The question is just emojis: name the movie
        name: "Emoji Movies",
        questions: [
          { value: 100, question: "🕷️👦🏙️", answer: "Spider-Man", special: false },
          { value: 200, question: "🔍🐠🌊", answer: "Finding Nemo", special: false },
          { value: 300, question: "🤠🚀🧸", answer: "Toy Story", special: false },
          { value: 400, question: "👻👻🚫", answer: "Ghostbusters", special: false },
          { value: 500, question: "🍫🏭🎫", answer: "Charlie and the Chocolate Factory", special: false },
        ],
      },
      {
        // Countries, cities and landmarks
        name: "Around the World",
        questions: [
          { value: 100, question: "Kangaroos and koalas are found in the wild only in this country", answer: "Australia", special: false },
          { value: 200, question: "Known as the \"Land of the Rising Sun\", this island country is home to Mount Fuji", answer: "Japan", special: false },
          { value: 300, question: "This South American country is named after the imaginary line that runs right through it", answer: "Ecuador", special: false },
          { value: 400, question: "This is the smallest country in the world, and it sits completely inside the city of Rome", answer: "Vatican City", special: false },
          { value: 500, question: "This African country has more ancient pyramids than Egypt, with over 200 built by the kingdom of Kush", answer: "Sudan", special: false },
        ],
      },
      {
        // Filipino food — "Let's eat!"
        name: "Kain Tayo",
        questions: [
          { value: 100, question: "Bay leaves, whole peppercorns and garlic go into this dish, where the meat is slowly simmered in vinegar and soy sauce until tender", answer: "Adobo", special: false },
          { value: 200, question: "This sour broth can be made with pork, shrimp or bangus, and gets its tang from guava, kamias or the classic sampalok", answer: "Sinigang", special: false },
          { value: 300, question: "Ground pork, carrots and onions are rolled up tightly in a thin wrapper, then deep-fried until golden and crunchy", answer: "Lumpia", special: false },
          { value: 400, question: "A whole pig is rubbed with salt, stuffed with lemongrass, garlic and onions, then roasted over charcoal for hours until the skin turns crispy", answer: "Lechon", special: false },
          { value: 500, question: "Named after a train line, this fiery dish of pork cooked in coconut milk with shrimp paste and lots of chilies was actually created in Manila", answer: "Bicol Express", special: false },
        ],
      },
      {
        // Name that song, Songless-style: the host plays 0.5s, then 1s, 2s, 8s
        // and 15s of it (song-player.js). The songs are in assets/audio/songs/.
        // Optional audioStart: 42.5 starts the clips 42.5 seconds in.
        name: "Love at First Listen",
        questions: [
          { value: 100, question: "Name that love song", answer: "Just the Way You Are (Bruno Mars)", audio: "assets/audio/songs/just-the-way-you-are.mp3", special: false },
          { value: 200, question: "Name that love song", answer: "My Heart Will Go On (Celine Dion)", audio: "assets/audio/songs/my-heart-will-go-on.mp3", special: false },
          { value: 300, question: "Name that love song", answer: "Photograph (Ed Sheeran)", audio: "assets/audio/songs/photograph.mp3", special: false },
          { value: 400, question: "Name that love song", answer: "Risk It All (Bruno Mars)", audio: "assets/audio/songs/risk-it-all.mp3", special: false },
          { value: 500, question: "Name that love song", answer: "Can't Help Falling in Love (Elvis Presley)", audio: "assets/audio/songs/cant-help-falling-in-love.mp3", special: false },
        ],
      },
      {
        // Rooms, furniture and household items
        name: "Home Sweet Home",
        questions: [
          { value: 100, question: "The stove, the oven and the fridge are all usually found in this room", answer: "Kitchen", special: false },
          { value: 200, question: "This countertop appliance blows super-hot air around food to make it crispy, like frying but with little or no oil", answer: "Air fryer", special: false },
          { value: 300, question: "This bathroom fixture, common in Europe, sits next to the toilet and sprays water to wash you", answer: "Bidet", special: false },
          { value: 400, question: "This bathroom tool has a wooden handle and a rubber cup on the end, and it's what you grab when the toilet gets clogged", answer: "Plunger", special: false },
          { value: 500, question: "The inner pot of this kitchen appliance has numbered water lines inside, but you can just ignore them and measure the water up to the first knuckle of your finger", answer: "Rice cooker", special: false },
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
          { value: 200,  question: "In this 2009 Pixar movie, a grumpy old man ties thousands of balloons to his house and flies away", answer: "Up", special: false },
          { value: 400,  question: "This planet is nicknamed the Red Planet", answer: "Mars", special: false },
          { value: 600,  question: "This continent has the most countries, with 54 of them", answer: "Africa", special: false },
          { value: 800,  question: "This French emperor was finally defeated at the Battle of Waterloo in 1815", answer: "Napoleon", special: false },
          { value: 1000, question: "This fancy light fixture hangs from the ceiling, often dripping with sparkling crystals", answer: "Chandelier", special: false },
        ],
      },
      {
        // Name the year it happened
        name: "Name That Year",
        questions: [
          { value: 200,  question: "COVID-19 was declared a pandemic and lockdowns started all over the world in this year", answer: "2020", special: false },
          { value: 400,  question: "The Titanic hit an iceberg and sank on its very first voyage in this year", answer: "1912", special: false },
          { value: 600,  question: "Steve Jobs showed off the very first iPhone in this year", answer: "2007", special: false },
          { value: 800,  question: "Neil Armstrong became the first person to walk on the Moon in this year", answer: "1969", special: false },
          { value: 1000, question: "World War I ended in this year", answer: "1918", special: false },
        ],
      },
      {
        // "I love you" around the world: name the language
        name: "Love Language",
        questions: [
          { value: 200,  question: "\"Mahal kita\" means \"I love you\" in this language", answer: "Tagalog (Filipino)", special: false },
          { value: 400,  question: "\"사랑해\" (Saranghae) means \"I love you\" in this language", answer: "Korean", special: false },
          { value: 600,  question: "\"Ich liebe dich\" means \"I love you\" in this language", answer: "German", special: false },
          { value: 800,  question: "\"Eu te amo\" means \"I love you\" in this language", answer: "Portuguese", special: false },
          { value: 1000, question: "\"ฉันรักคุณ\" (Chan rak khun) means \"I love you\" in this language", answer: "Thai", special: false },
        ],
      },
      {
        // Pets you can keep at home in Canada
        name: "Pawsitive Knowledge",
        questions: [
          { value: 200,  question: "This small rodent is known for stuffing food into its cheek pouches and running on an exercise wheel", answer: "Hamster", special: false },
          { value: 400,  question: "This pet has long ears, a fluffy cotton-ball tail, and loves to hop around and munch on hay", answer: "Rabbit", special: false },
          { value: 600,  question: "This long, skinny, furry pet is a cousin of the weasel, and it loves squeezing through tubes and tunnels", answer: "Ferret", special: false },
          { value: 800,  question: "Most kinds of this small lizard have no eyelids, so they lick their own eyes to keep them clean", answer: "Gecko", special: false },
          { value: 1000, question: "This pet smells the air by flicking its forked tongue, sheds its whole skin in one piece, and swallows its food whole", answer: "Snake (corn snake)", special: false },
        ],
      },
      {
        name: "Spelling Bee",
        questions: [
          // "wordInfo" only shows on the host's phone, to read out if teams ask.
          // The 🔊 button on the card says the word; "say" spells out a tricky pronunciation.
          { value: 200,  question: "Spell this word", answer: "Juxtaposition", say: "juck-stuh-puh-zish-un", special: false, wordInfo: {
            definition: "Putting two very different things side by side so their differences stand out",
            origin: "Latin \"juxta\" (next to) + French \"position\" (placing)",
            sentence: "The juxtaposition of the tiny puppy and the huge dog made everyone laugh.",
          } },
          { value: 400,  question: "Spell this word", answer: "Cymotrichous", say: "sigh-mott-trick-us", special: false, wordInfo: {
            definition: "Having wavy hair",
            origin: "Greek: \"kyma\" (wave) + \"thrix, trichos\" (hair)",
            sentence: "She was born with cymotrichous hair that curled up whenever it rained.",
          } },
          { value: 600,  question: "Spell this word", answer: "Sesquipedalian", say: "sess-kwih-pih-day-lee-un", special: false, wordInfo: {
            definition: "Having lots of syllables (a very long word); or someone who loves using long words",
            origin: "Latin: \"sesquipedalis\" (a foot and a half long), from \"sesqui-\" (one and a half) + \"pes\" (foot)",
            sentence: "His sesquipedalian vocabulary made his essays hard to read.",
          } },
          { value: 800,  question: "Spell this word", answer: "Tintinnabulation", say: "tin-tin-nab-yoo-lay-shun", special: false, wordInfo: {
            definition: "The ringing or jingling sound of bells",
            origin: "Latin: \"tintinnabulum\" (a bell), from \"tintinnare\" (to ring); made famous by Edgar Allan Poe's poem \"The Bells\"",
            sentence: "The tintinnabulation of the church bells filled the town on Christmas morning.",
          } },
          { value: 1000, question: "Spell this word", answer: "Arachibutyrophobia", say: "uh-rack-ih-byoo-tih-roh-foe-bee-uh", special: false, wordInfo: {
            definition: "The fear of peanut butter sticking to the roof of your mouth",
            origin: "Greek and Latin: \"arachis\" (peanut) + \"butyrum\" (butter) + \"phobia\" (fear)",
            sentence: "His arachibutyrophobia means he only eats his sandwiches with jam.",
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
