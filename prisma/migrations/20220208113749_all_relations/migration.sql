/*
  Warnings:

  - You are about to drop the `CategoryOnPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryOnPostToPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryToCategoryOnPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryOnPostToPost" DROP CONSTRAINT "_CategoryOnPostToPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryOnPostToPost" DROP CONSTRAINT "_CategoryOnPostToPost_B_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToCategoryOnPost" DROP CONSTRAINT "_CategoryToCategoryOnPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToCategoryOnPost" DROP CONSTRAINT "_CategoryToCategoryOnPost_B_fkey";

-- DropTable
DROP TABLE "CategoryOnPost";

-- DropTable
DROP TABLE "_CategoryOnPostToPost";

-- DropTable
DROP TABLE "_CategoryToCategoryOnPost";

-- CreateTable
CREATE TABLE "CategoriesOnPosts" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "CategoriesOnPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoriesOnPostsToCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoriesOnPostsToPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriesOnPostsToCategory_AB_unique" ON "_CategoriesOnPostsToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriesOnPostsToCategory_B_index" ON "_CategoriesOnPostsToCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriesOnPostsToPost_AB_unique" ON "_CategoriesOnPostsToPost"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriesOnPostsToPost_B_index" ON "_CategoriesOnPostsToPost"("B");

-- AddForeignKey
ALTER TABLE "_CategoriesOnPostsToCategory" ADD FOREIGN KEY ("A") REFERENCES "CategoriesOnPosts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesOnPostsToCategory" ADD FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesOnPostsToPost" ADD FOREIGN KEY ("A") REFERENCES "CategoriesOnPosts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesOnPostsToPost" ADD FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
