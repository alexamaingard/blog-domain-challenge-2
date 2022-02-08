const express = require("express");

const {
    createPost
} = require('../controllers/post');

const router = express.Router();

router.post("/create", createPost);

module.exports = router;