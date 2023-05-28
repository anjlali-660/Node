// Imported required modules
const express = require('express');
// const bodyParser = require('body-parser');
const sequelize = require('./util/database')
const session = require('express-session');            // Created  an Express application
const flash = require('express-flash');
const seatBooking = require('./controllers/seat_reservation')
const path = require('path')

const app = express();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Set the view engine to EJS
app.set('view engine', 'ejs');

//synchronizes the defined Sequelize models with the database.
sequelize.sync().then(result => {
    console.log(result)
}).catch(err => {
    console.log(err)
})

//Routes

app.get('/', seatBooking.getInputSeatWindow)
// Define routes
app.post('/reserve',seatBooking.getSeatDetails);

app.post('/seatBooking',seatBooking.confirmBooking)



const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});



