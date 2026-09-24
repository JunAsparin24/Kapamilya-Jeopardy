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
          { value: 100, question: "This is the closest star to Earth", answer: "The Sun", special: false },
          { value: 200, question: "This is the largest planet in our solar system", answer: "Jupiter", special: false },
          { value: 300, question: "This is the name for an animal that eats both plants and meat", answer: "Omnivore", special: false },
          { value: 400, question: "This is the hardest natural substance on Earth", answer: "Diamond", special: false },
          { value: 500, question: "This is the only planet in our solar system that spins on its side", answer: "Uranus", special: false },
        ],
      },
      {
        name: "Kain Tayo!",
        questions: [
          { value: 100, question: "This whole roasted pig is the star of many Filipino fiestas and celebrations, famous for its crispy skin", answer: "Lechon", special: false },
          { value: 200, question: "This Filipino noodle dish comes in many versions, like canton, bihon, and palabok, and is eaten on birthdays for a long life", answer: "Pancit", special: false },
          { value: 300, question: "This sour Filipino soup gets its tangy flavor from tamarind and is often made with pork or shrimp", answer: "Sinigang", special: false },
          { value: 400, question: "These crispy fried spring rolls, usually filled with ground pork, are a must-have at every Filipino party", answer: "Lumpia", special: false },
          { value: 500, question: "This sizzling Filipino dish is made from chopped parts of a pig's head and liver, seasoned with calamansi and chili, and comes from Pampanga", answer: "Sisig", special: false },
        ],
      },
      {
        name: "Around the World",
        questions: [
          { value: 100, question: "This Southeast Asian country is made up of more than 7,000 islands and is famous for having the world's longest Christmas season, starting in September", answer: "Philippines", special: false },
          { value: 200, question: "This is the largest country in South America, where people speak Portuguese and the Christ the Redeemer statue overlooks Rio de Janeiro", answer: "Brazil", special: false },
          { value: 300, question: "Big Ben, the Beatles, and Buckingham Palace all come from this country, which is part of the United Kingdom", answer: "England", special: false },
          { value: 400, question: "This country gave the United States the Statue of Liberty as a gift in 1886", answer: "France", special: false },
          { value: 500, question: "This landlocked Asian country sits between India and China, is home to Mount Everest, and has the only national flag that isn't a rectangle", answer: "Nepal", special: false },
        ],
      },
      {
        name: "GOATS",
        questions: [
          { value: 100, question: "This golfer, nicknamed after a big striped jungle cat, has won 15 major championships", answer: "Tiger Woods", special: false },
          { value: 200, question: "This American tennis legend won 23 Grand Slam singles titles", answer: "Serena Williams", special: false },
          { value: 300, question: "This boxer is the only fighter in history to win world titles in eight different weight divisions", answer: "Manny Pacquiao", special: false },
          { value: 400, question: "Michael Phelps is the most decorated Olympian of all time. How many Olympic medals did he win in total?", answer: "28 medals", special: false },
          { value: 500, question: "Lionel Messi holds the record for the most Ballon d'Or awards, soccer's top prize for the best player in the world. How many has he won?", answer: "8", special: false },
        ],
      },
      {
        name: "Palindromes",
        questions: [
          { value: 100, question: "This is the time of day at 12 o'clock, when the sun is highest in the sky", answer: "Noon", special: false },
          { value: 200, question: "This system uses radio waves to detect planes, ships, and storms", answer: "Radar", special: false },
          { value: 300, question: "These are performances by just one person, like when a singer or guitarist plays alone", answer: "Solos", special: false },
          { value: 400, question: "This is the spinning part of a helicopter that the blades are attached to", answer: "Rotor", special: false },
          { value: 500, question: "This language is spoken by millions of people in the Indian state of Kerala", answer: "Malayalam", special: false },
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
          { value: 200,  question: "Which country does this flag belong to?", answer: "Italy", image: "assets/images/flags/italy.svg", imageAlt: "A country's flag", special: false },
          { value: 400,  question: "Which country does this flag belong to?", answer: "Switzerland", image: "assets/images/flags/switzerland.svg", imageAlt: "A country's flag", special: false },
          { value: 600,  question: "Which country does this flag belong to?", answer: "Germany", image: "assets/images/flags/germany.svg", imageAlt: "A country's flag", special: false },
          { value: 800,  question: "Which country does this flag belong to?", answer: "Nigeria", image: "assets/images/flags/nigeria.svg", imageAlt: "A country's flag", special: false },
          { value: 1000, question: "Which country does this flag belong to?", answer: "Norway", image: "assets/images/flags/norway.svg", imageAlt: "A country's flag", special: false },
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
// -------------------------------------------------------
const FINAL_WAGER_SECONDS = 90;

const finalWagerQuestions = [
  {
    name: "Pop Culture",
    question: "The very first Star Wars movie came out in 1977. Its full title is \"Star Wars: Episode IV – ______.\" Fill in the blank",
    answer: "A New Hope",
  },
  {
    name: "History",
    question: "On what date did the Philippines proclaim its independence from Spain?",
    answer: "June 12, 1898",
  },
  {
    name: "Miscellaneous",
    question: "What is the name of the small dot above a lowercase \"i\" or \"j\"?",
    answer: "A tittle",
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