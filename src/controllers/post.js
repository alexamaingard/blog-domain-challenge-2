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

const createComment = async (req) => {
    const { content, parentId, userId, postId } = req.body;

    let commentData = {
        content: content
    };
    let parentComment;

    if(parentId){
        commentData = {
            ...commentData, 
            parentId: parentId
        };
        parentComment = await prisma.comment.findUnique({
            where: {
                id: parentId
            }
        });
        console.log("Parent Comment:", parentComment);
    }

    const createdComment = await prisma.comment.create({
        data: {
            ...commentData,
            user: {
                connect: {
                    id: userId
                }
            },
            post: {
                connect: {
                    id: postId
                }
            }
        }
    });
    console.log("Created Comment:", createdComment);

    return { 
        createdComment: createdComment, 
        parentComment: parentComment? parentComment : null
    };
}

const addCommentToPost = async (req, res) => {
    console.log("Req body:", req.body);
    const comment = await createComment(req);
    
    res.json({ data: comment });
}

module.exports = {
    createPost,
    addCommentToPost
}