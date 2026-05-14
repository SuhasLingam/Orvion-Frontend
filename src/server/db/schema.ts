import { pgTable, text, integer, timestamp, uuid, jsonb, date } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // We omit .references(() => ...) to auth.users because it's cross-schema in Supabase
  name: text("name"),
  email: text("email").notNull().unique(),
  program: text("program").default("Full-Stack Developer"),
  programId: text("program_id").default("fsd"),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  xpToNextLevel: integer("xp_to_next_level").default(500),
  streak: integer("streak").default(0),
  readinessScore: integer("readiness_score").default(15),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const learningNodes = pgTable("learning_nodes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  xpReward: integer("xp_reward").default(50),
  type: text("type"), // 'video', 'quiz', 'project', 'interview'
  duration: text("duration"),
  orderIndex: integer("order_index").notNull(),
});

export const userLearningProgress = pgTable("user_learning_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  nodeId: text("node_id").references(() => learningNodes.id, { onDelete: "cascade" }),
  status: text("status").default("locked"), // 'locked', 'active', 'completed'
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  difficulty: text("difficulty"), // 'Beginner', 'Intermediate', 'Advanced'
  techStack: text("tech_stack").array(),
});

export const userProjects = pgTable("user_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }),
  status: text("status").default("locked"), // 'locked', 'in_progress', 'completed'
  progress: integer("progress").default(0),
  codeQuality: integer("code_quality").default(0),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const tests = pgTable("tests", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  maxScore: integer("max_score").default(100),
  duration: text("duration"),
});

export const userTests = pgTable("user_tests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  testId: text("test_id").references(() => tests.id, { onDelete: "cascade" }),
  status: text("status").default("pending"), // 'pending', 'completed'
  score: integer("score").default(0),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  topics: jsonb("topics"),
});

export const userInterviews = pgTable("user_interviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  date: text("date").notNull(),
  overallScore: integer("overall_score").notNull(),
  technicalScore: integer("technical_score").notNull(),
  communicationScore: integer("communication_score").notNull(),
  problemSolvingScore: integer("problem_solving_score").notNull(),
  clarityScore: integer("clarity_score").notNull(),
  feedback: text("feedback"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const interviewQuestions = pgTable("interview_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  interviewId: uuid("interview_id").references(() => userInterviews.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  level: text("level"), // 'Easy', 'Medium', 'Hard'
  result: text("result"), // 'Correct', 'Partial', 'Incorrect'
  llmComment: text("llm_comment"),
});

export const badges = pgTable("badges", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  icon: text("icon").notNull(),
  rarity: text("rarity"), // 'common', 'rare', 'epic', 'legendary'
});

export const userBadges = pgTable("user_badges", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  badgeId: text("badge_id").references(() => badges.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at", { withTimezone: true }).defaultNow(),
});

export const userActivity = pgTable("user_activity", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  date: date("date").defaultNow(),
  activityCount: integer("activity_count").default(1),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  programId: text("program_id").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").default("success"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
