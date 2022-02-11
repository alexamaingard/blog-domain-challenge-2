const express = require("express");

const {
    createUserWithProfile,
    updateUser,
    updateProfile,
    deleteUser
} = require('../controllers/user');

const router = express.Router();

router.post("/", createUserWithProfile);


router.patch("/:id", updateUser);
router.patch("/profile/:id", updateProfile);

router.delete("/delete/id", deleteUser);

module.exports = router;