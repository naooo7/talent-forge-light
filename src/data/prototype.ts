// Prototype data only. Structured so it can later be swapped for real content.

export type Question = {
  id: string;
  prompt: string;
  choices: { key: string; text: string }[];
  answer: string;
  explanation: {
    why: string;
    steps: string[];
  };
  difficulty?: string;
};

export type Material = {
  id: string;
  name: string;
  completed: number;
  total: number;
  questionCount: number;
  minutes: number;
  /** Optional middle level inside a subtest (e.g. TIU → Numerik). */
  group?: string;
  /** Link to canonical question bank records (exam/subtest come from the parent). */
  bank?: { material: string; topic: string };
};

export type Subtest = {
  id: string;
  name: string;
  caption: string;
  materials: Material[];
};

export type Exam = {
  id: string;
  name: string;
  caption: string;
  subtests: Subtest[];
};

const sampleQuestions: Question[] = [
  {
    id: "q1",
    prompt:
      "Sebuah toko memberi diskon 20% untuk sebuah tas seharga Rp450.000. Jika pembeli membayar dengan kupon tambahan Rp25.000, berapa yang harus dibayar?",
    choices: [
      { key: "A", text: "Rp315.000" },
      { key: "B", text: "Rp335.000" },
      { key: "C", text: "Rp335.000 setelah pajak" },
      { key: "D", text: "Rp345.000" },
      { key: "E", text: "Rp360.000" },
    ],
    answer: "B",
    explanation: {
      why: "Diskon persentase dihitung lebih dulu, baru potongan nominal dari kupon.",
      steps: [
        "Diskon 20% dari Rp450.000 = Rp90.000.",
        "Harga setelah diskon = Rp450.000 − Rp90.000 = Rp360.000.",
        "Kurangi kupon Rp25.000 → Rp335.000.",
      ],
    },
  },
  {
    id: "q2",
    prompt:
      "Jika 3x + 7 = 2x + 15, maka nilai dari x² − 4 adalah …",
    choices: [
      { key: "A", text: "24" },
      { key: "B", text: "32" },
      { key: "C", text: "48" },
      { key: "D", text: "60" },
      { key: "E", text: "64" },
    ],
    answer: "D",
    explanation: {
      why: "Selesaikan persamaan linear lebih dulu, lalu substitusi ke ekspresi.",
      steps: ["3x − 2x = 15 − 7", "x = 8", "x² − 4 = 64 − 4 = 60"],
    },
  },
  {
    id: "q3",
    prompt:
      "Rata-rata nilai 5 siswa adalah 78. Jika satu siswa dengan nilai 68 keluar, berapa rata-rata nilai siswa yang tersisa?",
    choices: [
      { key: "A", text: "78,5" },
      { key: "B", text: "80,0" },
      { key: "C", text: "80,5" },
      { key: "D", text: "81,0" },
      { key: "E", text: "82,5" },
    ],
    answer: "C",
    explanation: {
      why: "Gunakan total nilai, bukan rata-rata, saat anggota berubah.",
      steps: [
        "Total awal = 5 × 78 = 390.",
        "Total setelah keluar = 390 − 68 = 322.",
        "Rata-rata baru = 322 ÷ 4 = 80,5.",
      ],
    },
  },
  {
    id: "q4",
    prompt:
      "Sebuah mobil menempuh 180 km dalam 2 jam 30 menit. Berapa kecepatan rata-ratanya?",
    choices: [
      { key: "A", text: "62 km/jam" },
      { key: "B", text: "68 km/jam" },
      { key: "C", text: "70 km/jam" },
      { key: "D", text: "72 km/jam" },
      { key: "E", text: "75 km/jam" },
    ],
    answer: "D",
    explanation: {
      why: "Kecepatan rata-rata adalah jarak dibagi waktu dalam satuan yang sama.",
      steps: ["2 jam 30 menit = 2,5 jam.", "180 ÷ 2,5 = 72 km/jam."],
    },
  },
  {
    id: "q5",
    prompt:
      "Perbandingan uang Ani dan Budi adalah 3 : 5. Jika selisih uang mereka Rp120.000, berapa uang Budi?",
    choices: [
      { key: "A", text: "Rp180.000" },
      { key: "B", text: "Rp240.000" },
      { key: "C", text: "Rp280.000" },
      { key: "D", text: "Rp300.000" },
      { key: "E", text: "Rp320.000" },
    ],
    answer: "D",
    explanation: {
      why: "Selisih perbandingan mewakili selisih nilai sebenarnya.",
      steps: [
        "Selisih perbandingan = 5 − 3 = 2 bagian.",
        "1 bagian = Rp120.000 ÷ 2 = Rp60.000.",
        "Uang Budi = 5 × Rp60.000 = Rp300.000.",
      ],
    },
  },
];

