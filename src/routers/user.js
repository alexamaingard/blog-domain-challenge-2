const express = require("express");

const {
    createUserWithProfile
} = require('../controllers/user');

const router = express.Router();

router.post("/create", createUserWithProfile);

module.exports = router;