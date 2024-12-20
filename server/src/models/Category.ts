import { DataTypes, Model } from 'sequelize';
import { v4 as generateUUIDv4 } from 'uuid';
import { sequelize } from '../database';

class Category extends Model {
    public id!: string;
    public user_id!: string | null;
    public name!: string; 
    public type!: 'income' |' expense' | 'other';
}

Category.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => generateUUIDv4(),
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'User',
                key: 'id',
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        type: {
            type: DataTypes.ENUM('income', 'expense', 'other'),
            allowNull: false,
        }, 
    },
    {
        sequelize,
        modelName: 'Category',
        tableName: 'Category',
        timestamps: false,
        underscored: true,
    }
);


export default Category;
