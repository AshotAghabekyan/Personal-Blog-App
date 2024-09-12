import { AutoIncrement, Column, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { CreateUserDto } from "./user.dto";


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
}
