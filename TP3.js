// question 5
db.resto.find(
  {
    borough: "Manhattan",
    cuisine: "Italian",
    name: { $regex: /Pizza/ },
    "grades.score": { $lt: 10, $not: { $gt: 10 } },
  },
  { _id: 0, name: 1, grades: 1 }
);

db.resto.find(
  {
    borough: "Manhattan",
    cuisine: "Italian",
    name: { $regex: /Pizza/ },
    $and: [
      { "grades.score": { $lt: 10 } },
      { "grades.score": { $not: { $gt: 10 } } },
    ],
  },
  { _id: 0, name: 1, grades: 1 }
);

// question 6
db.resto.find(
  {
    borough: "Manhattan",
    grades: {
      $elemMatch: {
        grade: "C",
        score: { $lt: 30 },
      },
    },
  },
  { _id: 0, grades: 1 }
);

// question 7
db.resto.find(
  {
    borough: "Manhattan",
    "grades.0.grade": "C",
  },
  { _id: 0, "grades.grade": 1 }
);

// ===============
db.resto.distinct("cuisine");
db.resto.distinct("grades.grade");

// ===============
db.resto.aggregate([
  {
    $match: {
      "grades.0.grade": "C",
    },
  },
  {
    $project: {
      _id: 0,
      name: 0,
      borough: 0,
    },
  },
]);

// question 2

varMatch = { $match: { "grades.0.grade": "C" } };
varProject = { $project: { name: 1, borough: 1, _id: 0 } };
db.resto.aggregate([varMatch, varProject]);

// question 3
varTrie = { $sort: { name: 1 } };

db.resto.aggregate([varMatch, varTrie, varProject]);

// question 4
varGroupe = { $group: { _id: "$cuisine", total: { $sum: 1 } } };

// question 6
varUnwind = { $unwind: "$grades" };
varGroupe = { $group: { _id: "$borough", average: { $avg: "$grades.score" } } };
varProject = { $project: { grades: 1, _id: 0, borough: "$_id", total: 1 } };
varSort = { $sort: { average: -1 } };
