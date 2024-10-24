import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { ReactionController } from "./reaction.controller";
import { ReactionService } from "./reaction.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Reaction } from "./model/reaction.model";
import { JwtModule } from "@nestjs/jwt";
import { ReactionRepository } from "./reaction.repository";

@Module({
    "controllers": [ReactionController],
    "providers": [ReactionService, ReactionRepository],
    "exports": [ReactionService],
    "imports": [SequelizeModule.forFeature([Reaction]), JwtModule]
}) 
export class ReactionModule {}