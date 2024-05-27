require('dotenv').config();
const connect = require('./db/conn');
const app = require('./app');

if (require.main === module) {
    // If this module is run directly (not imported), start the server
    const port = process.env.PORT || 3000;

    connect(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
}
