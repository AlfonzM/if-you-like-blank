$(document).ready(function(){
	var fetchArtistResults = function(callback){
		var query = $("#query").val();

		console.log("get artist list");
		$.ajax({
	        url: 'https://api.spotify.com/v1/search',
	        data: {
	            q: query,
	            type: 'artist'
	        },

	        success: function (searchResults) {
	        	callback(searchResults);
	        }
	    });
	}

	var searchArtist = function(){
		results = document.getElementById('results');
		results.innerHTML = "";

	    fetchArtistResults(function(response){
			for(i = 0 ; i < response.artists.items.length; i++){
       			results.innerHTML += response.artists.items[i].name + "<br>";
        	}
	    });

		$("#query").autocomplete("close");
	};

	$("#query").autocomplete({
		source: function(request, response){
					fetchArtistResults(function(data){
			        	var results = [];
			        	for(i = 0 ; i < data.artists.items.length; i++){
			       			results.push(data.artists.items[i].name);
			        	}
			        	response(results);
					});
				},
		select: function(){
			searchArtist();
		}
	});

	$("#search-artist").submit(function(e){
		e.preventDefault();
		searchArtist();
		return false;
	});

});