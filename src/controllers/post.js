const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPost = async (req, res) => {
    console.log("Req body", req.body);
    const { title, content, imageUrl, publishedAt, userId, categories } = req.body;

    const createdPost = await prisma.post.create({
        data: {
            title: title,
            content: content,
            imageUrl: imageUrl,
            user: {
                connect: {
                    id: userId
                }
            },
            categories: {
                create: categories.map((category) => {
                    return {
                        category: {
                            connectOrCreate: {
                                where: { name: category.name },
                                create: { name: category.name }
                            }
                        }
                    }
                })
            }
        },
        include: {
            user: true,
            user: {
                include: {
                    profile: true
                }
            },
            categories: true
        }
    });
    console.log("Created Post:", createdPost);

    res.json({ data: createdPost });
}

module.exports = {
    createPost
}