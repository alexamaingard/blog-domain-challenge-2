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
// /post?limit=100
// /post?id=1 v post?username=blah

module.exports = router;