const { query } = require('express');

const express = require('express');
const app = express();
const {MongoClient}=require('mongodb')
mongo=require('mongodb')
// students=require('mongodb')
const uri='mongodb://localhost:27017/StudentAttendanceInfo4'
app.use(express.urlencoded({ limit: 1024, extended: true }))
app.use(express.json({ limit: 1024 }))

const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(err => {
    db = client.db("StudentAttendanceInfo4").collection("students");    
    console.log('db connected successfully')   
    
})

client.connect(err => {
    dbo = client.db("StudentAttendanceInfo4").collection("studentsattendance");    
    console.log('connected..')
    
    
})

 app.get('/', (req, res) => {    
    res.render('template.ejs');
});

app.get('/', (req, res) => {
    const cursor = db.find();
    
});

app.post('/show', (req, res) => {
    db.insertOne(req.body,(err,result)=>{
        if (err) return console.log("Error")
    console.log("Successfully saved on database")    
    res.redirect('/show')
    db.find().toArray((err, results) => {
        console.log(results);
        });
    })
});

// displaying students  
    app.get('/show',(req,res)=>{  
  
    db.find().toArray((err,results)=>{     
        if (err) return console.log("Error: "+ err);      
            res.render('show.ejs', { students: results });        

    })
})

//Filtering 

//actual code//of post
app.post('/show-students', (req, res) => { 
    // page=1  
    
    const limitValue = parseInt(req.query.limit) || 5;        
    const skipValue = parseInt(req.query.skip) || 0;
    console.log(limitValue)
    console.log(skipValue)
	
    var stclass=parseInt(req.body.stclass);
    var section=req.body.section;
    console.log(stclass)
    console.log(section)
    db.find().toArray(function(err,results){
                var count=results.length
                console.log(count)  
                pages=Math.floor(count/limitValue)
       db.find({stclass:stclass,section:section}).limit(limitValue).skip(skipValue).toArray((err,results)=>{
        
        if (err) return console.log("Error: "+ err);      
            res.render('paging.ejs', {
                 results:results ,
                 skipValue:skipValue,
                 limitValue:limitValue,
                 count:count,
                 pages:pages,page:page
                }); 
    })    

})
})

//displaying whole school
app.get('/showstudents',(req,res)=>{    
     page=1
    const limitValue = parseInt(req.query.limit) ||10   
    const skipValue = parseInt(req.query.skip)||0
    console.log(limitValue)
    console.log(skipValue)    
    db.find().toArray(function(err,results){
        var count=results.length
        console.log(count)  
        pages=Math.ceil(count/limitValue)
    
    db.find().limit(limitValue).skip(skipValue).toArray((err,results)=>{    
        if (err) return console.log("Error: "+ err);
        
            res.render('sample.ejs', { 
                results: results,
                page:page,
                pages:pages,
                skipValue:skipValue,
                limitValue:limitValue,
                count:count
            });        

    })
})
})


//attendance
app.post('/showattendance', (req, res) => {    
    var stclass=parseInt(req.body.stclass);
    var section=req.body.section;
  
    var attendanceperc=0   
    
    console.log(stclass)
    console.log(section)
       db.find({stclass:stclass,section:section}).toArray((err,results)=>{
        let totalstudents=results.length
     dbo.find({stclass:stclass,section:section}).toArray((err,students)=>{
        workingDays=students.length
        console.log(workingDays)
    
     students.forEach(absentees=>{
         absenteesCount=absentees.absent.length
        var present=totalstudents-absenteesCount
    //     var attendanceperc=((present/totalstudents)*100).toFixed(2)
    //    totalAttendancePercentage = parseInt(totalAttendancePercentage)+parseInt(attendanceperc)
        

        }) 
    //  var totalPercentage=(totalAttendancePercentage/workingDays)
    //  console.log(totalPercentage)
     res.render("attendance.ejs",{students:students,stclass,section,workingDays:workingDays})
   
    })
    })  
})



//edit
mongo=require('mongodb')
// var ObjectID = require('mongodb').ObjectID//EDIT
// // app.route('/edit/:id')
app.get('/edit/:id',(req,res) => {
    var id = req.params.id;
    db.find(mongo.ObjectId(id)).toArray((err, result) => {
        if (err) return console.log("Error: " + err);
     res.render('edit.ejs', { students: result });
    });
})
app.post('/edit/:id',(req,res)=>{
    var id=req.params.id;
    var username=req.body.username
    var name=req.body.name;
    var stclass=req.body.stclass;
    var section=req.body.section;
    db.updateOne({_id: new mongo.ObjectId(id)},{
        $set:{
            username:username,
            name:name,
            stclass:stclass,
            section: section,

        }
    },(err,result)=>{
        if (err) return res.send ('Error',err);
        res.redirect('/show');
        console.log("Successfully updated")
           
    })


})
//DELETE
// app.route('/delete/:id')

app.get('/delete/:id',(req,res) => {
    var id = req.params.id;
    db.deleteOne({_id: new mongo.ObjectId(id)}, (err, result) => {
     if (err) return res.send(500, err);
        console.log("Deleted  succesfully");
        res.redirect('/show');
    });
});

//pagination

// app.get('/show/:page', function(req, res, next) {
//     var perPage = 5
//     var page = req.params.page || 1
//     console.log(perPage)
//     console.log(page)


//     db.find({})
//     .skip((perPage * page) - perPage)
//     .limit(perPage)
//     .exec(function(err, students) {
//         db.count().exec(function(err, count) {
//          if (err) return next(err)
//            res.render('paging.ejs', {
//             students: students,
//             current: page,
//             pages: Math.ceil(count / perPage)
//         })
//     })
//     })
// })

//fetching the show Pagination



  


app.set('view engine', 'ejs');
app.listen(3000, function(){
    console.log("Server started at port 3000");
})
