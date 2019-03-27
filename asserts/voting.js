// Ajax Voting Script - http://coursesweb.net
var ivotings = [];      // store the items with voting
var ar_elm = [];       // store the items that will be send to votAjax()
var i_elm = 0;          // Index for elements aded in ar_elm
var itemvotin = '';       // store the voting of voted item
var votingfiles = ajax_var.PLUGIN_PATH+'/';      // directory with files for script
var advote = 0;      // variable checked in addVote(), if is 0 cann vote, else, not

// gets all DIVs, store in $ivotings, and in $ar_elm DIVs with class: "vot_plus", "vot_updown", and ID="vt_..", sends to votAjax()
var getVotsElm = function () {
  var obj_div = document.getElementsByTagName('div');
  var nrobj_div = obj_div.length;
  for(var i=0; i<nrobj_div; i++) {
    // if contains class and id
    if(obj_div[i].className && obj_div[i].id) {
      var elm_id = obj_div[i].id;	  
      // if class "vot_plus", "vot_updown1", "vot_updown2", or "vot_poll" and id begins with "vt_"
      if(obj_div[i].className=='vot_updown1' && elm_id.indexOf("vt_")==0) {
        ivotings[elm_id] = obj_div[i];       // store object item in $ivotings

        ar_elm[i_elm] = elm_id;     // add item_ID in $ar_elm array, to be send in json string tp php
		// ar_elm[i_elm+'-url'] = elm_url;     // add item_ID in $ar_elm array, to be send in json string tp php
        i_elm++;             // index order in $ar_elm
      }
    }
  }
  // if there are elements in "ar_elm", send them to votAjax()
  if(ar_elm.length>0) votAjax(ar_elm, '');      // if items in $ar_elm pass them to votAjax()
};

// add the ratting data to element in page
function addVotData(elm_id, vote, nvotes, renot) {
  // exists elm_id stored in ivotings
  if(ivotings[elm_id]) {
	// sets to add "onclick" for vote up (plus), if renot is 0
	var clik_up = (renot == 0) ? ' onclick="addVote(this, 1)"' : ' onclick="alert(\'You already voted\')"';

	ivotings[elm_id].innerHTML = '<div class="people-like"><a href="#"  '+ clik_up+ '><img src="'+votingfiles+'/asserts/thumb-up.png" alt="vote up"/> <strong>'+ vote+'</strong> <span>People found this page helpful.</span></a></div>';
    
    
  }
}

// Sends data to votAjax(), that will be send to PHP to register the vote
function addVote(ivot, vote) {
  // if $advote is 0, can vote, else, alert message
  if(advote == 0) {
    var elm = [];
    elm[0] = ivot.parentNode.parentNode.id;       // gets the item-name that will be voted

    ivot.parentNode.innerHTML = '<i><b>Thanks</b></i>';
    votAjax(elm, vote);
  }
  else alert('You already voted');
}

/*** Ajax ***/

// sends data to PHP and receives the response
function votAjax(elm, vote) {
  var reqob =  window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');    // get XMLHttpRequest object

  // define data to be send via POST to PHP (Array with name=value pairs)
  var datasend = [];
  for(var i=0; i<elm.length; i++) datasend[i] = 'elm[]='+elm[i];
  // joins the array items into a string, separated by '&'
  datasend = datasend.join('&')+'&vote='+vote;

  reqob.open('POST', votingfiles+'voting.php', true);      // crate the request

  reqob.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');    // header for POST
  reqob.send(datasend);    //  make the ajax request, poassing the data

  // checks and receives the response
  reqob.onreadystatechange = function() {
    if(reqob.readyState == 4){
// alert(reqob.responseText);  //for Debug
      // receives a JSON with one or more item:[vote, nvotes, renot]
      var jsonitems = JSON.parse(reqob.responseText);

      // if jsonitems is defined variable
      if(jsonitems) {
        // parse the jsonitems object
        for(var votitem in jsonitems) {
          var renot = jsonitems[votitem][2];    // determine if the user can vote or not

          // if renot=3 displays alert that already voted, else, continue with the voting reactualization
           if(renot == 3) {
            alert('You already voted. Thank you!');
          }
          else addVotData(votitem, jsonitems[votitem][0], jsonitems[votitem][1], renot);  // calls function that shows voting
        }
      }

      // if renot is undefined or 2 (set to 1 NRVOT in voting.php), after vote, set $advote to 1
      if(vote != '' && (renot == undefined || renot == 2)) advote = 1;
    }
  }
}

// this function is used to access the function we need after loading page
function addLoadVote(func) {
  var oldonload = window.onload; 

  // if the parameter is a function, calls it with 'onload'
  // otherwise, adds the parameter into a function, and then call it
  if (typeof window.onload != 'function') window.onload = func;
  else { 
    window.onload = function() { 
      if (oldonload) { oldonload(); } 
      func();
    } 
  } 
}

addLoadVote(getVotsElm);           // calls getVotsElm() after page loads