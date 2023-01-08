if (typeof init === "undefined") {
  //Function to display last 10 links and their safety predictions
  let last = " ",
    second_last = " ",
    third_last = " ",
    fourth_last = " ",
    fifth_last = " ",
    sixth_last = " ",
    seventh_last = " ",
    eighth_last = " ",
    nineth_last = " ",
    tenth_last = " "; //initliased and set once only on 1st time function calling
  function display_links(currentlink, prediction) {
    alert(prediction);

    table = document.getElementById("linktable");
    tr = table.getElementsByTagName("tr");
    td = tr[row].getElementsByTagName("td")[0];
    //td.innerHTML="----";
    console.log(td);
  }

  const init = function () {
    var html = document.getElementsByTagName("style"); //acessing the css styling script of the web page we would be on
    html[0].innerHTML =
      html[0].innerHTML + "a:hover {background-color: yellow;}"; //adding css for turning background of links (a) to yellow on hover
    var links = document.links; //getting all links from web page we are on
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener(
        "mouseover", //adding listner on event of hover (mouse over) on all links
        (event) => {
          var hoverdlinksdict = []; // create an empty array
          if (event.target.href) {
            //if the target of event has href (link) it is displayed on console
            currentlink = event.target.href;
            hoverdlinksdict.push({
              link: event.target.href,
            });
            //storing hoverd link in dictionary format for json formatting
            console.log(hoverdlinksdict[0]["link"]);
          } else {
            //else get parent's href (link) because mostly link avalible at parent and its shown at child
            hoverdlinksdict.push({
              link: event.target.parentElement.href,
            });
            //storing hoverd link in dictionary format for json formatting
            console.log(hoverdlinksdict[0]["link"]);
          }

          //it is sent to server to python AI model for malicious link processing
          // Get the receiver endpoint from Python server using fetch
          fetch("http://127.0.0.1:5000/receiver", {
            //creating payload to send to server to python AI model for malicious or benign link processing
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json",
            },
            // Strigifying the payload (fetched link in dictionary format) into JSON and sending as main body of payload
            body: JSON.stringify(hoverdlinksdict),
          })
            .then((res) => {
              if (res.ok) {
                return res.json();
              } else {
                //alert("something is wrong");
              }
            })
            .then((jsonResponse) => {
              // Iterating through the response data with Map and then your logic rendering it
              jsonResponse.map((Main) => display_links(currentlink, Main.link));
            })
            .catch((err) => console.error(err));
        },
        false
      );
    }
  };
  init();
}

//REFRENCES
//https://www.youtube.com/watch?v=kybyYwu9Mpw
//https://developer.chrome.com/docs/extensions/mv3/getstarted/
//https://www.freecodecamp.org/news/building-chrome-extension/
//https://developer.mozilla.org/en-US/docs/Web/API/Response/json
//https://www.makeuseof.com/tag/python-javascript-communicate-json/
