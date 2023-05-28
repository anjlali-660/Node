const Seat = require('../model/seats')

module.exports = {
   getInputSeatWindow: async(req, res) => {
    try {
        let successMessages = [], errorMessages = []
        res.render('inputSeat', { successMessages, errorMessages });    // seat input form render
    } catch (err) {
        console.log(err)
    }
    },
    getSeatDetails:async(req, res) => {
    try {
        var totalSeats = 0;
        var seatsRequired = req.body.seats
        // Retrieve all seats from the database
        const seatInfo = await Seat.findAll({
            where: {
                coach_no: 1
            },
            raw: true, // Retrieve raw data instead of Sequelize model instances
        });

        seatInfo.map(item => {
            totalSeats += item.seats_available.length

        })
        if (seatsRequired <= totalSeats) {
            rowWiseJson = mapArrJson(seatInfo, 'row_no');                     // Ticker Wise JSON Object 

            // Render the seats page with seat data
            res.render('index', {
                rowWiseJson: rowWiseJson,
                seatsRequired: seatsRequired
            });
        } else {
            req.flash('error', 'Seats are Not Available');
            res.render('inputSeat', { successMessages: [], errorMessages: req.flash('error') });


        }
    } catch (err) {
        console.error('Error retrieving seats:', err);
        res.status(500).send('Internal Server Error');
    }
    },
    
    
    confirmBooking:async(req, res) => {
    try {
        let seatsToBeBooked = req.body['selectedSeats[]'];
        seatsToBeBooked = typeof seatsToBeBooked == 'string' ? seatsToBeBooked.split('') : seatsToBeBooked

        seatsToBeBooked = seatsToBeBooked.map(item => {
            return parseInt(item)
        })
        let row_no = req.body.row[0]
        let coach_no = req.body.coachNo[0]
        let seats_info = await Seat.findAll({
            where: {
                coach_no: 1,
                row_no: row_no
            },
            attributes: ['seats_available', 'seats_booked'],
            raw: true, // Retrieve raw data instead of Sequelize model instances
        });
        seats_available = seats_info[0].seats_available.filter(seat => !seatsToBeBooked.includes(seat));
        seatsToBeBooked = seats_info[0].seats_booked.concat(seatsToBeBooked);


        await Seat.update(
            { seats_available: seats_available, seats_booked: seatsToBeBooked }, // New values for the fields
            { where: { coach_no: coach_no, row_no: row_no } } // Filter condition to find the specific seat record
        )
            .then(([affectedRows]) => {
                // The number of affected rows indicates the success of the update
                if (affectedRows > 0) {
                    console.log('Update successful');
                } else {
                    console.log('No matching records found');
                }
            })
            .catch(error => {
                // Handle any errors that occurred
                console.error(error);
            });

        res.redirect('/');


    } catch (err) {
        console.log(err)
    }
}

    
}

//Map Arr with common key pair value in results
function mapArrJson(arr, key) {
    var obj = {};
    if (arr.length != undefined) {
        for (var j = 0; j < arr.length; j++) {
            if (!obj.hasOwnProperty(arr[j][key])) {
                obj[arr[j][key]] = {
                    data: []
                }
            }
            obj[arr[j][key]].data.push(arr[j]);
        }
    }
    return obj;
}


