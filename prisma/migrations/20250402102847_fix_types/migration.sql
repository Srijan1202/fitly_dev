-- CreateTable
CREATE TABLE "UserDetails" (
    "id" TEXT NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "bodyShape" TEXT NOT NULL,
    "skinTone" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "UserDetails_pkey" PRIMARY KEY ("id")
);
