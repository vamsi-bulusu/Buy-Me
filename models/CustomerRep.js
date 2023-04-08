const db = require('../config/db');

const CR = {
  selectAll: async () => {
    try {
      const queryString =
        'SELECT email_id, password, name, user_name, phone_number, emp_id FROM bm_auction_system.customer_rep;';
      const [rows] = await db.query(queryString);
      return rows;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve users');
    }
  },
  selectOneById: async (id) => {
    const queryString =
      'SELECT email_id, password, name, user_name, phone_number, emp_id FROM bm_auction_system.customer_rep WHERE email_id=?;';
    try {
      const [rows] = await db.execute(queryString, [id]);
      console.log('SelectOneById', rows);
      return rows && rows.length ? rows[0] : null;
    } catch (err) {
      console.error(err);
      throw new Error('Cannot query user by ID');
    }
  },
  selectOneByUsername: async (username) => {
    const queryString =
      'SELECT email_id, password, name, username, phone_number, address FROM bm_auction_system.customer_rep WHERE user_name=?;';
    try {
      const [rows] = await db.execute(queryString, [username]);
      return rows;
    } catch (err) {
      console.error(err);
      throw new Error('Cannot query customer representative by username');
    }
  },
  deleteBidById: async (Id) => {
    const queryString = 'Delete from bm_auction_system.bid where bid_id = ?;';
    try {
        const [rows] = await db.execute(queryString, [Id]);
        return rows;
    } catch (err) {
        console.error(err);
        throw new Error('Unable to delete customer representative by bid_id');
    }
  },
  deleteAuctionById: async (Id) => {
    const queryString = 'Delete from bm_auction_system.auction where auction_id = ?;';
    try {
        const [rows] = await db.execute(queryString, [Id]);
        return rows;
    } catch (err) {
        console.error(err);
        throw new Error('Unable to delete auction by auction_id');
    }
  },
  changePasswordById: async (Id, new_password) => {
    const queryString = 'Update bm_auction_system.user Set password = ? where email_id = ?;';
    try {
        const [rows] = await db.execute(queryString, [new_password, Id]);
        return rows;
    } catch (err) {
        console.error(err);
        throw new Error('Unable to change user password');
    }
  },
};

module.exports = CR;
