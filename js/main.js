	
$('#myButt').on('click', function () {

		var picslist = $('#the-pics')
			picslist.empty();
		var query = $('#mySearch').val();
			if (query == '') {
				alert('please fuck off');
			}
		console.log(query);
		var url = 'https://api.spotify.com/v1/search';
	$.ajax({
	    url: url,
	    data: {
	        q: query,
	        type: 'album'
	    },
	    success: function (artist) {
	        console.log(artist.albums.items);
	        var albums = artist.albums.items;
	        albums.forEach(function(album) {
	        	$('#mySearch').val('');
	        	// console.log(album.name);
	        	albumurl = album.images[1].url;
	        	albumname = album.name;
	        	// console.log(album);
	        	// debugger
        	    var theCover = $('<img class="g-flip" src="' + albumurl + '"/>');         
                var $newDiv = $('<div class="indiv-album">')
                var itemContainer = $('<div class="containr">');
                var $newTitle = $('<h3>');
	                picslist.append($newDiv);
                	$newDiv.append(itemContainer);
                	TweenMax.set($newDiv, {opacity:0, scale:2});
	                $newTitle.html(albumname);
	                itemContainer.append(theCover);
	                itemContainer.data('albumlink', album.href);
	                $newDiv.append($newTitle)
	                TweenMax.staggerTo($('.indiv-album'), 1, { opacity:1, scale:1, rotationY:360, transformPerspective:1800, ease:Power3.easeIn}, .16);

                // get tracklist

                function getTracklist() {
              		console.log('get tracklist');
                	var tracklistUrl = itemContainer.data('albumlink');
                	console.log(tracklistUrl);
		            var tracklist = $('<ul class="mytracks">')

	                	$.get(tracklistUrl, function(trax){
		                var traxNames = trax.tracks.items;
		                console.log(trax.tracks.items[0].preview_url);
	                	var flipBtn = $('<button class="flippy">FLIP ME BACK</button>');
			                itemContainer.append(tracklist);
		                	itemContainer.append(flipBtn);

			                // get the track names for each album

				            traxNames.forEach(function (track) {
			                	var trackname = track.name;
			                	var listenUrl = track.preview_url;
			                	var $newLi = $('<li class="track-name">');
			                	$newLi.html(trackname);
			                	// $newLi.html('<a href="' + listenUrl + '">' + trackname + '</a>');
			                	TweenMax.set($newLi, {opacity:0});
			                	$newLi.css('cursor', 'pointer');
			                	tracklist.append($newLi);
			                	itemContainer.append(tracklist);
			                	TweenMax.staggerTo($('.track-name'), .5, {opacity:1, scale:1, ease:Power3.easeIn}, .076);
			                	$newDiv.addClass('tracksOpen');
			                	itemContainer.data('tracklink', listenUrl);
			                	console.log(listenUrl);
			                	// add functionality to preview the track
			                	$newLi.click(function(e) {
			                	 var playing = 'playing';
			                	 var target = e.target;
			                	 var audioObject = new Audio(listenUrl);
			                	 // check to see if the track is already playing
			                	
			                	     if (target.classList.contains(playing)) {
			                	         audioObject.pause();
			                	         console.log('already playing');
			                	     } else {
			                	         if (audioObject) {
			                	         	console.log('should play'); 
			                	             audioObject.play();
			                	             target.classList.add(playing);
			                	             audioObject.addEventListener('ended', function() {
			                	                 target.classList.remove(playing);
			                	             });
			                	             audioObject.addEventListener('pause', function() {
			                	                 target.classList.remove(playing);
			                	            });
			                	         }     
			                	     }
			                	});
			                })	

			                	// the button to flip the album cover back
			                	flipBtn.on('click', function(){
		                		console.log('flip button clicked');
		                		flipBtn.remove();
		                		$newDiv.removeClass('tracksOpen');
		                		tracklist.fadeOut(200, function(){
		                			console.log('tracklist removed');
		                			TweenMax.to(theCover, 2, {rotationY:0, transformPerspective:1800, ease:Power3.easeOut})
		                		})

		                	});
		                })// end of $.get trax
                	console.log('track list ran');
                } //end of getTracklist

                // turn the album cover over - check to see if it has been already turned over
                function turnAlbum (e) {
                	if ($newDiv.hasClass('tracksOpen')) {
                		console.log('this means its turned already');
		                tracklist.fadeOut(200, function(){
                			console.log('tracklist removed');
                			TweenMax.to(theCover, 2, {rotationY:0, transformPerspective:1800, ease:Power3.easeOut})
                		})
                		
                	} else {
                		console.log('this means it is not turned over');
	                	var tl = new TimelineMax({onComplete:getTracklist})
	                		tl.to(this, 1.5 , { opacity:1, scale:1, rotationY:180, transformPerspective:1800, ease:Power4.easeOut});
                	};

                } // end of turnAlbum
  
                theCover.click(turnAlbum);

	        })
	    } //end success from main json
	}) //end ajax command
});



