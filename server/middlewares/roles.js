function isAdmin(req, res, next) {
  const user = req.user;
  if (!user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

function isManager(req, res, next) {
  const user = req.user;
  console.log("value of user is: ", req.user);
  if (!user.isManager) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

module.exports = { isAdmin, isManager };
