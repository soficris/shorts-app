const express = require("express");
const router = express.Router();
const searchController = require("./searchController");

router.get("/search", searchController.renderSearchPage);

module.exports = router;