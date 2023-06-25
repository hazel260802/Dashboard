// controllers/rating.js
const connection = require("../database");
const Rating = require("../models/rating");
const { runInterval } = require("../utils/schedule");

const updateRatings = async () => {
    try {
        const oneMinuteAgo = new Date(Date.now() - 60000);

        // Format the timestamp for the MySQL query
        const formattedTimestamp = oneMinuteAgo
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

        // Query to retrieve newly added comments and their ratings
        const query = `SELECT hotel_id, rate, count(*) FROM comments WHERE created_at > '${formattedTimestamp}' GROUP BY hotel_id, rate`;

        connection.query(query, async (error, results) => {
            if (error) throw error;
            if (results.length == 0) {
                console.log("No new rating");
            } else {
                console.log("New ratings: ", results.length);
            }

            for (const result of results) {
                const { hotel_id, rate, count } = result;

                // Find the existing ratings for the hotel in MongoDB
                let existingRatings = await Rating.findOne({
                    hotelId: hotel_id,
                });

                // If ratings exist, update the corresponding rating count
                if (existingRatings) {
                    if (rate >= 4.5) existingRatings.wonderful += count;
                    else if (rate >= 3.5) existingRatings.good += count;
                    else if (rate >= 2.5) existingRatings.average += count;
                    else if (rate >= 1.5) existingRatings.poor += count;
                    else existingRatings.terrible += count;

                    await existingRatings.save();
                }
                // If ratings don't exist, create a new document with the ratings
                else {
                    let newRatings = {
                        hotelId: hotel_id,
                        wonderful: 0,
                        good: 0,
                        average: 0,
                        poor: 0,
                        terrible: 0,
                    };

                    if (rate >= 4.5) newRatings.wonderful += count;
                    else if (rate >= 3.5) newRatings.good += count;
                    else if (rate >= 2.5) newRatings.average += count;
                    else if (rate >= 1.5) newRatings.poor += count;
                    else newRatings.terrible += count;

                    await new Rating(newRatings).save();
                }
            }
        });
    } catch (error) {
        console.log("Error:", error);
    }
};

runInterval(updateRatings, process.env.RATING_INTERVAL);

module.exports = { updateRatings };