import { Sequelize } from "sequelize/types";

export default (sequelize: Sequelize, DataTypes: any) => {
  const currentModel: any = sequelize.define(
    "users",
    {
        name: {
            type: DataTypes.STRING
        },
        lastname: {
            type: DataTypes.STRING
        },
        identification_number: {
            type: DataTypes.INTEGER,
            unique: true
        },
        birth_date: {
            type: DataTypes.DATEONLY,
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING
        },
        avatar: {
            type: DataTypes.STRING,
        },
        front_identification_image_url: {
            type: DataTypes.STRING,
        },
        back_identification_image_url: {
            type: DataTypes.STRING,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Active es requerido"
                },
            },
        },
    },
    {
      paranoid: true,
      timestamps: true
    }
  );
  currentModel.associate = (db: any) => {

    //ROLE
    db.users.belongsTo(db.roles, {
        foreignKey: {
            name: 'role_id'
        },
        references: {
            model: db.roles,
            key: 'id'
        }
    })
    db.roles.hasMany(db.users)

    //GENDER
    db.users.belongsTo(db.genders, {
        foreignKey: {
            name: 'gender_id'
        },
        references: {
            model: db.genders,
            key: 'id'
        }
    })
    db.genders.hasMany(db.users)

    //IDENTIFICATIONTYPE
    db.users.belongsTo(db.identification_types, {
        foreignKey: {
            name: 'identification_type_id'
        },
        references: {
            model: db.identification_types,
            key: 'id'
        }
    })
    db.identification_types.hasMany(db.users)
    
}

  return currentModel;
};
