-- public."Users" definition

-- Drop table

-- DROP TABLE public."Users";

CREATE TABLE public."Users" (
	email text NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"password" text NOT NULL,
	id serial4 NOT NULL,
	CONSTRAINT "Users_pkey" PRIMARY KEY (id)
);

CREATE UNIQUE INDEX "Users_email_key" ON public."Users" USING btree (email);


-- public.videos definition

-- Drop table

-- DROP TABLE public.videos;

CREATE TABLE public.videos (
	id uuid NOT NULL,
	title varchar(255) NOT NULL,
	"userEmail" varchar(255) NOT NULL,
	status public."VideoStatus" DEFAULT 'processing'::"VideoStatus" NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"base64" text NOT NULL,
	"processedVideoUrl" text NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT videos_pkey PRIMARY KEY (id)
);

CREATE INDEX "videos_userEmail_idx" ON public.videos USING btree ("userEmail");

CREATE INDEX "videos_userId_idx" ON public.videos USING btree ("userId");