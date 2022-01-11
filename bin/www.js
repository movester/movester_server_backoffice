const app = require('..');
require('dotenv').config();

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Dev Server listening on port ${port}!`));
