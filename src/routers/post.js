const express = require("express");

const {
    createPost,
    addCommentToPost
} = require('../controllers/post');

const router = express.Router();

router.post("/", createPost);
router.post("/comment", addCommentToPost);

module.exports = router;