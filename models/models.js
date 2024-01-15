const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Patients = sequelize.define(
  "Patients",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [10, 455],
          msg: "Address should be of atleast 10 characters.",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { args: true, msg: "Please give a valid email address." },
      },
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [10, 455],
          msg: "Phone number should be atleast of 10 numbers.",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValid(value) {
          if (value.length < 8 && value.length > 15) {
            throw new Error(
              "Password length must be between 8 and 15 characters and it should contain atleast one uppercase letter, one lowercase letter and one number."
            );
          }

          var cnt = 0;
          for (var i = 0; i < value.length; ++i) {
            var c = value.charAt(i);
            if (c >= "0" && c <= "9") cnt++;
            else if (c >= "a" && c <= "z") cnt++;
            else if (c >= "A" && c <= "Z") cnt++;
          }

          if (cnt < 3) {
            throw new Error(
              "Password length must be between 8 and 15 characters and it should contain atleast one uppercase letter, one lowercase letter and one number."
            );
          }
        },
      },
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Psychiatrists = sequelize.define(
  "Psychiatrists",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Hospitals = sequelize.define(
  "Hospitals",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

// Associations

Patients.belongsTo(Psychiatrists, { foreignKey: { allowNull: false } });
Psychiatrists.hasMany(Patients, { foreignKey: { allowNull: false } });
Psychiatrists.belongsTo(Hospitals, { foreignKey: { allowNull: false } });
Hospitals.hasMany(Psychiatrists, { foreignKey: { allowNull: false } });

module.exports = {
  Patients,
  Psychiatrists,
  Hospitals,
};
