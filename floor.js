db.films.find(
  {
    $and: [
      { annee: 2010 },
      { "acteurs.0.nom": "Pitt" },
      { "acteurs.0.prenom": "Brad" },
    ],
  },
  {
    titre: 1,
    _id: 0,
  }
);

db.films.updateMany(
  {
    "realisateur.prenom": "Ford",
    "realisateur.nom": "Coppola",
  },
  {
    $set: {
      realisateur: {
        prenom: "Francis-Ford",
        nom: "Coppola",
      },
    },
  }
);

db.films.find({
  $and: [
    { "realisateur.prenom": "Clint", "realisateur.nom": "Eastwood" },
    {
      acteurs: { $elemMatch: { prenom: "Clint", nom: "Eastwood" } },
    },
  ],
});

db.films.find(
  { annee: { $lte: 2005, $gte: 2000 } },
  {
    title: 1,
    acteurPrincipale: { $arrayElemAt: ["$acteurs", 0] },
  }
);

db.films.aggregate([
  {
    $match: {
      "realisateur.prenom": "James",
      "realisateur.nom": "Cameron",
    },
  },
  {
    $sort: { "fiche_tech.duree": -1 },
  },
  { $limit: 1 },
  {
    $project: {
      _id: 0,
      title: 1,
    },
  },
]);

db.films.aggregate([
  {
    $match: {
      acteurs: {
        $elemMatch: {
          prenom: "Brad",
          nom: "Pitt",
        },
      },
    },
  },
  {
    $group: { _id: null, dureeTotal: { $sum: "$fiche_tech.duree" } },
  },
  {
    $project: {
      _id: 0,
    },
  },
]);

db.films.aggregate([
  {
    $match: {
      $and: [
        {
          acteurs: {
            $elemMatch: {
              prenom: "Al",
              nom: "Pacino",
            },
          },
        },
        {
          acteurs: {
            $elemMatch: {
              prenom: "Robert",
              nom: "De Niro",
            },
          },
        },
      ],
    },
  },
  {
    $sort: {
      annee: 1,
    },
  },
  {
    $project: {
      _id: 0,
      title: 1,
      annee: 1,
    },
  },
]);

db.films.aggregate([
  {
    $group: {
      _id: "$fiche_tech.pays",
      total: { $sum: 1 },
    },
  },
]);

db.films.aggregate([
  {
    $unwind: "$acteurs",
  },
  {
    $group: {
      _id: ["$acteurs.nom", "$acteurs.prenom"],
      count: { $sum: 1 },
    },
  },
  {
    $sort: { count: -1 },
  },
  {
    $project: {
      _id: 0,
      name: {
        $concat: [
          { $arrayElemAt: ["$_id", 0] },
          " ",
          { $arrayElemAt: ["$_id", 1] },
        ],
      },
      count: 1,
    },
  },
]);

db.films.aggregate([
  {
    $unwind: "$acteurs",
  },
  {
    $group: {
      _id: { nom: "$acteurs.nom", prenom: "$acteurs.prenom" },
      count: { $sum: 1 },
    },
  },
  {
    $sort: { count: -1 },
  },
  {
    $project: {
      _id: 0,
      acteur: "$_id",
      count: 1,
    },
  },
]);
