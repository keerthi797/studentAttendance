var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/StudentAttendanceInfo4";

MongoClient.connect(url, (err, db) => {
  if (err) throw err;
  console.log('Connected')
  var dbo = db.db("StudentAttendanceInfo4");
  dbo.collection("students").find().toArray(async (err, results) => {
    console.log(results)

    //setting month

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var d = new Date();
    var monthName = months[d.getMonth() - 1];
    console.log(`${monthName} month attendance record`)

    var sat = new Array();
    var sun = new Array();
    var wholedays = daysInMonth(d.getMonth(), d.getFullYear());
    console.log(`${wholedays} days in the month of ${monthName}`)//Get total days in a month

    for (var i = 1; i <= wholedays; i++) {
      var newDate = new Date(d.getFullYear(), d.getMonth() - 1, i)
      if (newDate.getDay() == 0) {
        sat.push(i);

      }
      if (newDate.getDay() == 6) {
        sun.push(i);
      }
    }
    const holiday = sat.concat(sun)
    console.log(`Holidays in the month of ${monthName}: `, holiday)
    // console.log('Saturday :',sat);
    // console.log('Sunday :',sun);


    function daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    }
    // daysInMonth(7,2021)


    totalWorkingDays = wholedays - (sat.length + sun.length)
    console.log(`Total working days : ${totalWorkingDays}`)
    totalStudentCount = results.length
    console.log(`Total Students : ${totalStudentCount}`)


    // var studentAbsence={}

    function randomNumber(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }

    var studentAbsent = {}
    var studAbsence = {}
    var count = 0
    var month = 7
    var year = 2021
    holidays = holiday
    var noOfDays = daysInMonth(month, year)


    var stclass = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    var section = ['A', 'B', 'C']
    for (let i = 0; i < stclass.length; i++) {
      for (let j = 0; j < section.length; j++) {
        var newList = results.filter((stud) => {
          return (stclass[i] == stud.stclass && section[j] == stud.section)


        });


        if (newList.length > 0) {

          for (let i = 1; i <= noOfDays; i++) {

            if (holidays.indexOf(i) !== -1) {
              continue;

            } else {
              studentAbsent.date = ""
              studentAbsent.absent = []
              studentAbsent.stclass = ""
              studentAbsent.section = ""
              count += 1


              var noOfAbsentees = randomNumber(1, 5)
              console.log(noOfAbsentees)
              for (let i = 0; i < noOfAbsentees; i++) {
                absenteesIndex = randomNumber(0, newList.length)
                studentAbsent.absent.push(newList[absenteesIndex].username)
              }

              studentAbsent.date = (`0${month}/${i}/${year}`)
              studentAbsent.stclass = newList[absenteesIndex].stclass

              studentAbsent.section = newList[absenteesIndex].section

              studAbsence = { ...studentAbsent }
              console.log(studAbsence)

              try {
                const dbase = await dbo.collection('studentsattendance').insertOne(studentAbsent)
                studentAbsent = {}

              } catch (err) {
                console.log('Error')
              }
            }



          }

        }

      }

    }
  })
})

      
    
  
    
    
     
    
  
  
  
  
  