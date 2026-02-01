// Exam scoring format reference
const examScoringFormat = {
  // Language Tests
  IELTS: {
    min: 0,
    max: 9,
    step: 0.5,
    format: "0-9 (e.g., 7.5)",
    description: "Scored from 0 to 9 in 0.5 increments"
  },
  TOEFL: {
    min: 0,
    max: 120,
    step: 1,
    format: "0-120 (e.g., 100)",
    description: "Total score ranges from 0 to 120"
  },
  PTE: {
    min: 10,
    max: 90,
    step: 1,
    format: "10-90 (e.g., 65)",
    description: "Scored from 10 to 90"
  },
  Duolingo: {
    min: 10,
    max: 160,
    step: 1,
    format: "10-160 (e.g., 120)",
    description: "Scored from 10 to 160"
  },
  TCF: {
    min: 0,
    max: 699,
    step: 1,
    format: "0-699 (e.g., 500)",
    description: "Total score ranges from 0 to 699"
  },
  DELF: {
    min: 0,
    max: 100,
    step: 1,
    format: "0-100 (e.g., 75)",
    description: "Scored from 0 to 100"
  },
  DALF: {
    min: 0,
    max: 100,
    step: 1,
    format: "0-100 (e.g., 75)",
    description: "Scored from 0 to 100"
  },
  DSH: {
    min: 0,
    max: 3,
    step: 1,
    format: "0-3 (e.g., 2)",
    description: "Levels: 0 (not passed), 1, 2, 3"
  },
  TestDaF: {
    min: 0,
    max: 5,
    step: 1,
    format: "0-5 (e.g., 4)",
    description: "Levels from 0 to 5"
  },

  // Undergraduate Tests
  SAT: {
    min: 400,
    max: 1600,
    step: 10,
    format: "400-1600 (e.g., 1400)",
    description: "Total score ranges from 400 to 1600"
  },
  ACT: {
    min: 1,
    max: 36,
    step: 1,
    format: "1-36 (e.g., 32)",
    description: "Composite score from 1 to 36"
  },
  TestAS: {
    min: 0,
    max: 300,
    step: 1,
    format: "0-300 (e.g., 200)",
    description: "Total score ranges from 0 to 300"
  },

  // Graduate Tests
  GRE: {
    min: 260,
    max: 340,
    step: 1,
    format: "260-340 (e.g., 310)",
    description: "Total score ranges from 260 to 340 (combined verbal + quantitative)"
  },
  GMAT: {
    min: 200,
    max: 800,
    step: 10,
    format: "200-800 (e.g., 650)",
    description: "Total score ranges from 200 to 800"
  }
};

export const getExamScoringInfo = (examType) => {
  return examScoringFormat[examType] || {
    min: 0,
    max: 100,
    step: 1,
    format: "0-100",
    description: "Enter your exam score"
  };
};

export const getExamPlaceholder = (examType) => {
  const info = getExamScoringInfo(examType);
  return info.format;
};

export const getExamDescription = (examType) => {
  const info = getExamScoringInfo(examType);
  return info.description;
};

export const isValidScore = (score, examType) => {
  if (!score || isNaN(score)) return false;
  
  const info = getExamScoringInfo(examType);
  const numScore = parseFloat(score);
  
  return numScore >= info.min && numScore <= info.max;
};

export default examScoringFormat;
