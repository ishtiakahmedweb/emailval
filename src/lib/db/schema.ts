import { pgTable, uuid, text, timestamp, integer, boolean, varchar, jsonb } from 'drizzle-orm/pg-core';

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  creditsRemaining: integer('credits_remaining').notNull().default(100),
  totalProcessed: integer('total_processed').notNull().default(0),
  subscriptionTier: text('subscription_tier', { enum: ['free', 'starter', 'growth', 'enterprise'] }).notNull().default('free'),
  subscriptionStatus: text('subscription_status', { enum: ['active', 'canceled', 'past_due', 'incomplete', 'trialing'] }),
  role: text('role', { enum: ['user', 'admin'] }).notNull().default('user'),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id'),
  isOnboarded: boolean('is_onboarded').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  keyPrefix: varchar('key_prefix', { length: 8 }).notNull(),
  keyHash: varchar('key_hash', { length: 64 }).notNull(),
  active: boolean('active').notNull().default(true),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
});

export const verificationLog = pgTable('verification_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  apiKeyId: uuid('api_key_id').references(() => apiKeys.id, { onDelete: 'set null' }),
  email: varchar('email', { length: 320 }).notNull(),
  state: text('state', { enum: ['deliverable', 'risky', 'undeliverable', 'unknown'] }).notNull(),
  stages: jsonb('stages').notNull(),
  latencyMs: integer('latency_ms').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  source: text('source', { enum: ['api', 'dashboard', 'widget', 'bulk'] }).notNull().default('api'),
  creditsConsumed: integer('credits_consumed').notNull().default(1),
  qualityScore: integer('quality_score'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const creditTransactions = pgTable('credit_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['subscription_grant', 'topup_purchase', 'verification_usage', 'admin_grant', 'admin_revoke'] }).notNull(),
  amount: integer('amount').notNull(),
  balanceBefore: integer('balance_before').notNull(),
  balanceAfter: integer('balance_after').notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  stripeCheckoutSessionId: text('stripe_checkout_session_id'),
  description: text('description'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const webhookConfigs = pgTable('webhook_configs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  secret: text('secret'),
  events: jsonb('events').notNull().default(['verification.completed']),
  active: boolean('active').notNull().default(true),
  lastDeliveryAt: timestamp('last_delivery_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const webhookLogs = pgTable('webhook_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  webhookConfigId: uuid('webhook_config_id').notNull().references(() => webhookConfigs.id, { onDelete: 'cascade' }),
  event: text('event').notNull(),
  payload: jsonb('payload').notNull(),
  status: text('status', { enum: ['delivered', 'failed', 'retrying'] }).notNull(),
  statusCode: integer('status_code'),
  responseBody: text('response_body'),
  attempt: integer('attempt').notNull().default(1),
  maxAttempts: integer('max_attempts').notNull().default(3),
  nextRetryAt: timestamp('next_retry_at', { withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const subscriptionPlans = pgTable('subscription_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  tier: text('tier', { enum: ['free', 'starter', 'growth', 'enterprise'] }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull(),
  monthlyCredits: integer('monthly_credits').notNull(),
  priceMonthly: integer('price_monthly').notNull(),
  priceYearly: integer('price_yearly').notNull(),
  features: jsonb('features').notNull().default([]),
  stripePriceIdMonthly: text('stripe_price_id_monthly'),
  stripePriceIdYearly: text('stripe_price_id_yearly'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const bulkJobs = pgTable('bulk_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  totalRows: integer('total_rows').notNull().default(0),
  processedRows: integer('processed_rows').notNull().default(0),
  deliverableCount: integer('deliverable_count').notNull().default(0),
  riskyCount: integer('risky_count').notNull().default(0),
  undeliverableCount: integer('undeliverable_count').notNull().default(0),
  unknownCount: integer('unknown_count').notNull().default(0),
  status: text('status', { enum: ['pending', 'processing', 'completed', 'failed'] }).notNull().default('pending'),
  errorMessage: text('error_message'),
  storagePath: text('storage_path'),
  resultsStoragePath: text('results_storage_path'),
  columnMapping: jsonb('column_mapping'),
  creditsConsumed: integer('credits_consumed').notNull().default(0),
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export const adminAuditLog = pgTable('admin_audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: uuid('admin_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  targetType: text('target_type'),
  targetId: text('target_id'),
  details: jsonb('details').default({}),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const emailTemplates = pgTable('email_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  subject: text('subject').notNull(),
  bodyHtml: text('body_html').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
