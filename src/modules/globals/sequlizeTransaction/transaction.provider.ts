import { Injectable } from "@nestjs/common";
import sequelize, { TransactionOptions } from "sequelize";
import { Sequelize } from "sequelize-typescript";


const transactionOptions: TransactionOptions = {
    "autocommit": false,
}

@Injectable()
export class SequlizeTransactionProvider {
    private readonly sequlize: Sequelize;
    constructor(sequlizeInstance: Sequelize) {
        this.sequlize = sequlizeInstance;
    }

    public async runTransaction(callback: Function, options: TransactionOptions = transactionOptions) {
        await this.sequlize.transaction(options, async (transaction: sequelize.Transaction) => {
            try {
                await callback();
            }
            catch(error) {
                console.error(error);
            }
        })
    }
}