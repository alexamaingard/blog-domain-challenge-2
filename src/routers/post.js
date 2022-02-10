const express = require("express");

const {
    createPost,
    addCommentToPost,
    getPosts
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

module.exports = router;