export function getQuestions(count = 5): Question[] {
  return sampleQuestions.slice(0, Math.min(count, sampleQuestions.length));
}

const mat = (
  id: string,
  name: string,
  completed: number,
  total: number,
  questionCount = 15,
  minutes = 18,
): Material => ({ id, name, completed, total, questionCount, minutes });

/** Grouped material: id is prefixed with the group so names may repeat across groups. */
const gmat = (group: string, name: string, completed: number, total: number, extra: Partial<Material> = {}): Material => ({
  ...mat(`${slugify(group)}-${slugify(name)}`, name, completed, total),
  group,
  ...extra,
});

/** A subtest with no deeper taxonomy: one material mirroring the subtest itself. */
const leaf = (id: string, name: string, caption: string, completed: number, total: number): Subtest => ({
  id,
  name,
  caption,
  materials: [mat(id, name, completed, total)],
});

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** True when a subtest has no separate material level to choose from. */
export const isLeafSubtest = (s: Subtest) => s.materials.length === 1 && s.materials[0]!.id === s.id;

/** Ordered middle-level groups of a subtest (empty when materials are flat). */
export const subtestGroups = (s: Subtest) => [...new Set(s.materials.map((m) => m.group).filter((g): g is string => !!g))];

/** Canonical Practice taxonomy shared by Latihan Soal, Drill Soal and Try Out. */
export const exams: Exam[] = [
  {
    id: "skd",
    name: "SKD",
    caption: "CPNS / Kedinasan",
    subtests: [
      {
        id: "twk",
        name: "TWK",
        caption: "Wawasan Kebangsaan",
        materials: [
          mat("nasionalisme", "Nasionalisme", 8, 30),
          mat("integritas", "Integritas", 4, 25),
          mat("bela-negara", "Bela Negara", 11, 30),
          mat("pilar-negara", "Pilar Negara", 2, 20),
          mat("bahasa-negara", "Bahasa Negara", 0, 20),
        ],
      },
      {
        id: "tiu",
        name: "TIU",
        caption: "Intelegensia Umum",
        materials: [
          gmat("Verbal", "Analogi", 0, 20),
          gmat("Verbal", "Silogisme", 0, 20),
          gmat("Verbal", "Analitis", 0, 20),
          gmat("Numerik", "Berhitung", 0, 20),
          gmat("Numerik", "Deret Angka", 0, 20),
          gmat("Numerik", "Perbandingan Kuantitatif", 0, 20),
          gmat("Numerik", "Soal Cerita", 0, 20),
          gmat("Numerik", "Kecukupan Data", 0, 60, { questionCount: 60, bank: { material: "Numerik", topic: "Kecukupan Data" } }),
          gmat("Figural", "Analogi", 0, 20),
          gmat("Figural", "Ketidaksamaan", 0, 20),
          gmat("Figural", "Serial", 0, 20),
        ],
      },
      {
        id: "tkp",
        name: "TKP",
        caption: "Karakteristik Pribadi",
        materials: [
          mat("pelayanan-publik", "Pelayanan Publik", 14, 30),
          mat("jejaring-kerja", "Jejaring Kerja", 7, 25),
          mat("sosial-budaya", "Sosial Budaya", 5, 25),
          mat("teknologi-informasi", "Teknologi Informasi dan Komunikasi", 2, 20),
          mat("profesionalisme", "Profesionalisme", 0, 20),
          mat("anti-radikalisme", "Anti Radikalisme", 0, 20),
        ],
      },
    ],
  },
  {
    id: "utbk",
    name: "UTBK",
    caption: "Perguruan Tinggi",
    subtests: [
      leaf("penalaran-umum", "Penalaran Umum", "TPS", 0, 30),
      leaf("pengetahuan-pemahaman-umum", "Pengetahuan dan Pemahaman Umum", "TPS", 0, 30),
      leaf("pemahaman-bacaan-menulis", "Pemahaman Bacaan dan Menulis", "TPS", 0, 30),
      leaf("pengetahuan-kuantitatif", "Pengetahuan Kuantitatif", "TPS", 0, 30),
      leaf("literasi-indonesia", "Literasi Bahasa Indonesia", "Literasi", 10, 30),
      leaf("literasi-inggris", "Literasi Bahasa Inggris", "Literasi", 3, 25),
      leaf("penalaran-matematika", "Penalaran Matematika", "Literasi", 8, 30),
    ],
  },
  {
    id: "psikotes",
    name: "Psikotes",
    caption: "Seleksi Kerja",
    subtests: [
      leaf("verbal", "Verbal", "Kata & Makna", 0, 25),
      leaf("numerik", "Numerik", "Angka & Hitungan", 0, 25),
      leaf("logika", "Logika", "Penalaran", 0, 25),
      leaf("figural", "Figural", "Pola Gambar", 0, 25),
      leaf("spasial", "Spasial", "Ruang & Bentuk", 0, 25),
    ],
  },
  {
    id: "tpa",
    name: "TPA",
    caption: "Tes Potensi Akademik",
    subtests: [
      leaf("verbal", "Verbal", "Kata & Makna", 12, 30),
      leaf("numerik", "Numerik", "Angka & Pola", 6, 25),
      leaf("logika", "Logika", "Penalaran", 0, 25),
      leaf("figural", "Figural", "Pola Gambar", 0, 25),
    ],
  },
  {
    id: "tbi",
    name: "TBI",
    caption: "Tes Bahasa Inggris",
    subtests: [
      leaf("vocabulary", "Vocabulary", "Word Knowledge", 0, 25),
      leaf("grammar", "Grammar", "Rules & Usage", 0, 25),
      leaf("reading", "Reading", "Reading Comprehension", 5, 25),
      leaf("structure", "Structure", "Written Expression", 8, 30),
      leaf("error-recognition", "Error Recognition", "Find the Mistake", 0, 25),
    ],
  },
];

