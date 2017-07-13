//Package requests
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var inquirer = require("inquirer");
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");

inquire();

//Initial user prompt
function inquire() {

	inquirer.prompt([{
			type: "list",
			message: "Please chose a command.",
			choices: ["My Tweets", "Spotify a Song", "Movie This", "Do What It Says"],
			name: "choice1"
		}, ])
		.then(function (response) {

			if (response.choice1 === "My Tweets") {
				inquirer.prompt([{
						type: "input",
						message: "Enter a Twitter Username: ",
						name: "userName"
					}, ])
					.then(function (response) {
						var info = response.userName.trim();
						if (info != "") {
							myTweets(info);
						} else {
							myTweets("comara17_o");
						}
					})
			} else if (response.choice1 === "Spotify a Song") {
				inquirer.prompt([{
						type: "input",
						message: "Enter a Song Title: ",
						name: "song"
					}, ])
					.then(function (response) {
						var info = response.song.trim();
						if (info != "") {
							spotifyThisSong(info);
						} else {
							var song = "track:'Resonance' artist:'Home'";
							spotifyThisSong(song);
						}
					})
			} else if (response.choice1 === "Movie This") {
				inquirer.prompt([{
						type: "input",
						message: "Enter a Movie Title: ",
						name: "movie"
					}, ])
					.then(function (response) {
						var info = response.movie.trim();
						if (info != "") {
							movieThis(info);
						} else {
							movieThis("")
						}
					})
			} else if (response.choice1 === "Do What It Says") {
				doWhatItSays();
			}


		});

};

function myTweets(name) {

	var client = new Twitter(keys.twitterKeys);
	var parameters = {
		screen_name: name
	};

	client.get('statuses/user_timeline', parameters, function (error, tweets, response) {

		console.log("");
		console.log("Twitter Search: " + name);
		console.log("");
		for (var i = 0; i < tweets.length && i < 20; i++) {
			var text = tweets[i].text;
			var created = tweets[i].created_at;
			console.log(created);
			console.log(text);
			console.log("-------------------");
		}

		inquire();

	});
}

function movieThis(movie) {
	console.log("");
	console.log("IMDB Search: " + movie);
	console.log("");

	var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.imdbKeys.key;
	request(queryUrl, function (error, response, body) {

		if (!error && response.statusCode === 200) {
			console.log("Title: " + JSON.parse(body).Title);
			console.log("Release Year: " + JSON.parse(body).Year);
			console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
			console.log("Country: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
		}
		console.log("-------------------");
		console.log("");

		inquire();

	});
}

function spotifyThisSong(song) {

	var spotify = new Spotify(keys.spotifyKeys);
	console.log("");
	console.log("Spotify Search: " + song);
	console.log("");

	spotify.search({
		type: 'track',
		query: song,
		limit: 5
	}, function (err, data) {

		var info = data.tracks.items;
		for (var i = 0; i < info.length; i++) {
			console.log("");
			console.log(info[i].name);
			console.log(info[i].artists[0].name);
			console.log(info[i].preview_url);
			console.log(info[i].album.name);
		}
		console.log("-------------------");
		console.log("");
		
		inquire();
		
	});
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function (error, data) {
		if (error) {
			return console.log(error);
		}
		var dataArr = data.split(",");
		var song = dataArr[1];
		spotifyThisSong(song);
		
		inquire();
		
	});
}