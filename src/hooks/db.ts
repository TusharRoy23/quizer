import { Quiz } from '@/utils/types';
import Dexie, { type EntityTable } from 'dexie';

const db = new Dexie('QuizDB') as Dexie & {
    quiz: EntityTable<Quiz, 'uuid'>;
};

db.version(1).stores({
    quiz: 'uuid, question, answer, options, difficulty',
});

export { db };