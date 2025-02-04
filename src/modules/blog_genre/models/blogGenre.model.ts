import { Table, Model, Column, ForeignKey, AutoIncrement, PrimaryKey, BelongsTo } from "sequelize-typescript";
import { Blog } from "src/modules/blog/model/blog.model";


interface BlogGenreCreationAttrs {
    blogId: number,
    genre: string,
}


@Table({
    timestamps: false
})
export class BlogGenre extends Model<BlogGenre, BlogGenreCreationAttrs> {
    @AutoIncrement
    @PrimaryKey
    @Column({ type: 'INTEGER' })
    public id: number;

    @ForeignKey(() => Blog)
    @Column
    blogId: number;

    @BelongsTo(() => Blog, { onDelete: 'CASCADE' })
    public blog: Blog

    @Column
    public genre: string;
}

