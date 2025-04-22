const { Router } = require("express");
const { createAccount, getAllAccounts, updateAccount, deleteAccount, getAccountByCode } = require("../controllers/accountController");
const { checkPermission } = require('../middlewares/authorization');
const router = Router()

router.post("/account",checkPermission("admin"),createAccount)
router.get("/accounts",getAllAccounts)
router.get("/account/:code",getAccountByCode)
router.patch("/account",checkPermission("admin"),updateAccount)
router.delete("/account",checkPermission("admin"),deleteAccount)

module.exports = router