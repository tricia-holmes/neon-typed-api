import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from 'sequelize'
import { sequelize } from '..'

class TypingTest extends Model<
  InferAttributes<TypingTest>,
  InferCreationAttributes<TypingTest>
> {
  declare id: CreationOptional<number>
  declare userId: string
  declare wpm: number
  declare accuracy: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  toJSON(): any {
    const values = Object.assign({}, this.get()) as any
    delete values.id
    delete values.userId
    delete values.UserId
    delete values.updatedAt
    return values
  }
}

TypingTest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    wpm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accuracy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { tableName: 'typing_tests', underscored: true, sequelize }
)

export default TypingTest
