$('#myButt').on('click', function() {
    var picslist = $('#the-pics')
    picslist.empty();
    var query = $('#mySearch').val();

    if (query == '') alert('please fuck off');

    console.log(query);

    var url = 'https://api.spotify.com/v1/search';

    $.ajax({
            url: url,
            data: {
                q: query,
                type: 'album'
            },
            success: function(artist) {
                    // console.log(artist.albums.items);
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
                        $newDiv.data('albumlink', album.href);

                        $newDiv.append(itemContainer);
                        TweenMax.set($newDiv, {
                            opacity: 0,
                            scale: 2
                        });
                        $newTitle.html(albumname);
                        itemContainer.append(theCover);
                        itemContainer.data('albumlink', album.href);
                        $newDiv.append($newTitle)
                        TweenMax.staggerTo($('.indiv-album'), 1, {
                            opacity: 1,
                            scale: 1,
                            rotationY: 360,
                            transformPerspective: 1800,
                            ease: Power3.easeIn
                        }, .16);
					    theCover.on('click', function(e) {
					    	console.log('did it click');
					        var $album = $(this);
					        // closeAllAlbums()
					        turnAlbum($album);
					    })
                    });
                    
                } //end success from main json
        }) //end ajax command

 
    // get tracklist
    function getTracklist($album) {
        console.log('get tracklist');
        $album = $album.parent().parent();
        console.log($album);
        $album.addClass('tracksOpen');
        var tracklistUrl = $album.data('albumlink');
        console.log(tracklistUrl);
        var $itemContainer = $album.find('.containr')

        // console.log('TRACKLISTURL $$$$$$ ', tracklistUrl);

        // console.log(tracklistUrl);
        var tracklist = $('<ul class="mytracks">')

        $.get(tracklistUrl, function(trax) {
                var traxNames = trax.tracks.items;
                // console.log(trax.tracks.items[0].preview_url);
                var flipBtn = $('<button class="flippy">FLIP ME BACK</button>');
                $itemContainer.append(tracklist);
                $itemContainer.append(flipBtn);

                // get the track names for each album

                traxNames.forEach(function(track) {
                    var trackname = track.name;
                    var listenUrl = track.preview_url;
                    // console.log(listenUrl);
                    var $newLi = $('<li class="track-name">');
                    $newLi.html(trackname);
                    // $newLi.html('<a href="' + listenUrl + '">' + trackname + '</a>');
                    TweenMax.set($newLi, {
                        opacity: 0
                    });
                    $newLi.css('cursor', 'pointer');
                    tracklist.append($newLi);
                    $itemContainer.append(tracklist);
                    TweenMax.staggerTo($('.track-name'), .5, {
                        opacity: 1,
                        scale: 1,
                        ease: Power3.easeIn
                    }, .076);
                    $itemContainer.data('tracklink', listenUrl);
                    // console.log(listenUrl);
                    // add functionality to preview the track
                    // $newLi.click(function(e) {
                    //  var playing = 'playing';
                    //  var target = e.target;
                    //  var myAudio = new Audio(listenUrl);
                    //  // check to see if the track is already playing

                    //     if (myAudio.paused && myAudio.currentTime > 0 && !myAudio.ended) {
                    //         console.log('audio play');
                    //               myAudio.pause();
                    //     } else {
                    //         console.log('audio pause');
                    //               myAudio.play();
                    //     }
                    // });
                })

                // the button to flip the album cover back
                flipBtn.on('click', flipButton);

                function flipButton() {
                    var $albumImg = $album.find('.g-flip');
                    console.log('flip button function clicked');
                    flipBtn.remove();
                    $album.removeClass('tracksOpen');
                    tracklist.fadeOut(200, function() {
                        console.log('tracklist removed');
                        TweenMax.to($albumImg, 2, {
                            rotationY: 0,
                            transformPerspective: 1800,
                            ease: Power3.easeOut
                        })
                    })
                };
            }) // end of $.get trax
            // console.log('track list ran');
    } //end of getTracklist

    function turnAlbum($album) {
        console.log("turn album");
        // console.log($album.parent().parent());
        var topAlbum = $album.parent().parent()
        var stuff = $('.mytracks , .flippy');
        stuff.remove();
        var nx = topAlbum.siblings().find('.g-flip');
        // console.log(nx);
        TweenMax.to(nx, 1, {
                rotationY: 0,
                ease: Power3.ease0ut
            });
            // console.log($albumImg);
            // var tl = new TimelineMax()
        var tl = new TimelineMax({
                onComplete: function() {
                    getTracklist($album)
                }
            });
        tl.to($album, 1.5, {
            opacity: 1,
            scale: 1,
            rotationY: 180,
            transformPerspective: 1800,
            ease: Power4.easeOut
        });
        // myAlbum.each(function(){           
        // if ($(this).hasClass('tracksOpen')) {
        //     console.log($(this));
        //     var $albumImg = $(this).find('.g-flip');
        //     flipButton();
        // } else {
        // var $albumImg = $album.find('.g-flip');
        // // console.log($albumImg);
        // }
        // });
    } // end of turnAlbum

    // theCover.click(turnAlbum);
});