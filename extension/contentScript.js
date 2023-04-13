if (typeof init === "undefined") {
  function display_prediction(hoverdlinksdict, prediction) {
    var html = document.getElementsByTagName("style"); //acessing the css styling script of the web page we would be on
    if (prediction == "Malicious") {
      html[0].innerHTML =
        html[0].innerHTML + "a:hover {color: black; background-color: red;}"; //adding css for turning background of links (a) to yellow on hover
    } else if (prediction == "Benign") {
      html[0].innerHTML =
        html[0].innerHTML +
        "a:hover {color: black; background-color: green; opacity: .7;}"; //adding css for turning background of links (a) to yellow on hover
    } else {
      console.log("Not predicted");
    }
    virus_total_double_check(hoverdlinksdict);
  }
  function popup_display_VT_prediction(prediction) {
    chrome.runtime.sendMessage({ action: "createPopup" });
  }
  function virus_total_double_check(hoverdlinksdict) {
    popup_display_VT_prediction("safe");
    //alert("virus_total_double_check called");
    /*fetch("http://127.0.0.1:5000/virus_total_prediction_call", {
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
          alert("something is wrong");
        }
      })
      .then((jsonResponse) => {
        // Iterating through the response data with Map and then your logic rendering it
        jsonResponse.map((Main) => popup_display_VT_prediction(Main.link));
      })
      .catch((err) => console.error(err));*/
  }
  const init = function () {
    var links = document.links; //getting all links from web page we are on
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener(
        "mouseover", //adding listner on event of hover (mouse over) on all links
        (event) => {
          if (event.target.href) {
            //if the target of event has href (link) it is displayed on console
            currentlink = event.target.href;
            console.log(currentlink);
          } else {
            //else get parent's href (link) because mostly link avalible at parent and its shown at child
            currentlink = event.target.parentElement.href;
            console.log(currentlink);
          }
          if (currentlink === undefined) {
            // do nothing
          } else {
            //it is sent to server to python AI model for malicious link processing
            fetch("http://127.0.0.1:5000/predict_link", {
              //creating payload to send to server to python AI model for malicious or benign link processing
              method: "POST",
              headers: {
                "Content-type": "application/json",
                Accept: "application/json",
              },
              // Strigifying the payload (fetched link in dictionary format) into JSON and sending as main body of payload
              body: JSON.stringify(currentlink),
            })
              .then((res) => {
                if (res.ok) {
                  return res.json();
                } else {
                  //console.log("something is wrong");
                }
              })
              .then((jsonResponse) => {
                // Iterating through the response data with Map and then your logic rendering it
                display_prediction(currentlink, jsonResponse);
              })
              .catch((err) => console.error(err));
          }
        },
        false
      );
    }
  };
  init();
  const anti_tracking = function () {
    // Get the current URL on browser
    var currentURL = window.location.href;
    fetch("http://127.0.0.1:5000/anti_tracking", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      // Strigifying the payload (fetched link in dictionary format) into JSON and sending as main body of payload
      body: JSON.stringify(currentURL),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          //alert("something is wrong");
        }
      })
      .then((jsonResponse) => {
        console.log(jsonResponse);
        // new page html returened from server with removed tracker links
        //soup_object = BeautifulSoup(jsonResponse, "html.parser");
        // Replace the current page's HTML with the soup HTML
        //document.write(jsonResponse);
      })
      .catch((err) => console.error(err));
  };
  anti_tracking();
}

//REFRENCES
//https://www.youtube.com/watch?v=kybyYwu9Mpw
//https://developer.chrome.com/docs/extensions/mv3/getstarted/
//https://www.freecodecamp.org/news/building-chrome-extension/
//https://developer.mozilla.org/en-US/docs/Web/API/Response/json
//https://www.makeuseof.com/tag/python-javascript-communicate-json/
