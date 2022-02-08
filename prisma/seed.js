const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seed = async () => {
    const user = await createUser();
    await createProfile(user);
    const categories = await createCategory();
    const posts = await createPost(user, categories);
    await createComment(user, posts, 0);

    process.exit(0);
}

const createUser = async () => {
    const createdUser = await prisma.user.create({
        data: {
            username: 'lexymcr',
            email: 'lexy@mail.com',
            password: 'test123'
        }
    });
    console.log("Created User:", createdUser);
    
    return createdUser;
}

const createProfile = async (user) => {
    const createdProfile = await prisma.profile.create({
        data: {
            firstName: 'Alexa',
            lastName: 'Maingard',
            age: 27,
            pictureUrl: 'http://fake_link_profile',
            user:{
                connect: {
                    id: user.id
                }
            }
        }
    });
    console.log("Created Profile:", createdProfile);
    
    return createdProfile;
}

const createCategory = async () => {
    const categoryNames = ['testCatA', 'testCatB', 'testCatC'];
    const createdCategories = [];

    for(let i = 0; i < categoryNames.length; i++){
        const createdCategory = await prisma.category.create({
            data: {
                name: categoryNames[i]
            }
        });
        console.log("Created Category:", createdCategory);

        createdCategories.push(createdCategory);
    }

    return createdCategories;
}

const createPost = async (user, categories) => {
    const postTitles = ['testPostA', 'testPostB', 'testPostC'];
    const createdPosts = [];

    for(let i = 0; i < postTitles.length; i++){
        const createdPost = await prisma.post.create({
            data: {
                title: postTitles[i],
                content: 'This is a test post',
                imageUrl: 'http://fake_link_post',
                publishedAt: new Date('2022-02-08T11:08'),
                user: {
                    connect: {
                        id: user.id
                    }
                },
                categories: {
                    create: [
                        {
                            category: {
                                connect: {
                                    id: categories[i].id
                                }
                            }
                        }
                    ]
                }
            }
        });
        console.log("Created Post:", createdPost);
        
        createdPosts.push(createdPost);
    }

    return createdPosts;
}

const createComment = async (user, posts, index) => {
    const createdComment = await prisma.comment.create({
        data: {
            content: 'This is a test comment',
            user: {
                connect: {
                    id: user.id
                }
            },
            post: {
                connect: {
                    id: posts[index].id
                }
            }
        }
    });
    console.log("Created Comment:", createdComment);

    return createdComment;
}

seed()
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
    })
    .finally(() => process.exit(1));