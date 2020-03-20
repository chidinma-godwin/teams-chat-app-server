import bcrypt from "bcrypt";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: "An account with this username already exist"
        },
        validate: {
          isAlphanumeric: {
            args: true,
            msg: "Username must be alpha numeric"
          },
          len: {
            args: [3, 50],
            msg: "Username must be between 3 and 50 characters long"
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          message: "An account with this email already exist"
        },
        validate: {
          isEmail: {
            args: true,
            msg: "Invalid email"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [7, 30],
            msg: "Password must be between 7 and 30 characters long"
          }
        }
      }
    },
    {
      hooks: {
        afterValidate: async user => {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  );

  User.associate = models => {
    User.belongsToMany(models.Team, {
      through: "member",
      foreignKey: "userId"
    });
  };

  return User;
};
