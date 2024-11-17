import { DataTypes, Model } from 'sequelize';
import { v4 as generateUUIDv4 } from 'uuid';
import { sequelize } from '../database';

class Budget extends Model {
    public id!: string;
    public category_id!: string;
    public user_id!: string;
    public name!: string;
    public type!: 'goal' | 'category_limit';
    public amount!: number;
    public amount_left!: number;
    public start_date!: Date;
    public end_date!: Date;
}

Budget.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => generateUUIDv4(),
        },
        category_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Category',
                key: 'id',
            },
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
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
            type: DataTypes.ENUM('goal', 'category_limit'),
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        amount_left: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Budget',
        tableName: 'Budget',
        timestamps: false,
        underscored: true,
        hooks: {
            beforeCreate: (budget) => {
                budget.amount_left = budget.amount;
            },
        },
    }
);


export default Budget;
