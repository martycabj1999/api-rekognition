import { Sequelize } from "sequelize/types";

export default (sequelize: Sequelize, DataTypes: any) => {
  const currentModel: any = sequelize.define(
    "roles",
    {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "name es requerido"
                },
            },
        }
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return currentModel;
};
