'use strict';
var express = require('express');
const rp = require('request-promise');
const cheerio = require('cheerio');

var router = express.Router();

const FOOD = ['pizza', 'brunch', 'soda', 'donut', 'snacks'];
const NETWORKING = ['career', 'chat', 'talk'];
const CLUB = ['convergent', 'abcs', 'wics', 'mad', 'isss', 'acm'];
const SEMINAR = ['speaker', 'audience', 'abstract'];

const options = {
  uri: "https://www.cs.utexas.edu/events",
  transform: function (body) {
    return cheerio.load(body);
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  getEvents(options).then((result) => {
    let resultsObject = {results: result};
    res.render('index', resultsObject );
  });
});

module.exports = router;

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

        //will eventually create an array of promises
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

            //this code checks the description for certain keywords, and decides whether
            //to assign specific tags to them depending on their presence
            currentObject.tags = getTags(currentDescription, currentObject.title);

            if (currentDescription.length > 300) {
              currentDescription = currentDescription.substring(0, 300) + "...";
            }

            currentObject.description = currentDescription;
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

        //injection of 3rd floor events for demonstration happens here.
        //relevant properties are title, description, date, room
        //NOTE: Edit indices as necessary to make these fake events appear in order
        //Also, feel free to edit dates and what not as well
        let demoObject1 = {
          title: "FRI Final Project Demo 1",
          description: "A room to navigate to. How convenient!",
          date: "Monday, May 7, 2018. Start time: 12:00 PM",
          room: "GDC 3.512",
          tags: 'seminar',
        };

        let demoObject2 = {
          title: "FRI Final Project Demo 2",
          description: "Lorem Ipsum, Lorem Ipsum, some really cool event about robots and FRI",
          date: "Tuesday, May 8, 2018. Start time: 2:00 PM",
          room: "GDC 3.414",
          tags: 'food club',
        };

        let demoObject3 = {
          title: "FRI Final Project Demo 3",
          description: "Demonstration of the best FRI spring semester project",
          date: "Thursday, May 10, 2018. Start time: 2:00 PM",
          room: "GDC 3.420",
          tags: 'networking seminar'
        };

        result.splice(5, 0, demoObject1);
        result.splice(11, 0, demoObject2);
        result.splice(17, 0, demoObject3);

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

//extracts tags from the description
function getTags(description, title) {
  let tags = '';

  let combinedLine = (description + title).toLowerCase();

  for (let i = 0; i < FOOD.length; i++) {
    if (combinedLine.indexOf(FOOD[i]) != -1) {
      tags += "food ";
      i = FOOD.length;
    }
  }

  for (let i = 0; i < NETWORKING.length; i++) {
    if (combinedLine.indexOf(NETWORKING[i]) != -1) {
      tags += "networking ";
      i = NETWORKING.length;
    }
  }

  for (let i = 0; i < CLUB.length; i++) {
    if (combinedLine.indexOf(CLUB[i]) != -1) {
      tags += "club ";
      i = CLUB.length;
    }
  }

  for (let i = 0; i < SEMINAR.length; i++) {
    if (combinedLine.indexOf(SEMINAR[i]) != -1) {
      tags += "seminar ";
      i = SEMINAR.length;
    }
  }

  return tags;
}
