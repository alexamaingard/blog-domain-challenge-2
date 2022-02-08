const express = require("express");
const { append } = require("express/lib/response");

const {
    createUserWithProfile
} = require('../controllers/user');

const router = express.Router();

router.post("/create", createUserWithProfile);

module.exports = router;