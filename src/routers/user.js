const express = require("express");

const {
    createUserWithProfile,
    updateUser
} = require('../controllers/user');

const router = express.Router();

router.post("/", createUserWithProfile);

router.patch("/:id", updateUser)

module.exports = router;