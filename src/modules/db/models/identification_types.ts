import { Sequelize } from "sequelize/types";

export default (sequelize: Sequelize, DataTypes: any) => {
  const currentModel: any = sequelize.define(
    "identification_types",
    {
        type: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "type es requerido"
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
