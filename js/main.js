// declare the audio variable here so you can stop the music from anywhere
var myAudio;
var msgBox = $('<div class="msg">');
// Everything happens in one main function, that function is instantiated upon the button click
function getMusic() {
    var trackPlaying = $('.nowplay')
    var picslist = $('#the-pics')
    var query = $('#mySearch').val();
    var url = 'https://api.spotify.com/v1/search';
    if (query == '') {
        msgBox.html('C’mon, you can think of something');
        $('#search').append(msgBox);
    } else {
        picslist.empty();
    }
    // This is the main API call, utilizing the value of the search input field as its query
    $.ajax({
            url: url,
            data: {
                q: query,
                type: 'album'
            },
            // for each artist we are going to dig down to extract the albums, titles, tracklist  and the cover images-using [1] which is the middle picture available at 300px wide. We create DOM elements for each and append them to a div on the page
            success: function(artist) {
                    var albums = artist.albums.items;
                    albums.forEach(function(album) {
                        $('#mySearch').val('');
                        albumurl = album.images[1].url;
                        albumname = album.name;
                        var theCover = $('<img class="g-flip" src="' + albumurl + '"/>');
                        var $newDiv = $('<div class="indiv-album">')
                        var itemContainer = $('<div class="containr">');
                        var $newTitle = $('<h3>');
                        picslist.append($newDiv);
                        $newDiv.data('albumlink', album.href);
                        $newDiv.append(itemContainer);
                        // This GSAP code sets the album divs to an opacity of 0, and a scale of 2x, so they come in from larger and fade in.
                        TweenMax.set($newDiv, {
                            opacity: 0,
                            scale: 2
                        });
                        $newTitle.html(albumname);
                        itemContainer.append(theCover);
                        itemContainer.data('albumlink', album.href);
                        $newDiv.append($newTitle)
                        $newTitle.data('albumtitle', album.name);
                        // This GSAP code takes the divs with album covers and titles in them, and rotates the divs into the page.
                        TweenMax.staggerTo($('.indiv-album'), 1, {
                            opacity: 1,
                            scale: 1,
                            rotationY: 360,
                            transformPerspective: 1800,
                            ease: Power3.easeIn
                        }, .16);
                        // This click function carries over the parameter $album and will spin the cover 180° through the turnAlbum() function - it only rotates the cover- theCover represents the img of the cover - this is important becuase the title and eventually the tracklist need to be at 0° to be read correctly.
                        theCover.on('click', function(e) {
                            console.log('did it click');
                            var $album = $(this);
                            // closeAllAlbums()
                            turnAlbum($album);
                        })
                    });

                } //end success from main json
        }) //end ajax command


    // This function takes the album which as this point is being passed as the img of the album cover- the tracklist data resides two levels in the div outside the img, so we need to set it to the outer div by using parent().parent(). Now we can access the tracklist.
    function turnAlbum($album) {
        console.log("turn album");
        var topAlbum = $album.parent().parent()
        var trackItems = $('.mytracks , .flippy');
        trackItems.fadeOut(0);
        //  find all the albums except the one you flipped
        var restOfAlbums = topAlbum.siblings().find('.g-flip');
        // set all the rest of the albums to 0° before turning so that only one album is turned at a time
        TweenMax.to(restOfAlbums, 1, {
            rotationY: 0,
            ease: Power3.ease0ut
        });
        //  This GSAP creates a timeline that will turn the album 180° and sets a function to load the tracklist to be run at the completion of the tween.
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
    } // end of turnAlbum

    // This function loads the tracklist after an album is turned.
    function getTracklist($album) {
        // reaassign the $album variable to the top level div which contains the tracklist API url.
        $album = $album.parent().parent();
        $album.addClass('tracksOpen');
        var tracklistUrl = $album.data('albumlink');
        var albumTitle = $album.find('h3');
        var $itemContainer = $album.find('.containr')
        var tracklist = $('<ul class="mytracks">')

        // Here we call the tracklist API, add a "FLIP" button to the tracklist in case the user just wants to close that album without interacting with any others.
        $.get(tracklistUrl, function(trax) {
                var traxNames = trax.tracks.items;
                var flipBtn = $('<button class="flippy">FLIP ME BACK</button>');
                $itemContainer.append(tracklist);
                $itemContainer.append(flipBtn);

                // get the track names and preview urls for each album.
                traxNames.forEach(function(track) {
                    var trackname = track.name;
                    var listenUrl = track.preview_url;
                    var artistName = track.artists[0].name;
                    var $newLi = $('<li class="track-name">');
                    $newLi.data('nextlink', track.preview_url)
                    $newLi.html(trackname);
                    var $nextLi = $newLi.next();
                    // set the track names opacity to 0, so they can fade in.
                    TweenMax.set($newLi, {
                        opacity: 0
                    });
                    $newLi.css('cursor', 'pointer');
                    tracklist.append($newLi);
                    $itemContainer.append(tracklist);
                    // This GSAP fades in the tracknames right after one another.
                    TweenMax.staggerTo($('.track-name'), .15, {
                        opacity: 1,
                        scale: 1,
                        ease: Power3.easeIn
                    }, .076);
                    $itemContainer.data('tracklink', listenUrl);


                    //  Create a click event for each track name to play/pause it.
                    $newLi.on('click', function(e) {
                        // create a class to add to atrack when played to identify it later to be turned off.
                        var playingTrack = 'playing';
                        var nextTrack = $(this).next();
                        var lastTrack = $(this).last();
                        var $newTitle = albumTitle.data('albumtitle')
                        var target = e.target;
                        var nextUrl = $newLi.next().data('nextlink');
                        trackPlaying.html('<marquee behavior="scroll" scrolldelay="60" width="100%" direction="left"><span class="nptext">NOW PLAYING</span>' + '<span class="artisttext">' + artistName + '</span>' + '<span class="titletext">' + $newTitle + '</span>' + '<span class="tracktext">' + trackname + '</span>' + '</marquee>');
                        if (target !== null) {
                            // Check to see if the track is playing already by class name, if it is, pause it becuase you are playing a new track.
                            if ($(this).hasClass('playing')) {
                                console.log('my same song pause');
                                trackPlaying.html('');
                                myAudio.pause();
                            } else {
                                // otherise the track exists already- we should pause that too, most likely clicking on the same track to pause it.
                                if (myAudio) {
                                    myAudio.pause();
                                    console.log('just pause it');
                                }
                                // Create a new audio object now, and assign it the preview url and play it, add the "playing" class
                                myAudio = new Audio(listenUrl)
                                myAudio.play();
                                target.classList.add(playingTrack);

                                myAudio.addEventListener('ended', function() {
                                    target.classList.remove(playingTrack);
                                    if (nextTrack) {
                                        nextTrack.trigger('click');
                                    } else {
                                        console.log('that was the last track');
                                    };
                                });

                                myAudio.addEventListener('pause', function() {
                                    target.classList.remove(playingTrack);
                                });
                            }
                        }
                    });
                })

                // the button to flip the album cover back to allow the original state of the album to be achieved.
                flipBtn.on('click', flipButton);

                function flipButton() {
                    var $albumImg = $album.find('.g-flip');
                    flipBtn.remove();
                    tracklist.fadeOut(200, function() {
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

}; // end getMusic function

$('#myButt').on('click', function() {
    msgBox.remove();
    getMusic();
});

$('#mySearch').keypress(function(event) {
    if (event.keyCode == 13) {
        msgBox.remove();
        getMusic();
    }
});

$('#mute').on('click', function() {
    if (myAudio) {
        $('.nowplay').html('');
        myAudio.pause();
    }
});