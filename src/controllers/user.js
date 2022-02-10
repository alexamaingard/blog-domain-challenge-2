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

const findUser = async (id) => {
    try{
        const userFound = await prisma.user.findUnique({
            where: {
                id: id
            }
        });

        if(userFound){
            return userFound;
        }
        throw "User not found.";
    }
    catch(error){
        console.log(error);
    }
}

const updateUser = async (req, res) => {
    console.log("Params:", req.params);
    const id = parseInt(req.params.id);
    const { username, email, password } = req.body;

    try{
        const userToUpdate = await findUser(id);
        console.log("User to update:", userToUpdate);

        const data = {
            username: username? username: userToUpdate.username,
            password: password? password: userToUpdate.password,
            email: email? email: userToUpdate.email
        };

        if(userToUpdate){
            const updatedUser = await prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    ...data
                }
            });
            console.log("Updated user:", updatedUser);

            return res.json({ data: updatedUser });
        }
        throw "User not found.";
    }
    catch(error){
        console.log(error);
    }
}

const updateProfile = async (req, res) => {
    console.log("Id:", req.params);
    const { firstName, lastName, age, pictureUrl } = req.body;
    const id = parseInt(req.params.id);


    try{
        const userFound = await findUser(id);
        console.log("User found:", userFound);

        if(userFound){
            const profileToUpdate = await prisma.profile.findUnique({
                where: {
                    userId: id
                }
            });
            console.log("Profile found:", profileToUpdate);

            if(profileToUpdate){
                const profileToUpdateData = {
                    firstName: firstName? firstName: profileToUpdate.firstName,
                    lastName: lastName? lastName: profileToUpdate.lastName,
                    age: age? age: profileToUpdate.age,
                    pictureUrl: pictureUrl? pictureUrl: profileToUpdate.pictureUrl
                }

                const updatedProfile = await prisma.profile.update({
                    where: {
                        userId: id
                    },
                    data: {
                        ...profileToUpdateData
                    }
                });
                console.log("Updated Profile:", updatedProfile);

                return res.json({ data: updatedProfile });
            }
            throw "Profile corresponding to user not found.";
        }
        throw "User corresponding to profile not found.";
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    createUserWithProfile,
    updateUser,
    updateProfile
}