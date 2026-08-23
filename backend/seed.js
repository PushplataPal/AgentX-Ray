require("dotenv").config();

const {
    connectDB
} = require("./config/db");

const seedData =
    require("./services/seedData");

(async () => {

    try {

        await connectDB();

        if (
            typeof seedData.seed ===
            "function"
        ) {

            await seedData.seed();

        } else if (
            typeof seedData ===
            "function"
        ) {

            await seedData();

        } else {

            console.log(
                "[Seed] No seed function found."
            );
        }

        console.log(
            "[Seed] Complete."
        );

        process.exit(0);

    } catch (error) {

        console.error(
            "[Seed] Failed:",
            error
        );

        process.exit(1);
    }

})();
