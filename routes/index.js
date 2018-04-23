'use strict';
var express = require('express');
const rp = require('request-promise');
const cheerio = require('cheerio');

var router = express.Router();

const options = {
  uri: "https://www.cs.utexas.edu/events",
  transform: function (body) {
    return cheerio.load(body);
  }
}
var DETAILS = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  getEvents(options).then((result) => {
    let resultsObject = {results: result};
    res.render('index', resultsObject );
  });
});

module.exports = router;

//todo: alter script so that it scrapes dates from the first page? currently getting inaccurate
//dates from unupdated landing pages of events.

//main function
function getEvents(options) {

  //returns a promise because aynschronous programming is lovely
  return new Promise(function(resolve, reject) {
    rp(options).then(($) => {

      let urlTargets = [];
      //landing pages aren't updated and provide inaccurate information; this fixes that problem.
      let updatedDates = [];
      let promiseArray = [];

      //gets url links from the main page (each url links to an event page, which is further scraped)
      $(".views-field-title").each((index, elem) => {
        let rawText = $(elem).html();
        urlTargets[index] = elemExtractor(rawText);
      });

      $(".views-field-created").each((index, elem) => {
        let rawText = $(elem).html();
        updatedDates[index] = dateExtractor(rawText);
      });

      //given the urls, creates an array of options to use with request-promise
      let preparedOptions = prepareOptions(urlTargets);

      //goes through each of the url options and extracts relevant information in JSON format
      for (let i = 0; i < preparedOptions.length; i++) {

        //will eventually create an array of promise (do i need promises here? hmm)
        let tempPromise = new Promise(function(resolve, reject) {
          rp(preparedOptions[i]).then(($2) => {
            let currentObject = {};

            //get title
            $2("h1").each((index, elem) => {
              if (index === 1) {
                currentObject.title = $2(elem).text();
              }
            });

            //get description
            $2("p").each((index, elem) => {
              if (index === 0) {
                currentObject.description = $2(elem).text();
              }
              else {
                currentObject.description = currentObject.description + " " + $2(elem).text();
              }
            });

            //adjusts description to take out useless overhead
            let realDescriptionStart = currentObject.description.indexOf("\n", 2) + 6;

            //adjusts description length to avoid super long descriptions
            let currentDescription = currentObject.description.substring(realDescriptionStart);
            if (currentDescription.length > 300) {
              currentDescription = currentDescription.substring(0, 300) + "...";
            }

            currentObject.description = currentDescription;

            //doesnt work because landing page dates are not updated, must scrape from main page
            // //slightly redundant since currentObject.date provides start and end times LOL
            // currentObject.date = $2(".date-display-single").text();
            // currentObject.start = $2(".date-display-start").text();
            // currentObject.end = $2(".date-display-end").text();
            currentObject.date = updatedDates[i];

            //this code accounts for if the location is not found. If this is so,
            //then the event is nonstandard (for instance, online only), and should
            //be ignored.
            let locationFound = false;

            //maybe look into breaking this early? but minimum time wasted so idk
            //ALSO be lazy: assume that every single event occurs within the gdc
            $2(".even").each((index, elem) => {
              let currentText = $2(elem).text();
              if (currentText.indexOf("GDC") != -1) {
                currentObject.room = currentText;
                locationFound = true;
              }
            });

            //data about an event has been completed and stored in object, resolve
            if (locationFound) {
              resolve(currentObject);
            }
            else resolve(null);
          }).catch((error) => {
            reject(error);
          });
        });

        //add the promise to the promise array
        promiseArray[i] = tempPromise;
      }

      //once all events have been scraped and added to the array, resolve all promises and return the array of JSON stuffs
      Promise.all(promiseArray).then((result) => {
        //remove any nulls (events with no location)
        result = result.filter(function(item) {
          return item !== null; //return true if ok, false if should be removed
        });
        resolve(result);
      });

    }).catch((error) => {
      console.error(error);
      reject(error);
    });
  });
}

//gets the urls needed from each page
function elemExtractor(rawText) {
  let hrefStart = rawText.indexOf("https");
  let hrefEnd = rawText.indexOf('"', hrefStart);
  return rawText.substring(hrefStart, hrefEnd);
}

//gets correct dates from cs.utexas.edu/events landing page
function dateExtractor(rawText) {
  let start = rawText.indexOf('>');
  let middle = rawText.indexOf('-', start);
  let end = rawText.indexOf('</span>');

  //adjusts appearance of date string to Dayname, Month Day, Year. Start time: TIME
  let dateString = `${rawText.substring(start + 1, middle - 1)}. Start Time: ${rawText.substring(middle + 2, end)}`;
  return dateString;
}

//creates options for use in request-promise
function prepareOptions(urlTargets) {
  let optionArray = [];

  for (let i = 0; i < urlTargets.length; i++) {
    let options = {
      uri: urlTargets[i],
      transform: function (body) {
        return cheerio.load(body);
      }
    }

    optionArray[i] = options;
  }

  return optionArray;
}
