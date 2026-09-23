/* =========================================================
   questions.js — ALL trivia content lives here.

   To change a question, edit its line. For example:
     { value: 300, question: "What is...?", answer: "...", special: false },

   - The board draws itself from this data, so there's no HTML to touch.
   - Questions are listed top-to-bottom as they appear on the board.
   - Each round has its own category names (the "name" lines).
   - "image" (optional) shows a picture on the question card, e.g.
       image: "assets/images/flags/japan.svg"
     Put picture files in assets/images/. "imageAlt" (optional) describes
     the picture for screen readers — never include the answer in it.
   - "special" is reserved for the hidden bonus event (coming later).
     Leave it false for now.
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
          { value: 100, question: "These are the three primary colors", answer: "Red, Blue, Yellow", special: false },
          { value: 200, question: "This is the name for the thing in the center of a cell", answer: "Nucleus", special: false },
          { value: 300, question: "This is the largest bone in the human body", answer: "Femur", special: false },
          { value: 400, question: "This is the name of that thing that hangs down in the back of your throat", answer: "Uvula", special: false },
          { value: 500, question: "This is the longest side of a triangle, opposite the right angle", answer: "Hypotenuse", special: false },
        ],
      },
      {
        name: "Kain Tayo!",
        questions: [
          { value: 100, question: "This Filipino dish is commonly made with marinated pork or chicken that is simmered in a mixture of vinegar, soy sauce, garlic, and other seasonings", answer: "Adobo", special: false },
          { value: 200, question: "This Filipino soup is known for its sour broth. While tamarind is commonly used to create the sour flavor, other souring agents can also be used. Pork, fish, or beef may be added depending on the version", answer: "Sinigang", special: false },
          { value: 300, question: "This Filipino stew is known for its dark, rich sauce and savory-sour flavor. Although it can look similar to a chocolate-based dish, its distinctive color traditionally comes from pork blood", answer: "Dinuguan", special: false },
          { value: 400, question: "Often found alongside garlic fried rice and eggs at a Filipino breakfast table, this sausage can be surprisingly sweet depending on the variety. Unlike many Western sausages, some Filipino versions are heavily seasoned with garlic, sugar, and spices", answer: "Longganisa", special: false },
          { value: 500, question: "This Filipino appetizer consists of a thin wrapper rolled around a savory filling, commonly made with ground pork and finely chopped vegetables, before being fried until crisp and often served with a dipping sauce", answer: "Lumpia", special: false },
        ],
      },
      {
        name: "Around the World",
        questions: [
          { value: 100, question: "This country is made up of more than 7,000 islands and has a population of over 100 million. It is also the second-largest archipelago country in the world by number of islands", answer: "Philippines", special: false },
          { value: 200, question: "This country is the second-largest country in the world by total area, has the longest coastline of any country, has more lakes than every other country in the world combined, and is famous for maple syrup production", answer: "Canada", special: false },
          { value: 300, question: "This country is home to the ancient pyramids of Giza, the Nile River, and the Suez Canal, which connects the Mediterranean Sea to the Red Sea", answer: "Egypt", special: false },
          { value: 400, question: "This country has more than 1,500 islands, is home to the world's largest coral reef system, and is the only country that occupies an entire continent", answer: "Australia", special: false },
          { value: 500, question: "This South American country is home to the Amazon rainforest, has Portuguese as its official language, and is the largest country in both South America and Latin America", answer: "Brazil", special: false },
        ],
      },
      {
        name: "GOATS",
        questions: [
          { value: 100, question: "NBA superstar LeBron James has played for three different teams during his career. Which team did he defeat in the 2016 NBA Finals after his team came back from a 3–1 series deficit?", answer: "Golden State Warriors", special: false },
          { value: 200, question: "This performer began his career as a child alongside his brothers before eventually becoming one of the biggest solo artists in music history. One of his most famous dance moves appears to defy gravity", answer: "Michael Jackson", special: false },
          { value: 300, question: "Usain Bolt is one of the most decorated track athletes in Olympic history, winning gold medals across three different Olympic Games. How many Olympic medals did he win in total?", answer: "8 Olympic medals", special: false },
          { value: 400, question: "This Filipino athlete became the first boxer to hold world championships in four different decades and defeated five fighters who had previously held world titles. Throughout his professional career, he competed across eight different weight divisions", answer: "Manny Pacquiao", special: false },
          { value: 500, question: "Shohei Ohtani became the first player in MLB history to join the 50–50 club (50 home runs and 50 stolen bases). In that historic 2024 season, how many home runs did he hit?", answer: "54", special: false },
        ],
      },
      {
        name: "Palindromes",
        questions: [
          { value: 100, question: "Music that is currently liked by many people and played a lot on the radio or internet is known as this genre", answer: "Pop", special: false },
          { value: 200, question: "A small, narrow boat designed for one or two people that is typically moved through the water using a double-bladed paddle", answer: "Kayak", special: false },
          { value: 300, question: "A word for something perfectly even or flat, with no slope or tilt", answer: "Level", special: false },
          { value: 400, question: "The ___ cuff is a group of muscles and tendons that holds your shoulder joint in place", answer: "Rotator", special: false },
          { value: 500, question: "This Christopher Nolan film was released in 2020 and stars John David Washington and Robert Pattinson in a story involving espionage, time inversion, and a mysterious technology", answer: "Tenet", special: false },
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
          { value: 200,  question: "This big summer fruit is green on the outside, with juicy red flesh and black seeds on the inside", answer: "Watermelon", special: false },
          { value: 400,  question: "This fuzzy, many-legged creature munches on leaves before wrapping itself in a cocoon and turning into a butterfly", answer: "Caterpillar", special: false },
          { value: 600,  question: "This small instrument is held to the mouth and played by breathing in and out through a row of holes. It's often heard in blues and folk music", answer: "Harmonica", special: false },
          { value: 800,  question: "This large, hairy spider lives in deserts and rainforests, and some people even keep one as a pet", answer: "Tarantula", special: false },
          { value: 1000, question: "This performer makes their voice seem like it's coming from somewhere else, usually a puppet or dummy sitting on their lap", answer: "Ventriloquist", special: false },
        ],
      },
      {
        name: "Quick Maths",
        questions: [
          { value: 200,  question: "What is 12 × 12?", answer: "144", special: false },
          { value: 400,  question: "What is 15% of 200?", answer: "30", special: false },
          { value: 600,  question: "What is 7 × 8 + 6 × 9?", answer: "110", special: false },
          { value: 800,  question: "If you drive at 90 km per hour for 2 hours and 20 minutes, how many kilometres do you travel?", answer: "210 km", special: false },
          { value: 1000, question: "What is the square root of 1,764?", answer: "42", special: false },
        ],
      },
      {
        name: "Flags",
        questions: [
          { value: 200,  question: "Which country does this flag belong to?", answer: "Japan", image: "assets/images/flags/japan.svg", imageAlt: "A country's flag", special: false },
          { value: 400,  question: "Which country does this flag belong to?", answer: "Sweden", image: "assets/images/flags/sweden.svg", imageAlt: "A country's flag", special: false },
          { value: 600,  question: "Which country does this flag belong to?", answer: "Greece", image: "assets/images/flags/greece.svg", imageAlt: "A country's flag", special: false },
          { value: 800,  question: "Which country does this flag belong to?", answer: "Jamaica", image: "assets/images/flags/jamaica.svg", imageAlt: "A country's flag", special: false },
          { value: 1000, question: "Which country does this flag belong to?", answer: "Bangladesh", image: "assets/images/flags/bangladesh.svg", imageAlt: "A country's flag", special: false },
        ],
      },
      {
        // Prices are Canada-wide averages from Statistics Canada (July 2026).
        // Closest guess wins — or accept anything within about $1.
        name: "Guess the Price",
        questions: [
          { value: 200,  question: "On average, how much does 4 litres of milk cost at a grocery store in Canada?", answer: "$6.99", special: false },
          { value: 400,  question: "On average, how much does a dozen eggs cost at a grocery store in Canada?", answer: "$4.95", special: false },
          { value: 600,  question: "On average, how much does a 675 gram loaf of white bread cost at a grocery store in Canada?", answer: "$3.60", special: false },
          { value: 800,  question: "On average, how much does a 1 kilogram jar of peanut butter cost at a grocery store in Canada?", answer: "$5.62", special: false },
          { value: 1000, question: "On average, how much does a 4.43 litre jug of laundry detergent cost at a store in Canada?", answer: "$13.36", special: false },
        ],
      },
      {
        name: "Spelling Bee",
        questions: [
          { value: 200,  question: "Spell the word that means: the day after today", answer: "Tomorrow", special: false },
          { value: 400,  question: "Spell the word that means: needed or required; something you must have", answer: "Necessary", special: false },
          { value: 600,  question: "Spell the word that means: to provide someone with a place to stay, or to make room for their needs", answer: "Accommodate", special: false },
          { value: 800,  question: "Spell the word that means: the inner voice that tells you whether something is right or wrong", answer: "Conscience", special: false },
          { value: 1000, question: "Spell the word that means: a word that imitates the sound it describes, like \"buzz,\" \"sizzle,\" or \"boom\"", answer: "Onomatopoeia", special: false },
        ],
      },
    ],
  },
};
