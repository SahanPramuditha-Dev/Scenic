-- AlterTable
ALTER TABLE "history_items" ADD COLUMN     "episode" INTEGER,
ADD COLUMN     "season" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'completed';

-- AlterTable
ALTER TABLE "anime_history_items" ADD COLUMN     "episodesWatched" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'completed';

