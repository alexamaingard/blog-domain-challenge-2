const express = require("express");

const {
    createPost,
    addCommentToPost,
    getPosts,
    updatePost,
    updateComment,
    updateCategory
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

module.exports = router;