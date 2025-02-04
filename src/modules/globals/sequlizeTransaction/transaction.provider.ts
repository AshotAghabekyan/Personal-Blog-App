import { Inject, Injectable } from "@nestjs/common";
import sequelize, { TransactionOptions } from "sequelize";
import { Sequelize } from "sequelize-typescript";


const transactionOptions: TransactionOptions = {
    "autocommit": false,
};

@Injectable()
export class SequlizeTransactionProvider {
    private readonly sequelize: Sequelize;
    constructor(sequelizeInstance: Sequelize) {
        this.sequelize = sequelizeInstance;
    }

    public async runTransaction(callback: Function, options: TransactionOptions = transactionOptions) {
        await this.sequelize.transaction(options, async (transaction: sequelize.Transaction) => {
            try {
                await callback();
            }
            catch(error) {
                console.error(error);
                await transaction.rollback();
            }
        })
    }
}