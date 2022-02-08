const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPost = async (req, res) => {
    console.log("connected");
}

module.exports = {
    createPost
}