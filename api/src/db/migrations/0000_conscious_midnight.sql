CREATE TABLE "webhooks" (
	"id" text PRIMARY KEY NOT NULL,
	"method" text NOT NULL,
	"pathname" text NOT NULL,
	"ip" text NOT NULL,
	"statusCode" integer DEFAULT 200 NOT NULL,
	"contentType" text,
	"contentLength" integer,
	"queryParams" json,
	"headers" json NOT NULL,
	"body" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
