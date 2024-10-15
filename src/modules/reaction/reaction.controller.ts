import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { ReactionService } from "./reaction.service";
import { HttpCode, HttpStatus, Get, Post, Delete, Param, ParseIntPipe, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthGuard } from "../auth/auth.guard";


@Controller("/reactions")
export class ReactionController {
    private readonly reactionService: ReactionService;

    constructor(reactionService: ReactionService) {
        this.reactionService = reactionService;
    } 

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("/:blogId")
    public getReactions(@Param("blogId", ParseIntPipe) blogId: number) {
        return this.reactionService.allReactionsOfBlog(blogId);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("/user/:userId")
    public async userReactions(@Param("userId", ParseIntPipe) userId: number) {
        return this.reactionService.userReactions(userId);
    }


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post("/:blogId/like")
    public likeBlog(@Param("blogId", ParseIntPipe) blogId: number, @Req() req: Request) {
        const userId = req['user'].sub;
        return this.reactionService.likeBlog(blogId, userId);
    }


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete("/:blogId/unlike")
    public unlikeBlog(@Param("blogId", ParseIntPipe) blogId: number, @Req() req: Request) {
        const userId = req['user'].sub;
        return this.reactionService.unlikeBlog(blogId, userId);
    }
}



