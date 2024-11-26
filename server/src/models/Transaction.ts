import { DataTypes, Model } from 'sequelize';
import { v4 as generateUUIDv4 } from 'uuid';
import { sequelize } from '../database';

class Transaction extends Model {
    public id!: string;
    public user_id!: string;
    public category_id!: string;
    public type!: 'income' | 'expense';
    public amount!: number;
    public currency!: string;
    public location?: string;
    public notes?: string;
    public date!: Date;
}

Transaction.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => generateUUIDv4(),
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id',
            },
        },
        category_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Category', 
                key: 'id',
            },
        },
        type: {
            type: DataTypes.ENUM('income', 'expense'),
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'Transaction',
        tableName: 'Transaction',
        timestamps: false,
        underscored: true,
    }
);


export default Transaction;


