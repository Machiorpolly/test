const { Hospitals, Patients, Psychiatrists } = require("../models/models");
const sequelize = require("../sequelize");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

exports.upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" }, // 1MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|JPG|JPEG/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Invalid File Format!");
  },
}).single("photo");

exports.getRecords = async (req, res) => {
  const hospitalId = req.params.id;
  try {
    const hospitalDetails = await Hospitals.findOne({
      where: { id: hospitalId },
      attributes: [
        ["name", "HospitalName"],
        [
          sequelize.literal(`(
          SELECT COUNT(DISTINCT Psychiatrists.id)
          FROM Psychiatrists
          WHERE Psychiatrists.HospitalId = Hospitals.id
        )`),
          "TotalPsychiatristCount",
        ],
        [
          sequelize.literal(`(
          SELECT COUNT(DISTINCT Psychiatrists.id)
          FROM Psychiatrists
          LEFT JOIN Patients ON Psychiatrists.id = Patients.PsychiatristId
          WHERE Psychiatrists.HospitalId = Hospitals.id
        )`),
          "TotalPatientsCount",
        ],
        [
          sequelize.literal(`(
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'Id', Psychiatrists.id,
              'Name', Psychiatrists.name,
              'PatientsCount', (
                SELECT COUNT(Patients.id)
                FROM Patients
                WHERE Patients.PsychiatristId = Psychiatrists.id
              )
            )
          )
          FROM Psychiatrists
          WHERE Psychiatrists.HospitalId = Hospitals.id
        )`),
          "PsychiatristDetails",
        ],
      ],
      include: [
        {
          model: Psychiatrists,
          attributes: [],
          required: false,
          include: [
            {
              model: Patients,
              attributes: [],
              required: false,
            },
          ],
        },
      ],
      group: ["Hospitals.id", "Psychiatrists.id"],
      raw: true,
    });
    if (hospitalDetails) res.status(200).send(hospitalDetails);
    else res.status(404).send("Invalid Hospital ID!");
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

exports.signup = async (req, res) => {
  const { name, address, email, phone, password, PsychiatristId } = req.body;

  const photoPath = req.file ? req.file.path : null;

  try {
    await Patients.create({
      name: name,
      address: address,
      email: email,
      phone: phone,
      password: password,
      photo: photoPath,
      PsychiatristId: PsychiatristId,
    });

    res.status(200).send("Patient Successfully Registered.");
  } catch (err) {
    console.log("Error inserting data: ", err);
    var errorList = [];
    err.errors.forEach((element) => {
      errorList.push(element.message);
    });
    res.status(500).send(errorList);
  }
};
