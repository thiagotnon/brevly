CREATE TABLE "links" (
	"id" text PRIMARY KEY NOT NULL,
	"original" text NOT NULL,
	"shortened" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"visits" integer DEFAULT 0 NOT NULL
);
