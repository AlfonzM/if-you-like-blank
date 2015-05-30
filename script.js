$(document).ready(function(){
	var audioObject;
	var previewSongNum;
	var relatedArtists;
	var currentTracks;
	var currentRelatedArtist;

	var fetchArtistSearchResults = function(callback){
		var query = $("#query").val();

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

	var selectArtist = function(artistId){
		previewSongNum = 0;

		// get the artist
		$.ajax({
	        url: 'https://api.spotify.com/v1/artists/' + artistId,

	        success: function (artist) {
	        	if("images" in artist && artist.images[0] != undefined){
	        		$("#artist-photo").attr("src", artist.images[0].url);
	        	}
	        	else{
	        		$("#artist-photo").attr("src", "");
	        	}
	        }
	    });

		// get this artist's top tracks and play it
		$.ajax({
	        url: 'https://api.spotify.com/v1/artists/' + artistId + "/top-tracks",
	        data: {
	        	country: 'PH'
	        },

	        success: function (toptracks) {
	        	currentTracks = toptracks.tracks;
	        	playSong();
	        }
	    });
	}

	var selectRelatedArtist = function(){
		var artist = relatedArtists[currentRelatedArtist];
    	selectArtist(artist.id);
    	console.log("current playing: " + artist.id);
    	$("#artist-name").html(artist.name);
	}

	var playSong = function(){
    	if(audioObject){
    		audioObject.pause();
    	}
    	audioObject = new Audio(currentTracks[previewSongNum].preview_url);
        audioObject.play();

        $("#now-playing").html("Now playing: " + currentTracks[previewSongNum].name);
	}

	$("#play-another-song").click(function(){
    	audioObject.pause();

		previewSongNum++;
		playSong();
	});

	$("#select-another-artist").click(function(){
		currentRelatedArtist++;
		selectRelatedArtist();
	});

	$("#query").autocomplete({
		source: function(request, response){
					fetchArtistSearchResults(function(data){
			        	var results = [];
			        	for(i = 0 ; i < data.artists.items.length; i++){
			       			results.push({artistId: data.artists.items[i].id, value: data.artists.items[i].name});
			        	}
			        	response(results);
					});
				},
		select: function(event, ui){
	        $("#selected-artist-name").html("Artsits similar to " + ui.item.value + ":");
			console.log("Selected: " + ui.item.artistId);

	        $.ajax({
		        url: 'https://api.spotify.com/v1/artists/' + ui.item.artistId + '/related-artists',

		        success: function (data) {
		        	relatedArtists = data.artists;
		        	currentRelatedArtist = 0;
		        	selectRelatedArtist();
		        }
		    });
			return false;
		}
	});
});