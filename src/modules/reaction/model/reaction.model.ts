import { Model, Column, AutoIncrement, PrimaryKey, BelongsTo, ForeignKey, Table } from "sequelize-typescript";
import { Blog } from "src/modules/blog/model/blog.model";
import { User } from "src/modules/user/model/user.model";


export interface ReactionCreationAttrs {
    userId: number,
    blogId: number,
}

@Table
export class Reaction extends Model<Reaction, ReactionCreationAttrs> {

    @PrimaryKey
    @AutoIncrement
    @Column({ type: 'INTEGER' })
    public id: number;

    @ForeignKey(() => Blog)
    @Column
    public blogId: number;

    @BelongsTo(() => Blog, { onDelete: 'CASCADE' })
    public blog: Blog

    @ForeignKey(() => User)
    public userId: number;

    @BelongsTo(() => User, { onDelete: 'CASCADE' })
    public user: User

}