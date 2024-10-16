import { Model, Column, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, Table, HasMany } from "sequelize-typescript";
import { User } from "src/modules/user/model/user.model";
import { Reaction } from "src/modules/reaction/model/reaction.model";
import { BlogContentType } from "./blog.dto";

export interface BlogCreationAttributes {
    publisherId: number,
    blogTitle: string,
    mainContent: string
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

    // @Column
    // public contentType: BlogContentType[];

    @Column
    public publishedDate: Date = new Date();


    @HasMany(() => Reaction)
    reactions: Reaction[]
}