export function findExam(examId: string) {
  return exams.find((e) => e.id === examId);
}

export function findSubtest(examId: string, subtestId: string) {
  return findExam(examId)?.subtests.find((s) => s.id === subtestId);
}

export function findMaterial(examId: string, subtestId: string, materialId: string) {
  return findSubtest(examId, subtestId)?.materials.find((m) => m.id === materialId);
}

export const user = {
  name: "Nao",
  target: "PKN STAN",
  streak: 12,
};

export const weekStats = {
  questions: 127,
  accuracy: 82,
  studyTime: "4h 32m",
  days: [
    { label: "M", active: true, intensity: 3 },
    { label: "T", active: true, intensity: 2 },
    { label: "W", active: true, intensity: 4 },
    { label: "T", active: false, intensity: 0 },
    { label: "F", active: true, intensity: 3 },
    { label: "S", active: true, intensity: 1 },
    { label: "S", active: false, intensity: 0 },
  ],
};

export const topicBreakdown = [
  { name: "TIU", accuracy: 82 },
  { name: "TWK", accuracy: 76 },
  { name: "TKP", accuracy: 88 },
];

export const reviewItems = [
  { subtest: "TIU", material: "Penalaran Matematika", count: 3 },
  { subtest: "TWK", material: "Nasionalisme", count: 2 },
  { subtest: "TKP", material: "Pelayanan Publik", count: 3 },
];

export const todaysFocus = {
  examId: "skd",
  subtestId: "tiu",
  materialId: "numerik-kecukupan-data",
  name: "Kecukupan Data",
  questions: 15,
  minutes: 18,
};

