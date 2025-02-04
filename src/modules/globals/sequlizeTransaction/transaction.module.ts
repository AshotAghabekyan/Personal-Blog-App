
import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { SequlizeTransactionProvider } from "./transaction.provider";
import { Global } from "@nestjs/common";


@Global()
@Module({
    exports: [SequlizeTransactionProvider],
    providers: [SequlizeTransactionProvider],
})
export class SequlizeTransactionModule {};