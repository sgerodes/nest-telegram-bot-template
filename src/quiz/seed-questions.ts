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
    console.log(`Found ${allQuestions.length} questions`);

    for (const q of allQuestions) {
        await prisma.quizQuestion.create({
            data: {
                question: q.question,
                answers: JSON.stringify(q.answers),
                correctAnswerIndex: q.correct_answer,
            },
        });
    }

    console.log(`✅ Seeded ${allQuestions.length} quiz questions`);
}

seedAllQuestions()
  .then(() => prisma.$disconnect())
  .catch((err) => {
      console.error(err);
      return prisma.$disconnect().finally(() => process.exit(1));
  });