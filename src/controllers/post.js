const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPost = async (req, res) => {
    //console.log("Req body", req.body);
    const { title, content, imageUrl, publishedAt, userId, categories } = req.body;

    let data = {
        title: title,
        content: content,
        imageUrl: imageUrl
    }

    if(publishedAt){
        data = {
            ...data, 
            publishedAt: publishedAt
        };
    }

    try {
        const createdPost = await prisma.post.create({
            data: {
                ...data,
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
        throw "Couldn't create comment.";
    }
    catch(error){
        console.log(error);
    }
}

const addCommentToPost = async (req, res) => {
    //console.log("Req body:", req.body);
    
    try{
        const comment = await createComment(req);
        
        if(comment){
            return res.json({ data: comment });
        }
        throw "Couldn't add comment to post.";
    }
    catch(error){
        console.log(error);
    }
}

const getPosts = async (req, res) => {
    //console.log("Query:", req.query);
    
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

    //console.log("Params:", req.params);
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

const updatePost = async (req, res) => {
    //console.log("Post id:", req.params.id);
    const { title, content, imageUrl } = req.body;
    const updatedCategoriesList = req.body.categories;
    const id = parseInt(req.params.id);

    const updateConditions = {
        where: {
            id: id
        }
    };

    const postToUpdate = await prisma.post.findUnique({
        ...updateConditions
    });
    console.log("Post to update:", postToUpdate);
    //console.log("Post categories:", postToUpdate.categories);

    let data = {
        title: title? title: postToUpdate.title,
        content: content? content: postToUpdate.content,
        imageUrl: imageUrl? imageUrl: postToUpdate.imageUrl
    }

    if(postToUpdate){
        const connectedCategories = [];

        for(let i = 0; i < updatedCategoriesList.length; i++){
            const connectedCategory = {
                id: updatedCategoriesList[i]
            };

            connectedCategories.push(connectedCategory);
        }
        console.log("Connected:", connectedCategories);

        try{
            const updatedPost = await prisma.post.update({
                ...updateConditions,
                data: {
                    ...data,
                    categories: {
                        disconnect: true,
                        connect: [
                            ...connectedCategories
                        ] 
                    }
                },
                include: {
                    categories: true
                }
            });
            console.log("Updated post:", updatedPost);

            if(updatedPost){
                return res.json({ data: updatedPost });
            }
            throw "Post couldn't be updated.";
        }
        catch(error){
            console.log(error);
        }
    }
}

const updateComment = async (req, res) => {
    //console.log("Comment id:", req.params.id);
    const { content } = req.body;
    const id = parseInt(req.params.id);

    const updateConditions = {
        where: {
            id: id
        }
    }

    const commentToUpdate = await prisma.comment.findUnique({
        ...updateConditions
    });
    console.log("Comment to update:", commentToUpdate);

    if(commentToUpdate){
        try{
            const updatedComment = await prisma.comment.update({
                ...updateConditions,
                data: {
                    content: content
                }
            });
            console.log("Updated comment:", updatedComment);
    
            if(updatedComment){
                return res.json({ data: updatedComment });  
            }
            throw "Comment to update not found.";
        }
        catch(error){
            console.log(error);
        }
    }
}

const updateCategory = async (req, res) => {
    //console.log("Category id:", req.params.id);
    const { name } = req.body;
    const id = parseInt(req.params.id);
    const updateConditions = {
        where: {
            id: id
        }
    }

    const categoryToUpdate = await prisma.category.findUnique({
        ...updateConditions
    });
    console.log("Category to update:", categoryToUpdate);
    
    if(categoryToUpdate){
        try{
            const updatedCategory = await prisma.category.update({
                ...updateConditions,
                data: {
                    name: name
                }
            });
            console.log("Updated category:", updatedCategory);

            if(updatedCategory){
                return res.json({ data: updatedCategory });
            }
            throw "Category to update not found.";
        }
        catch(error){
            console.log(error);
        }
    }
}

const deleteSingleComment = async (id) => {
    const deleteComment = await prisma.comment.delete({
        where: {
            id: id
        }
    });
}

const deletePost = async (req, res) => {
    const id = parseInt(req.params.id);

    const postDeleteConditions = {
        where: {
            id: id
        }
    }

    const postToDelete = await prisma.post.findUnique({
        ...postDeleteConditions
    });
    console.log("Post to delete:", postToDelete);

    if(postToDelete){    
        const commentsRelatedToPost = await prisma.comment.findMany({
            where: {
                postId: id
            }
        });
        console.log("Comments related to post:", commentsRelatedToPost);
    
        if(commentsRelatedToPost){
            try{
                for(let i = 0; i < commentsRelatedToPost.length; i++){
                    const deletedComment = await deleteSingleComment(commentsRelatedToPost[i].id);
                    
                    if(!deletedComment){
                        throw "Comment couldn't be deleted";
                    }
                }
            }
            catch(error){
                console.log(error);
            }
        }

        try{
            await prisma.categoriesOnPosts.deleteMany({
                where: {
                    postId: id
                }
            });
        }
        catch(error){
            console.log(error);
        }

        try{
            const deletedPost = await prisma.post.delete({
                ...postDeleteConditions
            });

            if(deletedPost){
                return res.json({ data: deletedPost });
            }
            throw "Post couldn't be deleted.";
        }
        catch(error){
            console.log(error);
        }
    }
}

const deleteComment = async (req, res) => {
    const id = parseInt(req.params.id);
}

module.exports = {
    createPost,
    addCommentToPost,
    getPosts,
    updatePost,
    updateComment,
    updateCategory,
    deletePost,
    deleteComment
}