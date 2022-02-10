const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPost = async (req, res) => {
    console.log("Req body", req.body);
    const { title, content, imageUrl, publishedAt, userId, categories } = req.body;

    try {
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

        if(createdPost){
            return res.json({ data: createdPost });
        }
        throw "Couldn't create post.";
    }
    catch(error){
        console.log(error);
    }
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

    try{
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

        if(createdComment){
            return { 
                createdComment: createdComment, 
                parentComment: parentComment? parentComment : null
            };
        }
        throw "Comment couldn't be created.";
    }
    catch(error){
        console.log(error);
    }
}

const addCommentToPost = async (req, res) => {
    console.log("Req body:", req.body);
    
    try{
        const comment = await createComment(req);
        
        if(comment){
            return res.json({ data: comment });
        }
        throw "Comment couldn't be added to post.";
    }
    catch(error){
        console.log(error);
    }
}

const getPosts = async (req, res) => {
    console.log("Query:", req.query);
    
    let queryFilters = {};
    if(req.query.limit){
        queryFilters = {
            ...queryFilters,
            take: parseInt(req.query.limit)
        }
    }
    if(req.query.order){
        const order = req.query.order === "recent" ? 'desc' : 'asc'; 
        queryFilters = {
            ...queryFilters,
            orderBy: {
                id: order
            }
        }
    }

    console.log("Params:", req.params);
    let paramsFilters = {};
    if(req.params.userId){
        paramsFilters = {
            userId: parseInt(req.params.userId)
        };
    }
    if(req.params.username){
        const userFound = await prisma.user.findUnique({
            where: {
                username: req.params.username
            }
        });
        console.log("User found:", userFound);

        paramsFilters = {
            userId: userFound.id
        };
    }

    try {
        const posts = await prisma.post.findMany({
            ...queryFilters,
            where: {
                ...paramsFilters
            },
            include: {
                categories: true,
                comment: true
            }
        });
        console.log("Posts:", posts);

        if(posts){
            return res.json({ data: posts });
        }
        throw "No posts were found.";
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    createPost,
    addCommentToPost,
    getPosts
}