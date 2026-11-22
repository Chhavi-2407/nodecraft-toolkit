
const { PrismaClient } = require("@prisma/client");
const { database } = require("..");

const prisma = new PrismaClient();

const userService = database.createCrudService(prisma.user);

async function main() {
    try {
        // CREATE
        const user = await userService.create({
            name: "Chhavi",
            email: `chhavi-${Date.now()}@example.com`
        });

        console.log("Created user:", user);

        // READ ALL
        const users = await userService.getAll({
            page: 1,
            limit: 10
        });

        console.log("All users:", users);

        // READ BY ID
        const userById = await userService.getById(user.id);

        console.log("User by ID:", userById);

        // UPDATE
        const updatedUser = await userService.update(user.id, {
            name: "Chhavi Sharma"
        });

        console.log("Updated user:", updatedUser);

        // DELETE
        const deletedUser = await userService.remove(user.id);

        console.log("Deleted user:", deletedUser);

    } catch (error) {
        const handledError = database.handleDatabaseError(error);
        console.error("Database error:", handledError.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
