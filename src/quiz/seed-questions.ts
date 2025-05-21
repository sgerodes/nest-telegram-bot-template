import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const ROOT_DIR = path.join(__dirname, '../../resources/quiz');

type RawQuiz = {
    question: string;
    answers: string[];
    correct_answer: number;
    advice?: string; // ignored in this schema
};

async function loadJsonFiles(dir: string): Promise<RawQuiz[]> {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let allQuestions: RawQuiz[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const nested = await loadJsonFiles(fullPath);
            allQuestions = allQuestions.concat(nested);
        } else if (entry.name.endsWith('.json')) {
            const raw = fs.readFileSync(fullPath, 'utf-8');
            const parsed: RawQuiz[] = JSON.parse(raw);
            allQuestions = allQuestions.concat(parsed);
        }
    }

    return allQuestions;
}

async function seedAllQuestions() {
    const allQuestions = await loadJsonFiles(ROOT_DIR);
    console.log(`Found ${allQuestions.length} raw questions`);

    // Step 1: Fetch existing questions from DB
    const existing = await prisma.quizQuestion.findMany({
        select: { question: true },
    });
    const existingSet = new Set(existing.map((q) => q.question.trim()));

    let inserted = 0;
    let duplicates = 0;

    for (const q of allQuestions) {
        const trimmed = q.question.trim();

        // Guard: Already in DB
        if (existingSet.has(trimmed)) {
            console.log(`⏩ Already in DB: "${trimmed}"`);
            duplicates++;
            continue;
        }

        // Guard: invalid correct answer index
        const correctIdx = q.correct_answer;
        if (correctIdx < 0 || correctIdx >= q.answers.length) {
            console.warn(`⚠️ Invalid index ${correctIdx} for question: "${q.question}. The questions has only ${q.answers.length} answers."`);
            continue;
        }

        // Insert into DB
        await prisma.quizQuestion.create({
            data: {
                question: trimmed,
                answers: JSON.stringify(q.answers),
                correctAnswerIndex: q.correct_answer,
            },
        });

        inserted++;
        existingSet.add(trimmed); // also prevent reinsert in same batch
    }

    console.log(`✅ Seeded ${inserted} new quiz questions. ${duplicates} were duplicates avoided.`);
}

seedAllQuestions()
  .then(() => prisma.$disconnect())
  .catch((err) => {
      console.error(err);
      return prisma.$disconnect().finally(() => process.exit(1));
  });