import { AutoIncrement, Column, Model, PrimaryKey, Table, Unique, HasMany } from "sequelize-typescript";
import { CreateUserDto } from "./user.dto";
import { Blog } from "src/modules/blog/model/blog.model";

@Table
export class User extends Model<User, CreateUserDto> {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: 'INTEGER' })
    public id: number;

    @Unique
    @Column
    public email: string;

    @Column
    public password: string;

    @Column
    public username: string;


    @HasMany(() => Blog)
    public blogs: Blog[]
}