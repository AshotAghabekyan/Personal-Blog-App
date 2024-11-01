import { Model, Column, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, Table, HasMany, BelongsToMany } from "sequelize-typescript";
import { User } from "src/modules/user/model/user.model";
import { Reaction } from "src/modules/reaction/model/reaction.model";
import { BlogGenre } from "src/modules/blog_genre/models/blogGenre.model";
import { BlogGenreTypes } from "src/modules/blog_genre/models/genre.types";


export interface BlogCreationAttributes {
    publisherId: number,
    blogTitle: string,
    mainContent: string,
    genres: BlogGenreTypes[]
}


@Table
export class Blog extends Model<Blog, BlogCreationAttributes> {

    @AutoIncrement
    @PrimaryKey
    @Column({ type: 'INTEGER' })
    public id: number;

    @ForeignKey(() => User)
    public publisherId: number;

    @BelongsTo(() => User, 'publisherId')
    public user: User

    @Column
    public blogTitle: string;

    @Column
    public mainContent: string;

    @Column
    public publishedDate: Date = new Date();


    @HasMany(() => BlogGenre)
    public genres: BlogGenre[]

    @HasMany(() => Reaction)
    public reactions: Reaction[]
}