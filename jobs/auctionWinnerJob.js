const cron = require('node-cron');
const db = require('../config/db');

const runAuctionWinnerJob = async () => {
    try {
        console.log("calling function assignAuctionWinner");
        //fetching auctions that have ended and their winners have not been assigned
        const endedAuctionsQuery = 'Select auction_id, minimum_price, email_id, product_id from `bm_auction_system`.`auction` where end_time < NOW() and has_winner = 0;';
        const [endedAuctions] = await db.execute(endedAuctionsQuery);
        for(let i = 0; i < endedAuctions.length; i++){
            const highestBidQuery = 'Select MAX(amount), email_id, bidding_timestamp from `bm_auction_system`.`bid` where auction_id = ? group by email_id, bidding_timestamp;';
            const [highestBid] = await db.execute(highestBidQuery, [endedAuctions[i].auction_id]);
            if (highestBid.length > 0 && endedAuctions[i].minimum_price <= highestBid[0].amount){
                const salesEntry = 'Insert into `bm_auction_system`.`sales` (buyer_email_id, seller_email_id, auction_id, product_id, amount, sale_timestamp) VALUES (?,?,?,?,?,?);';
                const [salesEntryRes] = await db.execute(salesEntry, [highestBid[0].email_id, endedAuctions[i].email_id, endedAuctions[i].product_id, highestBid[0].amount, highestBid[0].bidding_timestamp]);
                console.log(salesEntryRes);
            }
            const updateAuction = 'Update `bm_auction_system`.`auction` set has_winner = 1 where auction_id = ?;';
            const [updateAuctionRes] = await db.execute(updateAuction, [endedAuctions[i].auction_id]);
            console.log(updateAuctionRes);
        }    
    }
    catch(err){
        console.log(err);
    }    
};


cron.schedule('*/5 * * * *', () => {
    // call job
    runAuctionWinnerJob();      
    console.log('Running the job every 5 minutes');
    // Add your code to be executed every 5 minutes here
});
