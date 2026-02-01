// Exam options per country and study level
// This can be expanded as needed
const examOptions = {
  USA: {
    Bachelors: ["SAT", "ACT", "IELTS", "TOEFL", "Duolingo"],
    Masters: ["GRE", "GMAT", "IELTS", "TOEFL", "Duolingo"],
    PhD: ["GRE", "IELTS", "TOEFL", "Duolingo"],
  },
  UK: {
    Bachelors: ["IELTS", "TOEFL", "PTE", "Duolingo"],
    Masters: ["IELTS", "TOEFL", "PTE", "Duolingo"],
    PhD: ["IELTS", "TOEFL", "PTE", "Duolingo"],
  },
  Canada: {
    Bachelors: ["IELTS", "TOEFL", "Duolingo", "PTE"],
    Masters: ["IELTS", "TOEFL", "Duolingo", "PTE", "GRE", "GMAT"],
    PhD: ["IELTS", "TOEFL", "Duolingo", "PTE", "GRE"],
  },
  Australia: {
    Bachelors: ["IELTS", "TOEFL", "PTE", "Duolingo"],
    Masters: ["IELTS", "TOEFL", "PTE", "Duolingo", "GMAT"],
    PhD: ["IELTS", "TOEFL", "PTE", "Duolingo"],
  },
  Germany: {
    Bachelors: ["TestAS", "IELTS", "TOEFL", "DSH", "TestDaF"],
    Masters: ["GRE", "IELTS", "TOEFL", "DSH", "TestDaF"],
    PhD: ["IELTS", "TOEFL", "DSH", "TestDaF"],
  },
  France: {
    Bachelors: ["TCF", "DELF", "DALF", "IELTS", "TOEFL"],
    Masters: ["TCF", "DELF", "DALF", "IELTS", "TOEFL"],
    PhD: ["TCF", "DELF", "DALF", "IELTS", "TOEFL"],
  },
  NewZealand: {
    Bachelors: ["IELTS", "TOEFL", "PTE", "Duolingo"],
    Masters: ["IELTS", "TOEFL", "PTE", "Duolingo"],
    PhD: ["IELTS", "TOEFL", "PTE", "Duolingo"],
  },
  Singapore: {
    Bachelors: ["IELTS", "TOEFL", "SAT", "ACT"],
    Masters: ["IELTS", "TOEFL", "GRE", "GMAT"],
    PhD: ["IELTS", "TOEFL", "GRE"],
  },
  Ireland: {
    Bachelors: ["IELTS", "TOEFL", "PTE"],
    Masters: ["IELTS", "TOEFL", "PTE"],
    PhD: ["IELTS", "TOEFL", "PTE"],
  },
  Sweden: {
    Bachelors: ["IELTS", "TOEFL"],
    Masters: ["IELTS", "TOEFL"],
    PhD: ["IELTS", "TOEFL"],
  },
  // Add more countries as needed
};

export default examOptions;
