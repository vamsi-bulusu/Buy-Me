const db = require('../config/db');

const Admin = {
  selectAll: async () => {
    try {
      const queryString =
        'SELECT email_id, password FROM bm_auction_system.admin;';
      const [rows] = await db.query(queryString);
      return rows;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve admins');
    }
  },
  selectOneById: async (id) => {
    const queryString =
      'SELECT email_id, password FROM bm_auction_system.admin WHERE email_id=?;';
    try {
      const [rows] = await db.execute(queryString, [id]);
      return rows && rows.length ? rows[0] : null;
    } catch (err) {
      console.error(err);
      throw new Error('Cannot query admin by ID');
    }
  },
  insertOneCR: async (vals) => {
    const queryString =
      'INSERT INTO `bm_auction_system`.`customer_rep`(`email_id`, `password`, `name`, `user_name`, `phone_number`) VALUES (?,?,?,?,?);';
    try {
      const [result] = await db.execute(queryString, vals);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to insert customer representative');
    }
  },
  deleteOneCR: async (id) => {
    const queryString = 'DELETE FROM customer_rep WHERE email_id=?;';
    try {
      const [result] = await db.execute(queryString, [id]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to delete user');
    }
  },
  updateOneCR: async (vals, id) => {
    vals.push(id);
    const queryString = 'UPDATE customer_rep SET user_name=?, password=? WHERE email_id=?;';
    try {
      const [result] = await db.execute(queryString, vals);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to update customer_rep');
    }
  },
  getSalesReport: async (date1, date2) => {
    const queryString1 = 'Select SUM(amount) as total from sales WHERE sale_timestamp <= ? and sale_timestamp >= ?;';
    const queryString2 = 'Select product_id, SUM(amount) as item_earnings from sales WHERE sale_timestamp <= ? and sale_timestamp >= ? group by buyer_email_id order by item_earnings DESC limit 5;';
    const queryString3 = 'Select buyer_email_id, SUM(amount) as user_earnings from sales WHERE sale_timestamp <= ? and sale_timestamp >= ? group by buyer_email_id order by user_earnings DESC limit 5;';
    const queryString4 = 'Select product_id, SUM(amount) as item_earnings from sales WHERE sale_timestamp <= ? and sale_timestamp >= ? group by buyer_email_id order by item_earnings DESC';
    const queryString5 = 'Select buyer_email_id, SUM(amount) as user_earnings from sales WHERE sale_timestamp <= ? and sale_timestamp >= ? group by buyer_email_id order by user_earnings DESC';
    const queryString6 = 'Select P.subcategory_id, SUM(S.amount) as category_earnings from sales S inner join product P on P.product_id = S.product_id WHERE S.sale_timestamp <= ? and S.sale_timestamp >= ? group by P.subcategory_id order by category_earnings DESC';
    try{
      const [result1] = await db.execute(queryString1, [date2, date1]);
      const [result2] = await db.execute(queryString2, [date2, date1]);
      const [result3] = await db.execute(queryString3, [date2, date1]);
      const [result4] = await db.execute(queryString4, [date2, date1]);
      const [result5] = await db.execute(queryString5, [date2, date1]);
      const [result6] = await db.execute(queryString6, [date2, date1]);
      var topProducts = []
      for(let i= 0; i< result2.length; i++) {
        topProducts.push(result2[i].product_id);
      }
      var topUsers = []
      for(let j= 0; j< result3.length; j++){
        topUsers.push(result3[j].buyer_email_id);
      }
      const result = {};
      result['total_earnings'] = result1[0].total;
      result['Top_products'] = topProducts;
      result['Top_buyers'] = topUsers;
      result['total_earnings_per_user'] = result4;
      result['total_earnings_per_item'] = result5;
      result['total_earnings_per_category'] = result6;
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch sales belonging to the given range');
    }
  }
};

module.exports = Admin;
