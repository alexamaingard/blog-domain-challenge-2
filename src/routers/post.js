const express = require("express");

const {
    createPost,
    addCommentToPost,
    getPosts,
    updatePost,
    updateComment,
    updateCategory,
    deletePost,
    deleteComment
} = require('../controllers/post');

const router = express.Router();

router.post("/", createPost);
router.post("/comment", addCommentToPost);

router.get("/", getPosts);
// /post?order=recent v /post?order=old
// &
// /post?limit=100

router.get("/userId=:id", getPosts);
router.get("/username=:username", getPosts);

router.patch("/:id", updatePost);
router.patch("/comment/:id", updateComment);
router.patch("/category/:id", updateCategory);

router.delete("/delete/:id", deletePost);
router.delete("/delete/comment/:id", deleteComment);

module.exports = router;