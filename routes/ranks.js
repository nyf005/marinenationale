const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Rank = mongoose.model("ranks");

// Liste des grades
router.get("/", (req, res) => {
  Rank.find()
  .sort({ordre: "asc"})
  .then(ranks => {
    res.render("ranks/index", {
      ranks: ranks
    });
  })
});

// Formulaire d'ajout de grades
router.get("/add", (req, res) => {
  res.render("ranks/add");
});

// Traitement du formulaire d'ajout
router.post("/add", (req, res) => {
  let errors = [];

  if (!req.body.categorie) {
    errors.push({
      text: "Veuillez sélectionner une catégorie"
    });
  }
  if (!req.body.sous_categorie && req.body.categorie !== "militaire_du_rang") {
    errors.push({
      text: "Veuillez sélectionner une sous-catégorie"
    });
  }
  if (!req.body.grade) {
    errors.push({
      text: "Veuillez saisir le grade"
    });
  }
  if (!req.body.ordre) {
    errors.push({
      text: `Veuillez entrer l'ordre hiérarchique du grade en chiffre`
    });
  }

  if (
    req.body.categorie === "officier" &&
    (req.body.sous_categorie !== "off_gen" && req.body.sous_categorie !== "off_sup" && req.body.sous_categorie !== "off_sub")
  ) {
    errors.push({
      text:
        "La sous-catégorie sélectionnée n'appartient pas à la catégorie des officiers"
    });
  }

  if (
    req.body.categorie === "o_marinier" &&
    (req.body.sous_categorie !== "off_mar_sup" && req.body.sous_categorie !== "off_mar_sub")
  ) {
    errors.push({
      text:
        "La sous-catégorie sélectionnée n'appartient pas à la catégorie des sous-officiers"
    });
  }

  if (errors.length > 0) {
    res.render("ranks/add", {
      errors: errors,
      categorie: req.body.categorie,
      sous_categorie: req.body.sous_categorie,
      grade: req.body.grade,
      abreviation: req.body.abreviation,
      ordre: req.body.ordre
    });
  } else {
    const newRank = {
      grade: req.body.grade,
      abreviation: req.body.abreviation,
      categorie: req.body.categorie,
      sousCategorie: req.body.sous_categorie,
      ordre: req.body.ordre
    };

    new Rank(newRank)
      .save()
      .then(rank => {
        req.flash("success_msg", "Grade ajouté avec succès");
        res.redirect("/ranks/add");
      })
      .catch(err => {
        console.log(err);
      });
  }
});

// Formulaire de modification de grade
router.get("/edit/:id", (req, res) => {
  Rank.findOne({
    _id: req.params.id
  }).then(rank => {
    res.render("ranks/edit", {
      rank: rank
    });
  });
});

// Traitement du formulaire de modification
router.put("/edit/:id", (req, res) => {
  let errors = [];

  if (!req.body.categorie) {
    errors.push({
      text: "Veuillez sélectionner une catégorie"
    });
  }
  if (!req.body.sous_categorie && req.body.categorie !== "militaire_du_rang") {
    errors.push({
      text: "Veuillez sélectionner une sous-catégorie"
    });
  }
  if (!req.body.grade) {
    errors.push({
      text: "Veuillez saisir le grade"
    });
  }
  if (!req.body.ordre) {
    errors.push({
      text: `Veuillez entrer l'ordre hiérarchique du grade en chiffre`
    });
  }

  if (
    req.body.categorie === "officier" &&
    (req.body.sous_categorie !== "off_gen" && req.body.sous_categorie !== "off_sup" && req.body.sous_categorie !== "off_sub")
  ) {
    errors.push({
      text:
        "La sous-catégorie sélectionnée n'appartient pas à la catégorie des officiers"
    });
  }

  if (
    req.body.categorie === "o_marinier" &&
    (req.body.sous_categorie !== "off_mar_sup" && req.body.sous_categorie !== "off_mar_sub")
  ) {
    errors.push({
      text:
        "La sous-catégorie sélectionnée n'appartient pas à la catégorie des sous-officiers"
    });
  }

  if (errors.length > 0) {
    res.render("ranks/edit", {
      errors: errors,
      categorie: req.body.categorie,
      sous_categorie: req.body.sous_categorie,
      grade: req.body.grade,
      abreviation: req.body.abreviation,
      ordre: req.body.ordre
    });
  } else {
    Rank.findOne({
      _id: req.params.id
    }).then(rank => {
      rank.grade = req.body.grade;
      rank.abreviation = req.body.abreviation;
      rank.categorie = req.body.categorie;
      rank.sousCategorie = req.body.sous_categorie;
      rank.ordre = req.body.ordre;

      rank.save().then(rank => {
        req.flash("success_msg", "Grade modifié avec succès");
        res.redirect("/ranks");
      });
    });
  }
});

// Suppression d'un grade
router.delete("/delete/:id", (req, res) => {
  Rank.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Grade supprimé.");
    res.redirect("/ranks");
  });
});

module.exports = router;
