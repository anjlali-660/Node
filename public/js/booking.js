booking = seatRequired;
var singleRowAvailable;
let selectedSeat = []

jQuery(function ($) {
debugger
        $(document).ready(function () {
            for (var key in rowWiseJson) {
                if (rowWiseJson[key].data[0].seats_available.length >= seatRequired) {
                  singleRowAvailable = true;
                   break;
                }else{
                      singleRowAvailable = false
                      selectSeatsFromNearBy(rowWiseJson, seatRequired)
                }
            }
        });

        let seats = [], html = '';
      //Creating dynamic div (i.e seats)
        for (var eachrow in rowWiseJson) {
            let availableSeats = rowWiseJson[eachrow].data[0].seats_available
        var bookedSeats = rowWiseJson[eachrow].data[0].seats_booked
        totalSeats = availableSeats.concat(bookedSeats)
        totalSeats = totalSeats.sort();

        html += `<div id='R${eachrow}' style="display:flex">`

        totalSeats.forEach(seat => {
                html += `<div class="col-xl-1" onclick='selectSeat(this)'  id='Row${eachrow} Seat ${seat}' for='Row${eachrow} Seat ${seat}' val>    ${seat} </div>` //Generate HTML 
            });
            html += `</div>`
    }

        //inserting html contain in mainDiv
    document.getElementById("mainDiv").innerHTML = html;
    
        for (var eachrow in rowWiseJson) {
        var bookedSeats = rowWiseJson[eachrow].data[0].seats_booked
        if (bookedSeats.length) {
            bookedSeats.forEach(item => {
                document.getElementById(`Row${eachrow} Seat ${item}`).style.background = '#FFD700'

            })
        }
    }
   
})

function selectSeat(selectedElement) {

    if (!singleRowAvailable) {
        selectSeatsFromNearBy(rowWiseJson, seatRequired)
        console.log('hello')
    } else {
        seatRequired = findSeatsInSingleRow(selectedElement, rowWiseJson, seatRequired)
    }
    // myvar.style.background="rgb(157, 193, 131)"
}





function submitForm() {
    const selectedSeats = Array.from(document.querySelectorAll(".col-xl-1[style='background: rgb(157, 193, 131);']"))
        .map(seat => seat.val);
    const row = document.querySelector(".col-xl-1[style='background: rgb(157, 193, 131);']").id.split(' ')[0].slice(-1)

    const form = document.createElement("form");
    form.setAttribute("id", "reservationForm");
    form.action = "/seatBooking"; // Specify the form submission URL
    form.method = "POST"; // Set the form method as POST

    for (const seat of selectedSeats) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "selectedSeats[]";
        input.value = seat;
        form.appendChild(input);

        const rowInput = document.createElement("input");
        rowInput.type = "hidden";
        rowInput.name = "row";
        rowInput.value = row;
        form.appendChild(rowInput);

        const coachNoInput = document.createElement("input");
        coachNoInput.type = "hidden";
        coachNoInput.name = "coachNo";
        coachNoInput.value = 1;
        form.appendChild(coachNoInput);;
    }

    document.body.appendChild(form);
    // Get the number of seats selected
    var seatsSelected = document.getElementById('no').innerHTML;

    swal("Seats Selected", "You have selected " + seatsSelected, "success")
        .then(() => {
            // Code to execute after the swal alert is closed
            form.submit();
        })
        .catch((error) => {
            // Handle any errors that occur during the swal operation
            console.error(error);
        });

    // Optionally, you can submit the form after showing the pop-up
    //this.submit();
    // form.submit();

}



function deSelect(rowNo, element, seatRequired) {

    const selectedSeats = Array.from(document.querySelectorAll(`#R${rowNo} .col-xl-1[style='background: rgb(157, 193, 131);']`))
        .map(seat => {
            seat.style.background = '#f2f2f2';
            seatRequired++;
        }
        );
    document.getElementById('no').innerHTML = null;
    return seatRequired;


}

function findSeatsInSingleRow(myvar, rowWiseJson, seatRequired) {
    var disSelect;
    singleRowAvailable = false;
    for (var key in rowWiseJson) {
        if (rowWiseJson[key].data[0].seats_available.length >= seatRequired) {
            singleRowAvailable = true;
            break;
        }
    }
    if (singleRowAvailable) {
        if (document.getElementById(myvar.attributes.for.value).style.background == '#FFD700') {
            alert(`Already bookded`)
        } else {


            //   seatNo= myvar.attributes.for.value.split('#')[0]
            RowNo = (myvar.attributes.for.value).split('Row')[1].split(' ')[0]
            seatAvailableInSelectedRow = rowWiseJson[RowNo].data[0].seats_available

            if (document.getElementById(myvar.attributes.for.value).style.background == 'rgb(157, 193, 131)') {
                seatRequired = deSelect(RowNo, myvar.attributes.for.value, seatRequired)
                disSelect = 'true'
            } else {
                if (seatRequired && seatAvailableInSelectedRow.length >= seatRequired) {
                    seatAvailableInSelectedRow = seatAvailableInSelectedRow.slice(0, seatRequired)


                    seatAvailableInSelectedRow.forEach(item => {
                        document.getElementById(`Row${RowNo} Seat ${item}`).style.background = "#9DC183"
                        document.getElementById(`Row${RowNo} Seat ${item}`).val = item
                        selectedSeat.push(`Row${RowNo} Seat ${item}`)
                        seatRequired = parseInt(seatRequired) - 1;

                    })

                    //   if (selectedSeat.includes(myvar.attributes.for.value)) {
                    //     message = 'Already booked'
                    // } else {
                    //     selectedSeat.push(myvar.attributes.for.value)
                    //     message = 'selected';
                    // }
                    // document.getElementById("message").innerHTML = message;
                    finalNo = selectedSeat.join(',')
                    document.getElementById('no').innerHTML = finalNo;
                    selectedSeat = []
                } else if (!seatRequired) {
                    alert(`${booking} Seats already Booked`)
                } else {
                    alert(`${RowNo}th row doest not have ${booking} seats`)
                }
                disSelect = 'false'
            }
        }

    }

    return seatRequired
}


function selectSeatsFromNearBy(rowWiseJson, seatRequired) {

    console.log(rowWiseJson);
    let arr = []
    var obj = {
        maxLength: rowWiseJson[1].data[0].seats_available.length,
        row: 1,
        seats_available: rowWiseJson[1].data[0].seats_available
    }
    maxLength = rowWiseJson[1].data[0].seats_available.length
    for (var key in rowWiseJson) {
        length = rowWiseJson[key].data[0].seats_available.length
        if (length >= maxLength) {

            obj.maxLength = length
            obj.row = key
            obj.seats_available = rowWiseJson[key].data[0].seats_available
            arr.push(obj)
            obj = {}
        }
    }
    console.log(obj) //its incomplete ....

}