const { Router } = require("express");
const { checkPermission } = require("../middlewares/authorization");
const {
  getLoginInfoById,
  getAllAccounts,
} = require("../controllers/infoLoginAccController");
const router = Router();

router.get("/info-accounts", checkPermission("admin"), getAllAccounts);
router.get(
  "/info-account-by-id/:code",
  checkPermission("admin"),
  getLoginInfoById
);

module.exports = router;
