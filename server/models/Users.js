import sqlite3 from "sqlite3";

export class UserModel {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath);
    this.initTable();
  }

  initTable() {
    this.db.run(`CREATE TABLE IF NOT EXISTS users (
		  user_id INTEGER PRIMARY KEY,
		  email TEXT,
		  password TEXT,
		  name TEXT,
		  img BLOB
		)`);
  }

  async getUserByParameter(parameterName, parameterValue) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM users WHERE ${parameterName} = ?`,
        [parameterValue],
        (err, row) => {
          if (err) {
            resolve({ err: err });
            return;
          }
          resolve({ row: row });
        }
      );
    });
  }

  getAllUsers(callback) {
    this.db.all("SELECT * FROM users", callback);
  }

  async createNewUser(email, password, callback) {
    this.db.run(
      `INSERT INTO users (email, password) VALUES (?, ?);`,
      [email, password],
      await callback
    );
  }

  async deleteUser(user_id, callback){
    this.db.run(
      `DELETE FROM users WHERE user_id = ?`,
      [user_id], await callback
    )
  }

  async updateUserById(values, placeholders, user_id) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE users SET ${placeholders} WHERE user_id = ?`,
        [...values, user_id],
        (err, row) => {
          if (err) {
            resolve({ err: err });
            return;
          }
          resolve({ row: true });
        }
      );
    });
  }
}
