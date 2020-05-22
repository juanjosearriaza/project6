const Sauce = require("../models/sauce");
const fs = require("fs");

exports.getSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

exports.createOneSauce = (req, res) => {
  req.body.sauce = JSON.parse(req.body.sauce);
  const url = req.protocol + "://" + req.get("host");
  const sauce = new Sauce({
    userId: req.body.sauce.userId,
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    mainPepper: req.body.sauce.mainPepper,
    imageUrl: url + "/images/" + req.file.filename,
    heat: req.body.sauce.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [""],
    usersDisliked: [""],
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Post saved successfully!" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.modifyOneSauce = (req, res) => {
  let sauce = new Sauce({ _id: req.params.id });
  if (req.file) {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + "://" + req.get("host");
    sauce = {
      _id: req.params.id,
      userId: req.body.sauce.userId,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      mainPepper: req.body.sauce.mainPepper,
      imageUrl: url + "/images/" + req.file.filename,
      heat: req.body.sauce.heat,
    };
  } else {
    sauce = {
      _id: req.params.id,
      userId: req.body.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      heat: req.body.heat,
    };
  }
  Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(() => {
      res.status(201).json({ message: "Sauce updated successfully¡" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.deleteOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink("images/" + filename, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: "Sauce deleted successfully¡" });
          })
          .catch((error) => {
            res.status(400).json({ error: error });
          });
      });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.likeSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    let message;

    if (req.body.like === 1) {
      if (sauce.usersLiked.includes(req.body.userId)) {
        res.status(400).json({ error: new Error("Invalid operation") });
      } else {   

        sauce.usersLiked.push(req.body.userId);
        sauce.likes = sauce.likes + 1;
        message = "Sauce liked!";
      }
    }
    if (req.body.like === 0) {
      if (sauce.usersLiked.includes(req.body.userId)) {
        sauce.usersLiked = sauce.usersLiked.filter(
          (e) => e !== req.body.userId
        );
        sauce.likes -= 1;
        message = "Like or dislike cancelled!";
      }
    }
    if (req.body.like === -1) {
      if (sauce.usersDisliked.includes(req.body.userId)) {
        res.status(400).json({ error: new Error("Invalid request!") });
      } else {
        sauce.usersDisliked = sauce.usersDisliked.filter(
          (e) => e !== req.body.userId
        );
        sauce.dislikes += 1;
        sauce.usersDisliked.push(req.body.userId);
        message = "Sauce disliked!";
      }
    }
    sauce
      .save()
      .then(() => {
        res.status(200).json({ message });
      })
      .catch((error) => {
        return res.status(400).json({ error: error.message });
      });
  });
};
