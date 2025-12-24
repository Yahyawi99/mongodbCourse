db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "address"],
      properties: {
        name: {
          bsonType: "string",
          description: "name is a required text field!",
        },
        email: {
          bsonType: "string",
          description: "email is a required text field!",
        },
        address: {
          bsonType: "object",
          description: "address is a required field!",
          properties: {
            street: { bsonType: "string" },
            city: { bsonType: "string" },
            country: { bsonType: "string" },
          },
        },
        gender: {
          bsonType: "string",
        },
      },
    },
    validationLevel: "moderate",
    validationAction: "warn",
  },
});

db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "address"],
      properties: {
        _id: {
          bsonType: "objectId",
        },
        name: {
          bsonType: "string",
          description: "name is a required text field!",
        },
        email: {
          bsonType: "string",
          description: "email is a required text field!",
        },
        address: {
          bsonType: "object",
          description: "address is a required field!",
          properties: {
            street: { bsonType: "string" },
            city: { bsonType: "string" },
            country: { bsonType: "string" },
          },
        },
        gender: {
          bsonType: "string",
        },
      },
      additionalProperties: false,
    },
  },
  validationLevel: "moderate",
  validationAction: "warn",
});

db.countries.insertMany(
  [
    {
      _id: "PAK",
      name: "Pakistan",
    },
    {
      _id: "FR",
      name: "France",
    },
    {
      _id: "USA",
      name: "United States",
    },
  ],
  { ordered: false }
);

db.products.find({
  $expr: {
    $gt: [
      {
        $subtract: ["$price", "$discount"],
      },
      100,
    ],
  },
});

let merry = {
  name: "Merry Smith",
  age: 25,
  skills: [
    { name: "developer", level: 7 },
    { name: "tester", level: 5 },
  ],
  hobbies: ["music", "cooking"],
};

db.employees.find({
  skills: {
    $elemMatch: {
      name: "tester",
      level: { $gte: 3 },
    },
  },
});

db.employees.find(
  {},
  {
    _id: 0,
    name: 1,
    "skills.name": 1,
  }
);

db.products.find(
  { ratings: { $gte: 8 } },
  {
    _id: 0,
    name: 1,
    price: 1,
    ratings: 1,
    category: { $elemMatch: { $eq: ["electronics", "laptop", "mobile"] } },
  }
);

db.products.find(
  {},
  {
    _id: 0,
    name: 1,
    price: 1,
    category: { $slice: [1, 1] },
  }
);

//
db.employees.find({
  skills: { $elemMatch: { name: "developer", level: { $gt: 6 } } },
});

// elementMatch : update specific element in an array (first match)
db.employees.updateMany(
  { skills: { $elemMatch: { name: "developer", level: { $gte: 6 } } } },
  { $set: { "skills.$.expert": true } }
);

//  update specific element in an array (all elements)
db.employees.updateMany(
  { skills: { $exists: true } },
  { $inc: { "skills.$[].level": -1 } }
);

// update specific elements in an array (all matching elements)
db.employees.updateMany(
  { "skills.level": { $gte: 6 } },
  { $set: { "skills.$[el].expert": true } },
  { arrayFilters: [{ "el.level": { $gte: 6 } }] }
);

// Array manipulation ( allow duplicates)
db.employees.updateOne(
  { name: "Steve Smith" },
  {
    $push: {
      skills: {
        $each: [
          { name: "JAVA", level: 1 },
          { name: "JAVA", level: 8 },
        ],
        $sort: { level: 1 },
        $slice: 1,
      },
    },
  }
);

// Array manipulation ( doesn't allow duplicates)
db.employees.updateOne(
  { name: "Steve Smith" },
  { $addToSet: { skills: { name: "JAVA", level: 2 } } }
);

// Array manipulation (deletion)
db.employees.updateOne({ name: "Steve Smith" }, { $pop: { skills: -1 } });
db.employees.updateOne(
  { name: "Steve Smith" },
  { $pull: { skills: { name: "JAVA" } } }
);

// Aggregation ($match)
db.employees
  .aggregate([
    { $match: { gender: "male" } },
    { $match: { "address.country": "usa" } },
  ])
  .forEach((e) => {
    console.log(e.firstname + " is from " + e.address.country);
  });

// Aggregation ($group)
db.employees.aggregate([
  { $match: { gender: "male" } },
  { $group: { _id: { country: "$address.country" }, total: { $sum: 1 } } },
]);

// Aggregation ($sort)
db.employees.aggregate([
  { $match: { gender: "male" } },
  { $group: { _id: { country: "$address.country" }, total: { $sum: 1 } } },
  { $sort: { total: 1 } },
]);

db.employees.aggregate([
  {
    $project: {
      _id: 0,
      firstname: 1,
      gender: 1,
      email: 1,
    },
  },
]);

// Aggregation ($project)
db.employees.aggregate([
  {
    $project: {
      _id: 0,
      email: 1,
      gender: 1,
      name: {
        $concat: [
          { $toUpper: { $substrCP: ["$firstname", 0, 1] } },
          {
            $substrCP: [
              "$firstname",
              1,
              { $subtract: [{ $strLenCP: "$firstname" }, 1] },
            ],
          },
          " ",
          { $toUpper: { $substrCP: ["$lastname", 0, 1] } },
          {
            $substrCP: [
              "$lastname",
              1,
              { $subtract: [{ $strLenCP: "$lastname" }, 1] },
            ],
          },
        ],
      },
    },
  },
]);

// Transforming data
db.employees.aggregate([
  {
    $project: {
      _id: 0,
      firstname: 1,
      email: 1,
      location: {
        type: "point",
        coordinates: [
          {
            $convert: {
              input: "$address.location.coordinates.long",
              to: "double",
              onError: 0.0,
              onNull: 0.0,
            },
          },
          {
            $convert: {
              input: "$address.location.coordinates.lat",
              to: "double",
              onError: 0.0,
              onNull: 0.0,
            },
          },
        ],
      },
    },
  },
]);
