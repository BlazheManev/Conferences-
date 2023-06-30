const admin = require ("../config/firebaseConfig")

class Middleware {
  async decodeToken(req, res, next) {
    try {
      if (
        req.url === "/udelezenec/register" ||
        req.url === "/udelezenec/login" ||
        req.url === "/organizator/register" ||
        req.url === "/organizator/login" ||
        req.url === "/organizator/token" ||
        req.url === "/organizator/check" ||
        req.url.startsWith("/organizator/escape/")||
        req.url.startsWith("/udelezenec/escape/")

        // Check if URL starts with "/organizator/"
      ) {
        return next(); // Skip token decoding for these paths
      }
      const token = req.headers.authorization.split(" ")[1];
      //console.log(token)

      const decodeValue = await admin.auth().verifyIdToken(token);
      if (decodeValue) {
       // console.log(decodeValue);
        return next();
      }
      return res.json({ message: 'Unauthorized User' });
    } catch (error) {
      console.error('Error decoding Firebase ID token:', error);
      return res.json({ message: error.message });
    }
  }
}

module.exports = new Middleware();
