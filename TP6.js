db.devoirs.insertMany([
  { code: "NAT123", matiere: "SQL", note: 12 },
  { code: "NAT123", matiere: "JAVA", note: 10 },
  { code: "NAT125", matiere: "JAVA", note: 11.75 },
  { code: "NAT120", matiere: "Dev_Mobile", note: 18 },
  { code: "NAT127", matiere: "NoSQL", note: 19 },
]);

db.eleves.insertMany([
  { nom: "Zakaria ABOURIDA", code: "NAT123" },
  { nom: "Salma KAMAR", code: "NAT125" },
  { nom: "Mohamed BOUSSELHAM", code: "NAT120" },
  { nom: "Rani KAROUI", code: "NAT127" },
]);

db.eleves.aggregate([
  {
    $lookup: {
      from: "devoirs",
      localField: "code",
      foreignField: "code",
      as: "notes",
    },
  },
  {
    $project: {
      _id: 0,
      "notes._id": 0,
      "notes.code": 0,
    },
  },
]);

db.projets.insertMany([
  { codes: ["NAT123", "NAT125"], matiere: "Robotique", note: 15 },
  { codes: ["NAT120", "NAT127"], matiere: "IHM", note: 12 },
  { codes: ["NAT123", "NAT125", "NAT120"], matiere: "WEB", note: 18 },
]);

db.projets.aggregate([
  { $unwind: "$codes" },
  {
    $lookup: {
      from: "eleves",
      localField: "codes",
      foreignField: "code",
      as: "eleve",
    },
  },
  {
    $addFields: {
      eleve: { $arrayElemAt: ["$eleve", 0] },
    },
  },
  {
    $project: {
      _id: 0,
      "eleves._id": 0,
      codes: 0,
    },
  },
]);
