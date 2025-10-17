import { pgTable, text, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { categories } from '../category/category.entity';

export const equipmentTypeEnum = pgEnum('equipment_type', [
  'Barbell',
  'Dumbbell',
  'Bodyweight',
  'Machine',
  'Cable',
  'Band',
  'Kettlebell',
  'Other',
]);

export const targetTypeEnum = pgEnum('target_type', [
  'Primary',
  'Secondary',
]);

export const exercises = pgTable('exercises', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }).notNull(),
  equipmentType: equipmentTypeEnum('equipment_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const exerciseTargets = pgTable('exercise_targets', {
  id: text('id').primaryKey(),
  exerciseId: text('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  type: targetTypeEnum('type').notNull(),
});

export const exercisesRelations = relations(exercises, ({ many }) => ({
  targets: many(exerciseTargets),
}));

export const exerciseTargetsRelations = relations(exerciseTargets, ({ one }) => ({
  exercise: one(exercises, {
    fields: [exerciseTargets.exerciseId],
    references: [exercises.id],
  }),
  category: one(categories, {
    fields: [exerciseTargets.categoryId],
    references: [categories.id],
  }),
}));
