/*
  Warnings:

  - You are about to drop the `_CategoriesOnPostsToCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoriesOnPostsToPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoriesOnPostsToCategory" DROP CONSTRAINT "_CategoriesOnPostsToCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoriesOnPostsToCategory" DROP CONSTRAINT "_CategoriesOnPostsToCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "_CategoriesOnPostsToPost" DROP CONSTRAINT "_CategoriesOnPostsToPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoriesOnPostsToPost" DROP CONSTRAINT "_CategoriesOnPostsToPost_B_fkey";

-- DropTable
DROP TABLE "_CategoriesOnPostsToCategory";

-- DropTable
DROP TABLE "_CategoriesOnPostsToPost";

-- AddForeignKey
ALTER TABLE "CategoriesOnPosts" ADD CONSTRAINT "CategoriesOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnPosts" ADD CONSTRAINT "CategoriesOnPosts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
