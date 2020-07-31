var zipper = require("zip-local");
zipper.sync.zip("./SHSSVIEW").compress().save("./SHSSVIEW.zip");