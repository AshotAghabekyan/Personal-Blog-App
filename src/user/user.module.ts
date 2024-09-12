import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "./user.model";
import { SequelizeModule } from "@nestjs/sequelize/dist/sequelize.module";

@Module({
    imports: [SequelizeModule.forFeature([User])],
    exports: [UserService],
    controllers: [UserController],
    providers: [UserService]
})

export class UserModule {};