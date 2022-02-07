const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seed = async () => {
    // const customer = await createCustomer();
    // const movies = await createMovies();
    // const screens = await createScreens();
    // const screenings = await createScreenings(screens, movies);
    // await createSeats(screens);
    // await createTicket(customer, screenings);

    process.exit(0);
}

seed()
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
    })
    .finally(() => process.exit(1));