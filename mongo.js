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

db.employees.find({
  skills: { $elemMatch: { name: "developer", level: { $gt: 6 } } },
});
