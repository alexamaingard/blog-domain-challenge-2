const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUserBoilerPlate = async (req) => {
    const { username, email, password } = req.body;

    const user = {
        username: username,
        email: email,
        password: password
    }

    return user;
}

const createProfileBoilerPlate = async (req) => {
    const { firstName, lastName, age, pictureUrl } = req.body.profile;
    const profile = {
        firstName: firstName,
        lastName: lastName,
        age: age,
        pictureUrl: pictureUrl
    }

    return profile;
}

const createUserWithProfile = async (req, res) => {
    console.log("Req body:", req.body);
    const user = await createUserBoilerPlate(req);
    console.log("Created User Returned:", user);
    const profile = await createProfileBoilerPlate(req);
    console.log("Created Profile Returned:", profile);

    try{
        const createdUserWithProfile = await prisma.user.create({
            data: {
                ...user,
                profile: {
                    create: {
                        ...profile
                    }
                }
            }
        });
        console.log("Created User with Profile:", createdUserWithProfile);

        if(createdUserWithProfile){
            return res.json({ data: createUserWithProfile });
        }
        throw "User with profile couldn't be created.";
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    createUserWithProfile
}