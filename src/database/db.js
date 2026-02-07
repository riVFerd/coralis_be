import mysql from "mysql2/promise";
import { json } from "express";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
})

/***
 * A helper class for performing common database operations on a specified table.
 * @param {string} tableName - The name of the database table to operate on.
 */
export class DbHelper {
    #conn;

    constructor(tableName) {
        this.#conn = pool;
        this.tableName = tableName;
    }

    /***
     * Inserts a new record into the specified table.
     * @param {Object} data - An object containing the data to be inserted, where keys are column names and values are the corresponding values to be inserted.
     */
    async insert(data) {
        const keys = Object.keys(data).join(", ");
        const placeholders = Object.keys(data).map(() => "?").join(", ");
        const values = Object.values(data);

        const [result] = await this.#conn.execute(
            `INSERT INTO ${this.tableName} (${keys})
             VALUES (${placeholders})`,
            values
        );

        return result[0];
    }

    /***
     * Updates an existing record in the specified table.
     * @param {Object} params - An object containing the parameters for the update operation.
     * @param {number|string} params.id - The identifier of the record to be updated.
     * @param {Object} params.data - An object containing the data to be updated, where keys are column names and values are the corresponding new values.
     */
    async update({ id, data, idColumn = 'id' }) {
        const setClause = Object.keys(data).map(key => `${key} = ?`).join(", ");
        const values = [...Object.values(data), id];

        const [result] = await this.#conn.execute(
            `UPDATE ${this.tableName}
             SET ${setClause}
             WHERE ${idColumn} = ?`,
            values
        );
        return result[0];
    }

    async getById({ id, columns = ['*'], idColumn = 'id' }) {
        const cols = columns.join(", ");
        const [rows] = await this.#conn.execute(
            `SELECT ${cols}
             FROM ${this.tableName}
             WHERE ${idColumn} = ?`,
            [id]
        );
        return rows[0];
    }

    /***
     * Retrieves records from the specified table based on given conditions.
     * @param {Object} params - An object containing the parameters for the query.
     * @param {Object} params.condition - An object representing the conditions for the WHERE clause, where keys are column names and values are the corresponding values to match.
     * @param {String} params.customConditions - A string representing any additional custom conditions for the WHERE clause.
     */
    async getByCondition({ condition = {}, columns = ['*'], customConditions = "" }) {
        const cols = columns.join(", ");
        const conditionKeys = Object.keys(condition);
        const conditionValues = Object.values(condition);
        let whereClause = conditionKeys.map(key => `${key} = ?`).join(" AND ");

        if (customConditions) {
            if (whereClause) {
                whereClause += ` AND (${customConditions})`;
            } else {
                whereClause = customConditions;
            }
        }

        const [rows] = await this.#conn.execute(
            `SELECT ${cols}
             FROM ${this.tableName}
             WHERE ${whereClause}`,
            conditionValues
        );
        return rows[0];
    }

    /***
     * Deletes records from the specified table based on given conditions.
     * @param {Object} condition - An object representing the conditions for the WHERE clause, where keys are column names and values are the corresponding values to match.
     */
    async deleteByCondition(condition = {}) {
        const conditionKeys = Object.keys(condition);
        const conditionValues = Object.values(condition);
        const whereClause = conditionKeys.map(key => `${key} = ?`).join(" AND ");

        const [result] = await this.#conn.execute(
            `DELETE
             FROM ${this.tableName}
             WHERE ${whereClause}`,
            conditionValues
        );
        return result[0];
    }
}