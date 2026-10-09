/* =========================================================
   questions.js — ALL trivia content lives here.

   To change a question, edit its line. For example:
     { value: 300, question: "What is...?", answer: "...", special: false },

   - The board draws itself from this data, so there's no HTML to touch.
   - Questions are listed top-to-bottom as they appear on the board.
   - Each round has its own category names (the "name" lines).
   - "image" (optional) shows a picture on the question card, e.g.
       image: "assets/images/flags/italy.svg"
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
        name: "Gobble Gobble",
        questions: [
          { value: 100, question: "This big bird is the star of most Thanksgiving dinners", answer: "Turkey", special: false },
          { value: 200, question: "This thick brown sauce, made from the turkey drippings, gets poured over the meat and mashed potatoes", answer: "Gravy", special: false },
          { value: 300, question: "Thanksgiving is always on this day of the week in October", answer: "Monday", special: false },
          { value: 400, question: "Two people pull on this turkey bone, and whoever ends up with the bigger piece gets to make a wish", answer: "Wishbone", special: false },
          { value: 500, question: "From 1921 to 1930, Canadian Thanksgiving was officially combined with this holiday", answer: "Remembrance Day (Armistice Day)", special: false },
        ],
      },
      {
        name: "Sports Update",
        questions: [
          { value: 100, question: "In 2026, LeBron James left the Los Angeles Lakers and signed with this team", answer: "Philadelphia 76ers", special: false },
          { value: 200, question: "This country won the 2026 FIFA World Cup", answer: "Spain", special: false },
          { value: 300, question: "This team won the 2026 NBA championship, its first title since 1973", answer: "New York Knicks", special: false },
          { value: 400, question: "This Filipina tennis star won her first WTA Tour title in 2026 and became the highest-ranked Filipino player in history", answer: "Alex Eala", special: false },
          { value: 500, question: "This French star won the Golden Boot as the top goal scorer of the 2026 FIFA World Cup", answer: "Kylian Mbappe", special: false },
        ],
      },
      {
        name: "Movie Night",
        questions: [
          { value: 100, question: "A paralyzed former Marine is sent to a distant moon, where he controls a lab-grown body to live among the native people and ends up taking their side", answer: "Avatar", special: false },
          { value: 200, question: "A teenage girl volunteers to take her little sister's place in a televised contest where 24 kids enter an arena and only one can come out alive", answer: "The Hunger Games", special: false },
          { value: 300, question: "In the movie Black Panther, this is the name of the rare metal that powers the nation of Wakanda", answer: "Vibranium", special: false },
          { value: 400, question: "In the movie Home Alone, this is the last name of the family that accidentally leaves Kevin behind", answer: "McCallister", special: false },
          { value: 500, question: "A brilliant physicist leads a secret wartime project in the New Mexico desert, then years later is put on trial over his loyalty to his country", answer: "Oppenheimer", special: false },
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
        name: "4 Syllable Words",
        questions: [
          { value: 200,  question: "This flying machine has spinning blades on top and can hover in one place", answer: "Helicopter", special: false },
          { value: 400,  question: "This green, creamy fruit is the main ingredient in guacamole", answer: "Avocado", special: false },
          { value: 600,  question: "This large reptile with a wide snout and powerful jaws lives in the swamps of Florida", answer: "Alligator", special: false },
          { value: 800,  question: "This moving staircase carries people between floors in malls and airports", answer: "Escalator", special: false },
          { value: 1000, question: "This tool looks like two small telescopes joined together and helps you see faraway things, like birds or ships", answer: "Binoculars", special: false },
        ],
      },
      {
        name: "Quick Maths",
        questions: [
          { value: 200,  question: "You buy 3 bags of oranges with 6 oranges in each bag. How many oranges do you have?", answer: "18 oranges", special: false },
          { value: 400,  question: "A triangle has a base of 6 meters and a height of 7 meters. What is its area?", answer: "21 square meters", special: false },
          { value: 600,  question: "A movie starts at 7:45 PM and is 2 hours and 20 minutes long. What time does it end?", answer: "10:05 PM", special: false },
          { value: 800,  question: "An $80 jacket is on sale for 15% off. What is the sale price?", answer: "$68", special: false },
          { value: 1000, question: "A train leaves at 9:40 AM and travels 210 kilometers at 70 kilometers per hour. What time does it arrive?", answer: "12:40 PM", special: false },
        ],
      },
      {
        name: "Flags",
        questions: [
          { value: 200,  question: "", answer: "Italy", image: "assets/images/flags/italy.svg", imageAlt: "A country's flag", special: false },
          { value: 400,  question: "", answer: "Switzerland", image: "assets/images/flags/switzerland.svg", imageAlt: "A country's flag", special: false },
          { value: 600,  question: "", answer: "Germany", image: "assets/images/flags/germany.svg", imageAlt: "A country's flag", special: false },
          { value: 800,  question: "", answer: "Nigeria", image: "assets/images/flags/nigeria.svg", imageAlt: "A country's flag", special: false },
          { value: 1000, question: "", answer: "Norway", image: "assets/images/flags/norway.svg", imageAlt: "A country's flag", special: false },
        ],
      },
      {
        // Which was searched more on Google? Based on worldwide Google Trends
        // interest over the past 5 years. Check any pair at trends.google.com.
        name: "Higher or Lower",
        questions: [
          { value: 200,  question: "Which was searched more on Google over the past 5 years: Instagram or Pinterest?", answer: "Instagram", special: false },
          { value: 400,  question: "Which was searched more on Google over the past 5 years: McDonald's or Burger King?", answer: "McDonald's", special: false },
          { value: 600,  question: "Which was searched more on Google over the past 5 years: Cristiano Ronaldo or Michael Jordan?", answer: "Cristiano Ronaldo", special: false },
          { value: 800,  question: "Which was searched more on Google over the past 5 years: Amazon or Walmart?", answer: "Amazon", special: false },
          { value: 1000, question: "Which was searched more on Google over the past 5 years: ChatGPT or Taylor Swift?", answer: "ChatGPT", special: false },
        ],
      },
      {
        name: "Spelling Bee",
        questions: [
          { value: 200,  question: "Spell the word for: the sweet brown treat made from cocoa beans", answer: "Chocolate", special: false },
          { value: 400,  question: "Spell the word for: the day that comes after Tuesday", answer: "Wednesday", special: false },
          { value: 600,  question: "Spell the word for: \"for sure, without a doubt,\" as in \"I'm ___ coming to the party\"", answer: "Definitely", special: false },
          { value: 800,  question: "Spell the word for: playful and a little naughty, like a puppy that chews your shoes", answer: "Mischievous", special: false },
          { value: 1000, question: "Spell the word for: the steady beat in music that makes you want to tap your feet", answer: "Rhythm", special: false },
        ],
      },
    ],
  },
};

// -------------------------------------------------------
// FINAL WAGER — after the last round (final-wager.js).
// The teams agree on ONE category, wager on their phones (up to
// the points they have), then answer on their whiteboards within
// FINAL_WAGER_SECONDS. Right = + wager, wrong = − wager.
//
// Each category has several questions; one is picked AT RANDOM
// every game. Add or remove questions freely (at least one each).
// -------------------------------------------------------
const FINAL_WAGER_SECONDS = 90;

const finalWagerQuestions = [
  {
    name: "Pop Culture",
    questions: [
      { question: "The very first Star Wars movie came out in 1977. Its full title is \"Star Wars: Episode IV – ______.\" Fill in the blank", answer: "A New Hope" },
      { question: "In the 1997 movie Titanic, what is the full name of Leonardo DiCaprio's character?", answer: "Jack Dawson" },
      { question: "RM, Jin, Suga, J-Hope, Jimin, V, and Jungkook are the seven members of which K-pop group?", answer: "BTS" },
      { question: "In Harry Potter, what is the name of the sport played on flying broomsticks?", answer: "Quidditch" },
      { question: "In Disney's Frozen, what is the name of the kingdom where Elsa and Anna live?", answer: "Arendelle" },
    ],
  },
  {
    name: "History",
    questions: [
      { question: "On what date did the Philippines proclaim its independence from Spain?", answer: "June 12, 1898" },
      { question: "In what year did World War I begin?", answer: "1914" },
      { question: "Who was the first Prime Minister of Canada?", answer: "Sir John A. Macdonald" },
      { question: "In 1932, who became the first woman to fly solo across the Atlantic Ocean?", answer: "Amelia Earhart" },
      { question: "Which French military leader crowned himself Emperor of France in 1804?", answer: "Napoleon Bonaparte" },
    ],
  },
  {
    name: "Miscellaneous",
    questions: [
      { question: "What is the name of the small dot above a lowercase \"i\" or \"j\"?", answer: "A tittle" },
      { question: "How many bones are in the adult human body?", answer: "206" },
      { question: "What is the only letter of the alphabet that doesn't appear in the name of any U.S. state?", answer: "Q" },
      { question: "What is the little plastic tip at the end of a shoelace called?", answer: "An aglet" },
      { question: "How many keys does a standard piano have?", answer: "88" },
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
const FAST_MONEY_SECONDS = 45;

const fastMoneyQuestions = [
  {
    question: "Name something people usually do right after waking up",
    answers: [
      { answer: "Check their phone", points: 30, also: ["Phone", "Look at phone", "Scroll", "Social media", "TikTok", "Instagram", "Check messages", "Check texts", "Emails", "Check the time"] },
      { answer: "Go to the bathroom", points: 16, also: ["Bathroom", "Pee", "Poop", "Toilet", "CR", "Restroom", "Comfort room", "Use the toilet"] },
      { answer: "Brush their teeth", points: 15, also: ["Brush teeth", "Teeth", "Toothbrush", "Brushing"] },
      { answer: "Drink coffee", points: 10, also: ["Coffee", "Make coffee", "Kape", "Tea"] },
      { answer: "Eat breakfast", points: 7, also: ["Eat", "Breakfast", "Food", "Make breakfast", "Almusal"] },
      { answer: "Take a shower", points: 6, also: ["Shower", "Bath", "Take a bath", "Wash up", "Maligo"] },
      { answer: "Drink water", points: 5, also: ["Water", "Glass of water"] },
      { answer: "Wash their face", points: 4, also: ["Wash face", "Face", "Skincare", "Skin care"] },
      { answer: "Turn off the alarm", points: 3, also: ["Alarm", "Stop the alarm", "Shut off alarm"] },
      { answer: "Stretch", points: 2, also: ["Stretching", "Yawn", "Exercise", "Work out"] },
      { answer: "Go back to sleep", points: 2, also: ["Sleep", "Snooze", "Hit snooze", "Nap", "Sleep in", "Stay in bed", "Lie in bed"] },
    ],
  },
  {
    question: "How many times a week do you shower?",
    answers: [
      { answer: "7 (every day)", points: 34, also: ["7", "Seven", "Every day", "Everyday", "Daily", "Once a day", "7 times"] },
      { answer: "5", points: 18, also: ["Five", "5 times", "Weekdays"] },
      { answer: "3", points: 14, also: ["Three", "3 times", "Every other day"] },
      { answer: "6", points: 12, also: ["Six", "6 times"] },
      { answer: "4", points: 10, also: ["Four", "4 times"] },
      { answer: "2", points: 7, also: ["Two", "2 times", "Twice"] },
      { answer: "1", points: 5, also: ["One", "1 time", "Once", "Once a week"] },
    ],
  },
  {
    question: "Name something people might do when they're bored",
    answers: [
      { answer: "Watch TV/Netflix", points: 22, also: ["TV", "Television", "Watch a movie", "Movies", "Shows", "Watch shows", "Binge watch", "Disney plus", "Hulu"] },
      { answer: "Go on their phone", points: 20, also: ["Phone", "Social media", "Scroll", "TikTok", "Instagram", "Snapchat", "Doomscroll"] },
      { answer: "Play video games", points: 15, also: ["Video games", "Games", "Play games", "Gaming", "Game", "Xbox", "PlayStation", "PS5", "Nintendo", "Switch", "Fortnite", "Minecraft", "Roblox"] },
      { answer: "Sleep", points: 10, also: ["Nap", "Take a nap", "Rest", "Lie down"] },
      { answer: "Eat", points: 8, also: ["Snack", "Snacks", "Eat snacks", "Food", "Cook", "Bake"] },
      { answer: "Listen to music", points: 7, also: ["Music", "Spotify", "Songs", "Sing", "Karaoke"] },
      { answer: "Watch YouTube", points: 5, also: ["YouTube", "Videos", "Watch videos"] },
      { answer: "Go outside", points: 5, also: ["Outside", "Walk", "Go for a walk", "Go out", "Hang out", "Go to the mall", "Exercise"] },
      { answer: "Text a friend", points: 4, also: ["Text", "Call a friend", "Call someone", "Chat", "Message friends", "FaceTime"] },
      { answer: "Read", points: 4, also: ["Read a book", "Book", "Books", "Reading"] },
    ],
  },
  {
    question: "Name something that is in the ocean",
    answers: [
      { answer: "Water", points: 25, also: ["Salt water", "Saltwater", "Sea water", "Waves"] },
      { answer: "Fish", points: 20, also: ["Fishes", "Tuna", "Nemo", "Clownfish", "Salmon"] },
      { answer: "Sharks", points: 15, also: ["Shark", "Great white", "Jaws"] },
      { answer: "Whales", points: 10, also: ["Whale", "Blue whale", "Orca", "Killer whale"] },
      { answer: "Coral", points: 6, also: ["Coral reef", "Reef", "Corals"] },
      { answer: "Seaweed", points: 5, also: ["Algae", "Kelp", "Sea plants", "Plants"] },
      { answer: "Dolphins", points: 5, also: ["Dolphin"] },
      { answer: "Salt", points: 4, also: ["Sodium"] },
      { answer: "Octopus", points: 4, also: ["Squid", "Octopi", "Octopuses", "Kraken"] },
      { answer: "Jellyfish", points: 3, also: ["Jelly fish", "Jellies"] },
      { answer: "Trash", points: 3, also: ["Garbage", "Plastic", "Pollution", "Plastic bags", "Litter"] },
    ],
  },
  {
    question: "Name something you might forget when leaving the house",
    answers: [
      { answer: "Phone", points: 28, also: ["Cellphone", "Cell phone", "Mobile", "iPhone", "Smartphone"] },
      { answer: "Keys", points: 24, also: ["Key", "House keys", "Car keys"] },
      { answer: "Wallet", points: 15, also: ["Money", "Purse", "Cash", "Cards", "Credit card", "ID"] },
      { answer: "Water bottle", points: 8, also: ["Water", "Bottle", "Tumbler", "Hydro Flask", "Aquaflask"] },
      { answer: "Charger", points: 6, also: ["Phone charger", "Cable", "Power bank"] },
      { answer: "Lunch", points: 4, also: ["Food", "Baon", "Snacks", "Lunchbox"] },
      { answer: "Headphones", points: 4, also: ["Earphones", "Earbuds", "AirPods"] },
      { answer: "Jacket", points: 3, also: ["Coat", "Hoodie", "Sweater", "Umbrella"] },
      { answer: "Backpack/Bag", points: 3, also: ["School bag", "Handbag", "Tote"] },
      { answer: "Glasses", points: 3, also: ["Sunglasses", "Eyeglasses", "Contacts", "Shades"] },
      { answer: "Homework", points: 2, also: ["School work", "Assignment", "Laptop", "Books"] },
    ],
  },
];