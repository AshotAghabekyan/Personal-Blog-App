import { Model, Column, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, Table } from "sequelize-typescript";
import { User } from "src/modules/user/model/user.model";


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

    @Column
    public publishedDate: Date = new Date();

    @Column
    public likeCount: number = 0;
}