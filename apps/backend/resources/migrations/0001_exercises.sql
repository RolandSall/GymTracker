CREATE TYPE "public"."equipment_type" AS ENUM('Barbell', 'Dumbbell', 'Bodyweight', 'Machine', 'Cable', 'Band', 'Kettlebell', 'Other');--> statement-breakpoint
CREATE TYPE "public"."target_type" AS ENUM('Primary', 'Secondary');--> statement-breakpoint
CREATE TABLE "exercise_targets" (
	"id" text PRIMARY KEY NOT NULL,
	"exercise_id" text NOT NULL,
	"category_id" text NOT NULL,
	"type" "target_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1000) NOT NULL,
	"equipment_type" "equipment_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercise_targets" ADD CONSTRAINT "exercise_targets_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_targets" ADD CONSTRAINT "exercise_targets_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
