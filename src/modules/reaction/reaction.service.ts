import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { Reaction } from "./model/reaction.model";
import { InjectModel } from "@nestjs/sequelize";
import { BadRequestException } from "@nestjs/common";
import { ReactionRepository } from "./reaction.repository";
import { ReactionCreationAttrs } from "./model/reaction.model";
import errorResponse from "src/config/errorResponse";


@Injectable()
export class ReactionService {
    private readonly repository: ReactionRepository;

    constructor(reactionRepository: ReactionRepository) {
        this.repository = reactionRepository
    }


    public async allReactionsOfBlog(blogId: number) {
        const targetBlogReactions = await this.repository.allReactionsOfBlog(blogId);
        return targetBlogReactions || null;
    }


    public async userReactions(userId: number) {
        const targetUserReactions = await this.repository.userReactions(userId);
        return targetUserReactions || null;
    }


    public async likeBlog(blogId: number, userId: number) {
        const reaction: ReactionCreationAttrs = {blogId, userId};
        const existReaction: Reaction = await this.repository.getReaction(reaction);
        if (existReaction) {
            throw new BadRequestException(errorResponse.reactions);
        }

        await this.repository.likeBlog(reaction);
        return true;
    }


    public async unlikeBlog(blogId: number, userId: number) {
        const reaction: ReactionCreationAttrs = {userId, blogId};

        const existReaction: Reaction = await this.repository.getReaction(reaction);
        if (!existReaction) {
            throw new BadRequestException("user cannot react");
        }

        await this.repository.unlikeBlog(reaction)
    }
}


