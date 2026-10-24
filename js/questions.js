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
        // Name that song, Songless-style: the host plays 0.3s, then 1s, 2s, 8s
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
    name: "Movies",
    questions: [
      { question: "In The Lion King, what is the name of Simba's mother?", answer: "Sarabi" },
      { question: "In the Harry Potter movies, what is the name of the Weasley family's home?", answer: "The Burrow" },
      { question: "Which movie won the very first Oscar for Best Animated Feature, in 2002?", answer: "Shrek" },
      { question: "Which director made Jaws, E.T. and Jurassic Park?", answer: "Steven Spielberg" },
      { question: "In Titanic, what is the name of the giant blue diamond necklace?", answer: "The Heart of the Ocean" },
    ],
  },
  {
    name: "History",
    questions: [
      { question: "Who was the first woman to become Prime Minister of the United Kingdom?", answer: "Margaret Thatcher" },
      { question: "What was the name of the secret revolutionary society Andrés Bonifacio founded in 1892?", answer: "The Katipunan" },
      { question: "Genghis Khan founded which empire, the largest connected land empire in history?", answer: "The Mongol Empire" },
      { question: "Which ancient Roman city was buried by the eruption of Mount Vesuvius in 79 AD?", answer: "Pompeii" },
      { question: "In 1953, who reached the top of Mount Everest along with Tenzing Norgay?", answer: "Edmund Hillary" },
    ],
  },
  {
    name: "Human Body",
    questions: [
      { question: "What is the longest bone in the human body?", answer: "The femur (thigh bone)" },
      { question: "Which organ makes insulin?", answer: "The pancreas" },
      { question: "Which colored part of the eye controls how much light gets in?", answer: "The iris" },
      { question: "Counting wisdom teeth, how many teeth does an adult usually have?", answer: "32" },
      { question: "What is the smallest bone in the human body, found inside the ear?", answer: "The stapes (stirrup)" },
    ],
  },
  {
    name: "Food & Drink",
    questions: [
      { question: "Paella, a rice dish cooked in a wide, flat pan, comes from which country?", answer: "Spain" },
      { question: "What is the main ingredient in hummus?", answer: "Chickpeas" },
      { question: "Which country grows the most coffee in the world?", answer: "Brazil" },
      { question: "What type of pastry is used to make éclairs and cream puffs?", answer: "Choux pastry" },
      { question: "Which spice, the most expensive in the world by weight, comes from the crocus flower?", answer: "Saffron" },
    ],
  },
  {
    name: "Sports",
    questions: [
      { question: "In golf, what do you call a score of one under par on a hole?", answer: "A birdie" },
      { question: "The Stanley Cup is the championship trophy in which sport?", answer: "Ice hockey" },
      { question: "Which country hosted the first modern Olympic Games, in 1896?", answer: "Greece" },
      { question: "To the nearest kilometer, how long is a marathon?", answer: "42 km (42.195 km)" },
      { question: "In Tokyo 2020, who became the first Filipino to win an Olympic gold medal?", answer: "Hidilyn Diaz" },
    ],
  },
  {
    name: "Animal Kingdom",
    questions: [
      { question: "What is a group of crows called?", answer: "A murder" },
      { question: "Which land animal has the longest pregnancy, lasting almost two years?", answer: "The elephant" },
      { question: "What color is a polar bear's skin underneath its fur?", answer: "Black" },
      { question: "The tiny tarsier found in Bohol is which type of animal: a rodent, a primate, or a marsupial?", answer: "A primate" },
      { question: "Which Australian animal has fingerprints so similar to a human's that they've confused crime scene investigators?", answer: "The koala" },
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
    question: "Name a book you go to for answers",
    answers: [
      { answer: "Dictionary", points: 26, also: ["Dictionaries"] },
      { answer: "Bible", points: 21, also: ["The Bible", "Holy Bible"] },
      { answer: "Encyclopedia", points: 19, also: ["Britannica", "Encyclopedias"] },
      { answer: "Textbook", points: 10, also: ["School book", "Textbooks"] },
      { answer: "Cookbook", points: 7, also: ["Recipe book", "Cook book"] },
      { answer: "Thesaurus", points: 6 },
      { answer: "Phone book", points: 5, also: ["Yellow pages", "Phonebook"] },
      { answer: "Atlas", points: 3, also: ["Map", "Map book"] },
      { answer: "Manual", points: 3, also: ["Instruction manual", "User manual", "Instructions"] },
    ],
  },
  {
    question: "Name a fruit that's yellow",
    answers: [
      { answer: "Banana", points: 30, also: ["Bananas", "Saging"] },
      { answer: "Lemon", points: 26, also: ["Lemons"] },
      { answer: "Mango", points: 20, also: ["Mangoes", "Mangga"] },
      { answer: "Pineapple", points: 13, also: ["Pinya"] },
      { answer: "Starfruit", points: 4, also: ["Star fruit", "Balimbing"] },
      { answer: "Jackfruit", points: 4, also: ["Langka"] },
      { answer: "Papaya", points: 3 },
    ],
  },
  {
    question: "Name something in your house with four legs",
    answers: [
      { answer: "Table", points: 28, also: ["Tables", "Dining table", "Coffee table", "Desk"] },
      { answer: "Chair", points: 26, also: ["Chairs", "Stool"] },
      { answer: "Pet", points: 22, also: ["Dog", "Cat", "Pets", "Puppy"] },
      { answer: "Bed", points: 13, also: ["Bed frame"] },
      { answer: "Insect", points: 7, also: ["Bug", "Bugs", "Cockroach", "Ipis", "Ant", "Spider"] },
      { answer: "Couch", points: 4, also: ["Sofa"] },
    ],
  },
  {
    question: "Name an excuse for not doing your homework",
    answers: [
      { answer: "The dog ate it", points: 28, also: ["Dog ate it", "My dog ate it", "Dog"] },
      { answer: "Forgot", points: 22, also: ["I forgot", "Forgot about it", "Forget"] },
      { answer: "Left it at home", points: 14, also: ["Left at home", "At home", "Left it"] },
      { answer: "Too busy", points: 12, also: ["Busy", "No time", "Didn't have time"] },
      { answer: "Was sick", points: 10, also: ["Sick", "Not feeling well", "Got sick"] },
      { answer: "Didn't understand it", points: 6, also: ["Too hard", "Confused", "Didn't understand"] },
      { answer: "Computer problems", points: 5, also: ["Computer broke", "Internet", "Wi-Fi", "Printer", "Laptop", "Brownout"] },
      { answer: "Lost it", points: 3, also: ["Lost", "Lost my homework"] },
    ],
  },
  {
    question: "Name a food you eat with your hands",
    answers: [
      { answer: "Pizza", points: 26 },
      { answer: "Burger", points: 20, also: ["Hamburger", "Burgers", "Cheeseburger"] },
      { answer: "Fries", points: 16, also: ["French fries"] },
      { answer: "Fried chicken", points: 14, also: ["Chicken", "Chickenjoy", "Wings", "Chicken wings"] },
      { answer: "Sandwich", points: 9, also: ["Sandwiches", "Sub"] },
      { answer: "Tacos", points: 6, also: ["Taco", "Burrito"] },
      { answer: "Kamayan", points: 5, also: ["Boodle fight", "Rice"] },
      { answer: "Hot dog", points: 4, also: ["Hotdog", "Hot dogs"] },
    ],
  },
];
