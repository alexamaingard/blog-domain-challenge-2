const express = require("express");

const {
    createUserWithProfile
} = require('../controllers/user');

const router = express.Router();

router.post("/", createUserWithProfile);

module.exports = router;