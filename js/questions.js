/* =========================================================
   questions.js — ALL trivia content lives here.

   To change a question, edit its line. For example:
     { value: 300, question: "What is...?", answer: "...", special: false },

   - The board draws itself from this data, so there's no HTML to touch.
   - Questions are listed top-to-bottom as they appear on the board.
   - Each round has its own category names (the "name" lines).
   - "image" (optional) shows a picture on the question card, e.g.
       image: "assets/images/flags/france.svg"
     Put picture files in assets/images/. "imageAlt" (optional) describes
     the picture for screen readers — never include the answer in it.
     A picture question can have no text at all (question: ""), like the
     Flags — then the card shows just the picture, bigger.
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
        name: "5th Grade Trivia",
        questions: [
          { value: 100, question: "This is the number of continents on Earth", answer: "Seven", special: false },
          { value: 200, question: "This is the largest ocean on Earth", answer: "Pacific Ocean", special: false },
          { value: 300, question: "This is the process plants use to make their own food from sunlight", answer: "Photosynthesis", special: false },
          { value: 400, question: "This is the largest organ of the human body", answer: "Skin", special: false },
          { value: 500, question: "This is the most abundant gas in Earth's atmosphere", answer: "Nitrogen", special: false },
        ],
      },
      {
        name: "Ang Tamis",
        questions: [
          { value: 100, question: "This shaved ice dessert is loaded with sweet beans, jellies, fruits, and milk, topped with a scoop of ube ice cream, and its name means \"mix-mix\"", answer: "Halo-halo", special: false },
          { value: 200, question: "This warm treat of soft tofu, sweet brown sugar syrup, and sago pearls is sold in the morning by street vendors who shout its name", answer: "Taho", special: false },
          { value: 300, question: "This creamy custard dessert is made with egg yolks and milk and topped with a layer of golden caramel", answer: "Leche flan", special: false },
          { value: 400, question: "This crispy snack is a banana rolled up like a spring roll and fried with caramelized brown sugar", answer: "Turon", special: false },
          { value: 500, question: "This cold, creamy dessert mixes young coconut strips with green jelly cubes flavored by a fragrant leaf, and is named after both", answer: "Buko pandan", special: false },
        ],
      },
      {
        name: "Turkey Talk",
        questions: [
          { value: 100, question: "Wild turkeys can fly in short bursts. How fast can they go, in kph?", answer: "90 kph (accept 85 to 95)", special: false },
          { value: 200, question: "This is the name for a male turkey", answer: "Tom (or gobbler)", special: false },
          { value: 300, question: "Thanksgiving is always on this day of the week in October", answer: "Monday", special: false },
          { value: 400, question: "Two people pull on this turkey bone, and whoever ends up with the bigger piece gets to make a wish", answer: "Wishbone", special: false },
          { value: 500, question: "From 1921 to 1930, Canadian Thanksgiving was officially combined with this holiday", answer: "Remembrance Day (Armistice Day)", special: false },
        ],
      },
      {
        name: "Ball Knowledge",
        questions: [
          { value: 100, question: "In 2026, LeBron James left the Los Angeles Lakers and signed with this team", answer: "Philadelphia 76ers", special: false },
          { value: 200, question: "This country won the 2026 FIFA World Cup", answer: "Spain", special: false },
          { value: 300, question: "This team won the 2026 NBA championship, its first title since 1973", answer: "New York Knicks", special: false },
          { value: 400, question: "This Filipina tennis star won her first WTA Tour title in 2026 and became the highest-ranked Filipino player in history", answer: "Alex Eala", special: false },
          { value: 500, question: "This French star won the Golden Boot as the top goal scorer of the 2026 FIFA World Cup", answer: "Kylian Mbappe", special: false },
        ],
      },
      {
        name: "Peak Cinema",
        questions: [
          { value: 100, question: "A paralyzed former Marine is sent to a distant moon, where he controls a lab-grown body to live among the native people and ends up taking their side. Name the movie", answer: "Avatar", special: false },
          { value: 200, question: "A teenage girl volunteers to take her little sister's place in a televised contest where 24 kids enter an arena and only one can come out alive. Name the movie", answer: "The Hunger Games", special: false },
          { value: 300, question: "In the movie Black Panther, this is the name of the rare metal that powers the nation of Wakanda", answer: "Vibranium", special: false },
          { value: 400, question: "In the movie Home Alone, this is the last name of the family that accidentally leaves Kevin behind", answer: "McCallister", special: false },
          { value: 500, question: "After the whole world finds out who he really is, a teenage hero asks a sorcerer to make everyone forget, but the spell goes wrong and pulls in villains from other universes. Name the movie", answer: "Spider-Man: No Way Home", special: false },
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
        name: "Spell Your Worth",
        questions: [
          { value: 200,  question: "This Greek letter is used in math for the never-ending number that starts with 3.14", answer: "Pi", special: false },
          { value: 400,  question: "This is the name for a baby kangaroo", answer: "Joey", special: false },
          { value: 600,  question: "This English scientist came up with the three laws of motion and the theory of gravity", answer: "Newton", special: false },
          { value: 800,  question: "This language, spoken across China, has more native speakers than any other language in the world", answer: "Mandarin", special: false },
          { value: 1000, question: "This is the name for one half of the Earth, like the northern or southern half split by the equator", answer: "Hemisphere", special: false },
        ],
      },
      {
        name: "Quick Maths",
        questions: [
          { value: 200,  question: "You have 25 stickers. You give 9 to your friend, then your mom gives you 6 more. How many stickers do you have now?", answer: "22 stickers", special: false },
          { value: 400,  question: "A rectangle is 12 centimeters long and 5 centimeters wide. What is its perimeter?", answer: "34 centimeters", special: false },
          { value: 600,  question: "You save $15 every week. How many weeks will it take to save $240?", answer: "16 weeks", special: false },
          { value: 800,  question: "A $40 shirt goes up in price by 25%, then the new price is cut by 20%. What does the shirt cost now?", answer: "$40", special: false },
          { value: 1000, question: "A swimming pool is 10 meters long, 5 meters wide, and 2 meters deep. If 1 cubic meter holds 1,000 liters, how many liters of water does the pool hold when full?", answer: "100,000 liters", special: false },
        ],
      },
      {
        name: "Flags",
        questions: [
          { value: 200,  question: "", answer: "France", image: "assets/images/flags/france.svg", imageAlt: "A country's flag", special: false },
          { value: 400,  question: "", answer: "Greece", image: "assets/images/flags/greece.svg", imageAlt: "A country's flag", special: false },
          { value: 600,  question: "", answer: "Norway", image: "assets/images/flags/norway.svg", imageAlt: "A country's flag", special: false },
          { value: 800,  question: "", answer: "Colombia", image: "assets/images/flags/colombia.svg", imageAlt: "A country's flag", special: false },
          { value: 1000, question: "", answer: "Iceland", image: "assets/images/flags/iceland.svg", imageAlt: "A country's flag", special: false },
        ],
      },
      {
        // Which was searched more on Google? The $200, $400, $600 and $1000
        // answers are category winners from Google's "25 Years in Search"
        // (December 2023). The $800 is from worldwide Google Trends,
        // 2004 – present; check it at trends.google.com.
        name: "What's Trending?",
        questions: [
          { value: 200,  question: "Which has been searched more on Google of all time: Queen or The Beatles?", answer: "The Beatles", special: false },
          { value: 400,  question: "Which has been searched more on Google of all time: Chinese food or Italian food?", answer: "Chinese food", special: false },
          { value: 600,  question: "Which city has been searched more on Google of all time: New York City or London?", answer: "New York City", special: false },
          { value: 800,  question: "Which has been searched more on Google of all time: Michael Jackson or Pokemon?", answer: "Pokemon", special: false },
          { value: 1000, question: "Which has been searched more on Google of all time: The Simpsons or SpongeBob?", answer: "SpongeBob", special: false },
        ],
      },
      {
        name: "Spelling Bee",
        questions: [
          // "wordInfo" only shows on the host's phone, to read out if teams ask
          { value: 200,  question: "Spell this word", answer: "Chrysanthemum", special: false, wordInfo: {
            definition: "A flowering plant with big, colorful blooms made of many layers of petals, often seen in the fall",
            origin: "Greek: \"chrysos\" (gold) + \"anthemon\" (flower), so \"golden flower\"",
            sentence: "Grandma planted bright yellow chrysanthemums along the front porch.",
          } },
          { value: 400,  question: "Spell this word", answer: "Bureaucracy", special: false, wordInfo: {
            definition: "A system of government or a big organization with lots of departments, rules, and paperwork that can make things slow",
            origin: "French \"bureau\" (desk, office) + Greek \"-kratia\" (rule), so \"rule by offices\"",
            sentence: "Getting a new passport took weeks because of all the bureaucracy.",
          } },
          { value: 600,  question: "Spell this word", answer: "Connoisseur", special: false, wordInfo: {
            definition: "An expert who knows a lot about something, like food, wine, or art, and can judge how good it is",
            origin: "Old French \"conoisseor\" (one who knows), from Latin \"cognoscere\" (to get to know)",
            sentence: "My tito is a lechon connoisseur who can pick the best one from a single bite.",
          } },
          { value: 800,  question: "Spell this word", answer: "Onomatopoeia", special: false, wordInfo: {
            definition: "A word that sounds like the thing it describes, like \"buzz,\" \"sizzle,\" or \"boom\"",
            origin: "Greek: \"onoma\" (name) + \"poiein\" (to make), so \"making a name\"",
            sentence: "Comic books are full of onomatopoeia, like \"POW!\" and \"BAM!\"",
          } },
          { value: 1000, question: "Spell this word", answer: "Bourgeoisie", special: false, wordInfo: {
            definition: "The middle class, especially people who own property or businesses",
            origin: "French, from \"bourgeois\" (a town dweller), from \"bourg\" (market town)",
            sentence: "In the story, the poor workers grumble about the rich bourgeoisie in the city.",
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
      { question: "In the Marvel movies, what is the name of Thor's hammer?", answer: "Mjolnir" },
      { question: "In the TV show Stranger Things, what do the kids call the dark, creepy version of their town?", answer: "The Upside Down" },
      { question: "Which K-pop girl group released the songs \"How You Like That\" and \"Pink Venom\"?", answer: "BLACKPINK" },
      { question: "Which singer released the album \"Renaissance\" in 2022 and went on the Renaissance World Tour?", answer: "Beyonce" },
    ],
  },
  {
    name: "History",
    questions: [
      { question: "Of the Seven Wonders of the Ancient World, which is the only one still standing today?", answer: "The Great Pyramid of Giza" },
      { question: "In what year did the Titanic sink on its first voyage?", answer: "1912" },
      { question: "Which Philippine president declared martial law across the country in 1972?", answer: "Ferdinand Marcos" },
      { question: "Which wall, built to split a European city in two, was torn down in 1989?", answer: "The Berlin Wall" },
      { question: "In what year did Canada become a country, an event celebrated every July 1st?", answer: "1867" },
    ],
  },
  {
    name: "Science",
    questions: [
      { question: "What is the chemical symbol for gold on the periodic table?", answer: "Au" },
      { question: "Which planet in our solar system has the most moons?", answer: "Saturn" },
      { question: "Which part of a cell is known as \"the powerhouse of the cell\"?", answer: "The mitochondria" },
      { question: "What is the only metal that is a liquid at room temperature?", answer: "Mercury" },
      { question: "Roughly how fast does light travel, in kilometers per second?", answer: "About 300,000 km per second" },
    ],
  },
  {
    name: "Common Knowledge",
    questions: [
      { question: "How many minutes are there in one full day?", answer: "1,440" },
      { question: "How many sides does a stop sign have?", answer: "8" },
      { question: "Airplanes carry a \"black box\" flight recorder. What color is it actually painted?", answer: "Orange" },
      { question: "If you add up all the dots on a regular six-sided die, what is the total?", answer: "21" },
      { question: "What is the name for a group of crows?", answer: "A murder" },
    ],
  },
  {
    name: "Geography",
    questions: [
      { question: "What is the capital city of Australia?", answer: "Canberra" },
      { question: "What is the smallest country in the world?", answer: "Vatican City" },
      { question: "Mount Kilimanjaro, the tallest mountain in Africa, is in which country?", answer: "Tanzania" },
      { question: "Which country has the most people in all of Africa?", answer: "Nigeria" },
      { question: "Which two countries share the longest border in the world?", answer: "Canada and the United States" },
    ],
  },
  {
    name: "Music",
    questions: [
      { question: "Which instrument did jazz legend Louis Armstrong, singer of \"What a Wonderful World,\" famously play?", answer: "The trumpet" },
      { question: "Which band's 1973 album \"The Dark Side of the Moon\" stayed on the Billboard album chart for more than 900 weeks?", answer: "Pink Floyd" },
      { question: "Which Italian composer wrote the famous set of violin concertos called \"The Four Seasons\"?", answer: "Antonio Vivaldi" },
      { question: "Which instrument usually has 47 strings and seven foot pedals?", answer: "The harp" },
      { question: "Which Austrian composer wrote the opera \"The Magic Flute\" and started performing for royalty as a young child?", answer: "Wolfgang Amadeus Mozart" },
      { question: "Which Filipino rock band, formed in the late 1980s, recorded \"Ang Huling El Bimbo\"?", answer: "Eraserheads" },
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
    question: "Name something you see at Christmas time",
    answers: [
      { answer: "Christmas tree", points: 28, also: ["Tree", "Christmas trees", "Pine tree"] },
      { answer: "Lights", points: 18, also: ["Christmas lights", "Fairy lights", "String lights"] },
      { answer: "Presents", points: 15, also: ["Gifts", "Present", "Gift", "Wrapping paper"] },
      { answer: "Santa Claus", points: 12, also: ["Santa", "Saint Nick", "Father Christmas"] },
      { answer: "Star", points: 7, also: ["Stars", "Christmas star", "Parol", "Star lantern", "Lantern"] },
      { answer: "Snow", points: 6, also: ["Snowman", "Snowflakes", "Snowmen"] },
      { answer: "Ornaments", points: 5, also: ["Decorations", "Ornament", "Baubles", "Tinsel"] },
      { answer: "Stockings", points: 4, also: ["Stocking"] },
      { answer: "Reindeer", points: 3, also: ["Rudolph", "Reindeers"] },
      { answer: "Noche Buena food", points: 2, also: ["Ham", "Hamon", "Queso de bola", "Noche Buena", "Feast"] },
    ],
  },
  {
    question: "Name a job where people wear a uniform",
    answers: [
      { answer: "Police officer", points: 25, also: ["Police", "Cop", "Cops", "Policeman", "RCMP", "Officer"] },
      { answer: "Nurse", points: 18, also: ["Nurses", "Nursing"] },
      { answer: "Firefighter", points: 14, also: ["Fireman", "Firemen", "Fire fighter"] },
      { answer: "Soldier", points: 12, also: ["Military", "Army", "Navy", "Marine", "Air Force"] },
      { answer: "Fast food worker", points: 8, also: ["McDonald's", "Jollibee", "Tim Hortons", "Cashier", "Restaurant worker"] },
      { answer: "Doctor", points: 7, also: ["Doctors", "Surgeon", "Physician"] },
      { answer: "Pilot", points: 5, also: ["Flight attendant", "Airline", "Stewardess"] },
      { answer: "Chef", points: 4, also: ["Cook", "Chefs"] },
      { answer: "Security guard", points: 4, also: ["Security", "Guard", "Bouncer"] },
      { answer: "Mail carrier", points: 3, also: ["Mailman", "Postman", "Canada Post", "Delivery driver", "UPS", "FedEx"] },
    ],
  },
  {
    question: "Name a superhero that cannot fly",
    answers: [
      { answer: "Batman", points: 20, also: ["Bruce Wayne", "The Batman", "Dark Knight", "The Dark Knight"] },
      { answer: "Spider-Man", points: 18, also: ["Spiderman", "Spidey", "Peter Parker", "Miles Morales"] },
      { answer: "Captain America", points: 10, also: ["Cap", "Steve Rogers", "Captain"] },
      { answer: "Hulk", points: 9, also: ["The Hulk", "Incredible Hulk", "Bruce Banner"] },
      { answer: "The Flash", points: 8, also: ["Flash", "Barry Allen"] },
      { answer: "Wolverine", points: 7, also: ["Logan"] },
      { answer: "Black Panther", points: 6, also: ["T'Challa", "Panther"] },
      { answer: "Black Widow", points: 6, also: ["Natasha", "Natasha Romanoff", "Widow"] },
      { answer: "Hawkeye", points: 5, also: ["Hawk eye", "Clint Barton"] },
      { answer: "Aquaman", points: 4, also: ["Aqua man", "Arthur Curry"] },
      { answer: "Ant-Man", points: 4, also: ["Antman", "Ant man", "Scott Lang"] },
      { answer: "Daredevil", points: 3, also: ["Dare devil", "Matt Murdock"] },
    ],
  },
  {
    question: "Name something people do at the gym",
    answers: [
      { answer: "Lift weights", points: 30, also: ["Weights", "Weightlifting", "Lifting", "Bench press", "Bench", "Squat", "Squats", "Deadlift", "Dumbbells"] },
      { answer: "Run on the treadmill", points: 22, also: ["Treadmill", "Run", "Running", "Cardio", "Jog", "Jogging"] },
      { answer: "Sweat", points: 12, also: ["Sweating", "Get sweaty"] },
      { answer: "Listen to music", points: 10, also: ["Music", "Headphones", "AirPods", "Earbuds"] },
      { answer: "Take selfies", points: 8, also: ["Selfie", "Mirror selfie", "Pictures", "Photos", "Flex in the mirror", "Mirror", "Flex"] },
      { answer: "Stretch", points: 6, also: ["Stretching", "Yoga", "Warm up"] },
      { answer: "Ride the bike", points: 4, also: ["Bike", "Bicycle", "Spin", "Spin class", "Cycling", "Stationary bike"] },
      { answer: "Talk", points: 3, also: ["Chat", "Gossip", "Flirt", "Socialize", "Make friends"] },
      { answer: "Drink water", points: 3, also: ["Water", "Protein shake", "Shake", "Protein"] },
      { answer: "Swim", points: 2, also: ["Swimming", "Pool"] },
    ],
  },
  {
    question: "Name a popular pizza topping",
    answers: [
      { answer: "Pepperoni", points: 35, also: ["Peperoni"] },
      { answer: "Cheese", points: 15, also: ["Extra cheese", "Mozzarella"] },
      { answer: "Sausage", points: 10, also: ["Italian sausage"] },
      { answer: "Mushrooms", points: 8, also: ["Mushroom"] },
      { answer: "Pineapple", points: 8, also: ["Hawaiian", "Pineapples"] },
      { answer: "Ham", points: 6, also: [] },
      { answer: "Onions", points: 5, also: ["Onion", "Red onion"] },
      { answer: "Green peppers", points: 5, also: ["Peppers", "Bell peppers", "Pepper"] },
      { answer: "Olives", points: 4, also: ["Black olives", "Olive"] },
      { answer: "Bacon", points: 4, also: ["Bacon bits"] },
    ],
  },
];
