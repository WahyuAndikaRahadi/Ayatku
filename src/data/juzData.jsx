// This structure maps each juz to its corresponding surahs and verse ranges
const juzData = [
    {
      juz: 1,
      surahs: [
        { surah: 1, start: 1, end: 7 },
        { surah: 2, start: 1, end: 141 }
      ]
    },
    {
      juz: 2,
      surahs: [
        { surah: 2, start: 142, end: 252 }
      ]
    },
    {
      juz: 3,
      surahs: [
        { surah: 2, start: 253, end: 286 },
        { surah: 3, start: 1, end: 92 }
      ]
    },
    {
      juz: 4,
      surahs: [
        { surah: 3, start: 93, end: 200 },
        { surah: 4, start: 1, end: 23 }
      ]
    },
    {
      juz: 5,
      surahs: [
        { surah: 4, start: 24, end: 147 }
      ]
    },
    {
      juz: 6,
      surahs: [
        { surah: 4, start: 148, end: 176 },
        { surah: 5, start: 1, end: 81 }
      ]
    },
    {
      juz: 7,
      surahs: [
        { surah: 5, start: 82, end: 120 },
        { surah: 6, start: 1, end: 110 }
      ]
    },
    {
      juz: 8,
      surahs: [
        { surah: 6, start: 111, end: 165 },
        { surah: 7, start: 1, end: 87 }
      ]
    },
    {
      juz: 9,
      surahs: [
        { surah: 7, start: 88, end: 206 },
        { surah: 8, start: 1, end: 40 }
      ]
    },
    {
      juz: 10,
      surahs: [
        { surah: 8, start: 41, end: 75 },
        { surah: 9, start: 1, end: 93 }
      ]
    },
    {
      juz: 11,
      surahs: [
        { surah: 9, start: 94, end: 129 },
        { surah: 10, start: 1, end: 109 },
        { surah: 11, start: 1, end: 5 }
      ]
    },
    {
      juz: 12,
      surahs: [
        { surah: 11, start: 6, end: 123 },
        { surah: 12, start: 1, end: 52 }
      ]
    },
    {
      juz: 13,
      surahs: [
        { surah: 12, start: 53, end: 111 },
        { surah: 13, start: 1, end: 43 },
        { surah: 14, start: 1, end: 52 }
      ]
    },
    {
      juz: 14,
      surahs: [
        { surah: 15, start: 1, end: 99 },
        { surah: 16, start: 1, end: 128 }
      ]
    },
    {
      juz: 15,
      surahs: [
        { surah: 17, start: 1, end: 111 },
        { surah: 18, start: 1, end: 74 }
      ]
    },
    {
      juz: 16,
      surahs: [
        { surah: 18, start: 75, end: 110 },
        { surah: 19, start: 1, end: 98 },
        { surah: 20, start: 1, end: 135 }
      ]
    },
    {
      juz: 17,
      surahs: [
        { surah: 21, start: 1, end: 112 },
        { surah: 22, start: 1, end: 78 }
      ]
    },
    {
      juz: 18,
      surahs: [
        { surah: 23, start: 1, end: 118 },
        { surah: 24, start: 1, end: 64 },
        { surah: 25, start: 1, end: 20 }
      ]
    },
    {
      juz: 19,
      surahs: [
        { surah: 25, start: 21, end: 77 },
        { surah: 26, start: 1, end: 227 },
        { surah: 27, start: 1, end: 55 }
      ]
    },
    {
      juz: 20,
      surahs: [
        { surah: 27, start: 56, end: 93 },
        { surah: 28, start: 1, end: 88 },
        { surah: 29, start: 1, end: 45 }
      ]
    },
    {
      juz: 21,
      surahs: [
        { surah: 29, start: 46, end: 69 },
        { surah: 30, start: 1, end: 60 },
        { surah: 31, start: 1, end: 34 },
        { surah: 32, start: 1, end: 30 },
        { surah: 33, start: 1, end: 30 }
      ]
    },
    {
      juz: 22,
      surahs: [
        { surah: 33, start: 31, end: 73 },
        { surah: 34, start: 1, end: 54 },
        { surah: 35, start: 1, end: 45 },
        { surah: 36, start: 1, end: 27 }
      ]
    },
    {
      juz: 23,
      surahs: [
        { surah: 36, start: 28, end: 83 },
        { surah: 37, start: 1, end: 182 },
        { surah: 38, start: 1, end: 88 },
        { surah: 39, start: 1, end: 31 }
      ]
    },
    {
      juz: 24,
      surahs: [
        { surah: 39, start: 32, end: 75 },
        { surah: 40, start: 1, end: 85 },
        { surah: 41, start: 1, end: 46 }
      ]
    },
    {
      juz: 25,
      surahs: [
        { surah: 41, start: 47, end: 54 },
        { surah: 42, start: 1, end: 53 },
        { surah: 43, start: 1, end: 89 },
        { surah: 44, start: 1, end: 59 },
        { surah: 45, start: 1, end: 37 }
      ]
    },
    {
      juz: 26,
      surahs: [
        { surah: 46, start: 1, end: 35 },
        { surah: 47, start: 1, end: 38 },
        { surah: 48, start: 1, end: 29 },
        { surah: 49, start: 1, end: 18 },
        { surah: 50, start: 1, end: 45 },
        { surah: 51, start: 1, end: 30 }
      ]
    },
    {
      juz: 27,
      surahs: [
        { surah: 51, start: 31, end: 60 },
        { surah: 52, start: 1, end: 49 },
        { surah: 53, start: 1, end: 62 },
        { surah: 54, start: 1, end: 55 },
        { surah: 55, start: 1, end: 78 },
        { surah: 56, start: 1, end: 96 },
        { surah: 57, start: 1, end: 29 }
      ]
    },
    {
      juz: 28,
      surahs: [
        { surah: 58, start: 1, end: 22 },
        { surah: 59, start: 1, end: 24 },
        { surah: 60, start: 1, end: 13 },
        { surah: 61, start: 1, end: 14 },
        { surah: 62, start: 1, end: 11 },
        { surah: 63, start: 1, end: 11 },
        { surah: 64, start: 1, end: 18 },
        { surah: 65, start: 1, end: 12 },
        { surah: 66, start: 1, end: 12 }
      ]
    },
    {
      juz: 29,
      surahs: [
        { surah: 67, start: 1, end: 30 },
        { surah: 68, start: 1, end: 52 },
        { surah: 69, start: 1, end: 52 },
        { surah: 70, start: 1, end: 44 },
        { surah: 71, start: 1, end: 28 },
        { surah: 72, start: 1, end: 28 },
        { surah: 73, start: 1, end: 20 },
        { surah: 74, start: 1, end: 56 },
        { surah: 75, start: 1, end: 40 },
        { surah: 76, start: 1, end: 31 },
        { surah: 77, start: 1, end: 50 }
      ]
    },
    {
      juz: 30,
      surahs: [
        { surah: 78, start: 1, end: 40 },
        { surah: 79, start: 1, end: 46 },
        { surah: 80, start: 1, end: 42 },
        { surah: 81, start: 1, end: 29 },
        { surah: 82, start: 1, end: 19 },
        { surah: 83, start: 1, end: 36 },
        { surah: 84, start: 1, end: 25 },
        { surah: 85, start: 1, end: 22 },
        { surah: 86, start: 1, end: 17 },
        { surah: 87, start: 1, end: 19 },
        { surah: 88, start: 1, end: 26 },
        { surah: 89, start: 1, end: 30 },
        { surah: 90, start: 1, end: 20 },
        { surah: 91, start: 1, end: 15 },
        { surah: 92, start: 1, end: 21 },
        { surah: 93, start: 1, end: 11 },
        { surah: 94, start: 1, end: 8 },
        { surah: 95, start: 1, end: 8 },
        { surah: 96, start: 1, end: 19 },
        { surah: 97, start: 1, end: 5 },
        { surah: 98, start: 1, end: 8 },
        { surah: 99, start: 1, end: 8 },
        { surah: 100, start: 1, end: 11 },
        { surah: 101, start: 1, end: 11 },
        { surah: 102, start: 1, end: 8 },
        { surah: 103, start: 1, end: 3 },
        { surah: 104, start: 1, end: 9 },
        { surah: 105, start: 1, end: 5 },
        { surah: 106, start: 1, end: 4 },
        { surah: 107, start: 1, end: 7 },
        { surah: 108, start: 1, end: 3 },
        { surah: 109, start: 1, end: 6 },
        { surah: 110, start: 1, end: 3 },
        { surah: 111, start: 1, end: 5 },
        { surah: 112, start: 1, end: 4 },
        { surah: 113, start: 1, end: 5 },
        { surah: 114, start: 1, end: 6 }
      ]
    }
  ];
  
  export default juzData;