var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
db2 = new sqlite3.Database('nns2018.db');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '10.10.124.98',
  user     : 'jayz',
  password : 'NLPZJNWF',
  database : 'lgusurvey2017db'
});

exports.get = function(req, res){
	
	var eacode = req.params.id;
	var eacode2 = eacode.substring(0, 12);
	var hcn = req.params.id;
	var hcn2 = hcn.substring(12, 16);
	var shsn = req.params.id;
	var shsn2 = shsn.substring(16, 20);
	
db2.all("SELECT * FROM f16 WHERE eacode = ? and  hcn= ? and shsn= ?",[eacode2, hcn2, shsn2], function(err,rows){
	  rows.forEach(function (row) {
        });
    db2.all("SELECT * FROM questions WHERE qkey LIKE '%f16_%' ORDER BY qkey ASC", function(err,rows3){

		db2.all("SELECT * FROM answers WHERE qkey LIKE '%f16_%' ORDER BY qkey ASC", function(err,rows4){
			
			db2.all("SELECT * FROM survey_forms WHERE table_name='f16'", function(err,rows5){
			
				res.render('form16.ejs',{array:rows,array3:rows3,array4:rows4,array5:rows5,layout:false,session:req.session}); 
			
			});	
		}); 
	});
});
};

exports.post = function(req, res){
	var m = new Date();
	var dateString =
	m.getFullYear() + "-" +
	("0" + (m.getMonth()+1)).slice(-2) + "-" +
	("0" + m.getDate()).slice(-2) + " " +
	("0" + m.getHours()).slice(-2) + ":" +
	("0" + m.getMinutes()).slice(-2) + ":" +
	("0" + m.getSeconds()).slice(-2);
		
	var input = JSON.parse(JSON.stringify(req.body));
	var set ='';
	var arr = [];
	
	Object.keys(input).forEach(function(key) {
		if(key!== 'eacode' && key!== 'hcn' && key!== 'shsn' && key!== 'MEMBER_CODE' && key!== 'record_type' && key!== 'house_url' && key!== 'memkey')	{
		  set +=' '+ key+'=?,';
		}
	});
	
	Object.keys(input).forEach(function(key) {
		if(key!== 'eacode' && key!== 'hcn' && key!== 'shsn' && key!== 'MEMBER_CODE' && key!== 'record_type' && key!== 'house_url' && key!== 'memkey'){
		  arr.push(req.body[key]);
		}
	});
	arr.push(req.body.INTERVIEW_TIME, dateString, req.body.eacode, req.body.hcn, req.body.shsn);
	db2.all("UPDATE f16 SET "+set.replace(/,\s*$/, '')+", INTERVIEW_TIME =?,DATE_EDIT=? WHERE eacode = ? and hcn = ? and shsn = ?",arr,function(err,rows){
		if (err) {
              console.log("Error Updating : %s ",err );
		}
		
	})
	res.redirect("/legone/survey/surveyform/form11/"+req.body.eacode+req.body.hcn+req.body.shsn);
};

exports.time = function(req, res){

	db2.all("UPDATE f16 SET TIME_START='"+req.body.TIME_START+"', TIME_END='"+req.body.TIME_END+"' WHERE eacode = '"+req.body.eacode+"' and hcn = '"+req.body.hcn+"' and shsn = '"+req.body.shsn+"'",function(err,rows){
		if (err) {
              console.log("Error Updating : %s ",err );
		}
		
	});
	res.redirect("/legone/survey/surveyform/form11/"+req.body.eacode+req.body.hcn+req.body.shsn);
};

	
exports.view = function(req, res){
	var obj = {};
	
	
	var eacode = req.body.eacode;
	var hcn = req.body.hcn;
	var shsn = req.body.shsn;
	

	db2.all("SELECT * FROM f16 WHERE eacode = ? and  hcn= ? and shsn= ?",[eacode, hcn, shsn], function(err,rows2){
		  
		if (err) {
              console.log("Error Selecting : %s ",err );
		}
		
		  
	  rows2.forEach(function (row) {
			res.send(row);
        });
	
		});	
	
	
};

exports.skipping = function(req, res){
	var obj = {};
	  db2.all("SELECT * FROM skipping WHERE answer_qkey like '%f16%' ORDER BY answer_qkey ASC", function(err,rows){
		if (err) {
              console.log("Error Selecting : %s ",err );
		}
		
			res.send(rows);
	});	
};	





