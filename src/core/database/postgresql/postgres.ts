import type { FastifyInstance } from "fastify";
import {
	MessageInterface,
	WhereInterface,
	OrderByInterface
} from "./variableTypes.interfaces";
export class PostgresSQL {
	private readonly app: FastifyInstance;

	public table: string;
	private sql: string;
	private values: unknown[];
	private i: number;

	constructor(
		app: FastifyInstance
	) {
		this.app = app;
		this.table = '';
		this.sql = '';
		this.values = [];
		this.i = 0;
	}

	protected insert = async <T>(body: T) => {
		try {
			let keys: string[] = Object.keys(body as Record<string, unknown>);
			let values: unknown[] = Object.values(body as Record<string, unknown>);

			this.i = 0;
			// Construcción segura de la consulta SQL
			let sql: string = `INSERT INTO ${this.table} (${keys.join(", ")}) VALUES (${keys.map(() => {
				this.i = this.i + 1;
				return `$${this.i}`;
			}).join(", ")}) RETURNING *`;

			this.i = 0;

			let insert = await this.app.pg.query(sql, values);

			return this.getResponse({ error: false, message: 'successful registration', rows:insert.rows[0] });
		} catch (error) {

			return this.getResponse({ error: true, message: error });
		}

	}

	protected query = async (sql: string) => {
		this.sql = sql;
	}

	protected select = async (fields: string = '*') => {
		this.sql = `SELECT ${fields} FROM ${this.table}`;
	}

	protected update = async <T>(body: T) => {
		try {
			let keys: string[] = Object.keys(body as Record<string, unknown>);
			let values: unknown[] = Object.values(body as Record<string, unknown>);

			this.i = 0;
			let setClause = keys
				.map((key) => {
					this.i = this.i + 1;
					return `${key} = $${this.i}`;
				})
				.join(", ");

			let sql: string = `UPDATE ${this.table} SET ${setClause}`;

			// WHERE id = $${i + 1}
			this.sql = sql;
			this.values = values

		} catch (error) {
			return this.getResponse({ error: true, message: error });
		}
	}

	protected delete = async () => {
		this.sql = `DELETE FROM ${this.table}`;
	}

	protected where = async (conditions: WhereInterface[]) => {
		let setCondition = conditions
			.map((cond) => {
				this.i = this.i + 1;
				let operator = (cond.operator !== '=') ? cond.operator : '=';
				return `${cond.field} ${operator} $${this.i}`

			})
			.join(" AND "); // Cambié a " AND " para evitar errores de sintaxis

		this.sql = `${this.sql} WHERE ${setCondition}`;
		this.values = [...this.values, ...conditions.map((cond) => cond.value)];
	}

	protected orderBy = async(condition:OrderByInterface) => {
		let query = ` ORDER BY ${condition.field} ${condition.order}`
		this.sql = `${this.sql}${query}`
	}

	protected execute = async () => {
		try {
			if (this.values.length > 0) {
				console.log('	SQL QUERY: ', this.sql);
				console.log('	VALUES: ', this.values);
				let consult = await this.app.pg.query(this.sql, this.values);
				this.sql = '';
				this.values = [];
				this.i = 0;
				return this.getResponse({ error: false, rows: consult.rows });
			}
			let consult = await this.app.pg.query(this.sql);
			return this.getResponse({ error: false, rows: consult.rows });
		} catch (error) {
			this.sql = '';
			this.values = [];
			this.i = 0;
			return this.getResponse({ error: true, message: error });
		}
	}

	protected getResponse(msg: MessageInterface) {
		msg.message = msg.message instanceof Error ? `Error: ${msg.message.message}` : msg.message
		return msg;
	}
}
