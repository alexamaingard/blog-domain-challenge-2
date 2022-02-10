const express = require("express");

const {
    createUserWithProfile,
    updateUser,
    updateProfile
} = require('../controllers/user');

const router = express.Router();

router.post("/", createUserWithProfile);


router.patch("/:id", updateUser);
router.patch("/profile/:id", updateProfile);


module.exports = router;