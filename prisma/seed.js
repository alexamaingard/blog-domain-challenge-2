const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seed = async () => {
    const user = await createUser();
    const profile = await createProfile(user);
    // const screens = await createScreens();
    // const screenings = await createScreenings(screens, movies);
    // await createSeats(screens);
    // await createTicket(customer, screenings);

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
            pictureUrl: 'fake_link'
        },
        user:{
            connect: {
                id: user.id
            }
        }

    });
    console.log("Created Profile:", createdProfile);
    
    return createdProfile;
}

seed()
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
    })
    .finally(() => process.exit(1));