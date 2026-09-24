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
          { value: 100, question: "This popular Filipino dessert is made with shaved ice, evaporated milk, and toppings like sweet beans, jellies, leche flan, and ube", answer: "Halo-halo", special: false },
          { value: 200, question: "This whole roasted pig is the star of many Filipino fiestas and celebrations, famous for its crispy skin", answer: "Lechon", special: false },
          { value: 300, question: "This Filipino stew is made with oxtail and vegetables in a thick peanut sauce, and is usually served with bagoong (shrimp paste)", answer: "Kare-kare", special: false },
          { value: 400, question: "This Filipino street food is a fertilized duck egg that is boiled and eaten straight from the shell", answer: "Balut", special: false },
          { value: 500, question: "This sizzling Filipino dish is made from chopped parts of a pig's head and liver, seasoned with calamansi and chili, and comes from Pampanga", answer: "Sisig", special: false },
        ],
      },
      {
        name: "Around the World",
        questions: [
          { value: 100, question: "This country is shaped like a boot and is famous for pizza, pasta, and the Colosseum", answer: "Italy", special: false },
          { value: 200, question: "This country is home to the Great Wall and has one of the largest populations in the world", answer: "China", special: false },
          { value: 300, question: "This country is famous for the Eiffel Tower, croissants, and the Louvre, the museum that holds the Mona Lisa", answer: "France", special: false },
          { value: 400, question: "This South American country is home to Machu Picchu, the ancient Inca city high in the Andes mountains", answer: "Peru", special: false },
          { value: 500, question: "This country, made up of more than 17,000 islands, is the largest archipelago country in the world and home to the island of Bali", answer: "Indonesia", special: false },
        ],
      },
      {
        name: "GOATS",
        questions: [
          { value: 100, question: "This basketball legend won six NBA championships with the Chicago Bulls while wearing the number 23", answer: "Michael Jordan", special: false },
          { value: 200, question: "This Argentine soccer superstar finally won the FIFA World Cup in 2022", answer: "Lionel Messi", special: false },
          { value: 300, question: "This American tennis legend won 23 Grand Slam singles titles and often played against her older sister, Venus", answer: "Serena Williams", special: false },
          { value: 400, question: "This Canadian hockey legend, nicknamed \"The Great One,\" still holds the NHL record for most career points", answer: "Wayne Gretzky", special: false },
          { value: 500, question: "This weightlifter made history at the Tokyo 2020 Olympics by winning the Philippines' first-ever Olympic gold medal", answer: "Hidilyn Diaz", special: false },
        ],
      },
      {
        name: "Palindromes",
        questions: [
          { value: 100, question: "This is what many kids call their father", answer: "Dad", special: false },
          { value: 200, question: "This system uses radio waves to detect planes, ships, and storms", answer: "Radar", special: false },
          { value: 300, question: "A car built for competing in high-speed races on a track", answer: "Racecar", special: false },
          { value: 400, question: "A polite way to address a woman, as in \"Excuse me, ___\"", answer: "Madam", special: false },
          { value: 500, question: "This word describes things to do with a city or its citizens, like duty or pride. It's also a popular Honda car", answer: "Civic", special: false },
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
          { value: 400,  question: "How many minutes are in 4 and a half hours?", answer: "270 minutes", special: false },
          { value: 600,  question: "A movie starts at 7:45 PM and is 2 hours and 20 minutes long. What time does it end?", answer: "10:05 PM", special: false },
          { value: 800,  question: "A $40 shirt is on sale for 25% off. What is the sale price?", answer: "$30", special: false },
          { value: 1000, question: "How many days are in 5 years, if one of those years is a leap year?", answer: "1,826 days", special: false },
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
          { value: 800,  question: "Spell the word for: the chart that shows all the days, weeks, and months of the year", answer: "Calendar", special: false },
          { value: 1000, question: "Spell the word for: the steady beat in music that makes you want to tap your feet", answer: "Rhythm", special: false },
        ],
      },
    ],
  },
};
