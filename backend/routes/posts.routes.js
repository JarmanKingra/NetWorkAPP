const { Router } = require("express");
const { activeCheck } = require("../controllers/posts.controller");



const router = Router();

router.route("/").get(activeCheck);

module.exports = router;