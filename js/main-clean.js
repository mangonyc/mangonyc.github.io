  $(document).ready(function() {

    console.log('function running');
    
    var picslist = $('#the-pics')
        picslist.empty();
    
    var url = 'https://api.spotify.com/v1/search';
    
        $.ajax({
            url: url,
            data: {
                q: 'rush',
                type: 'album'
            },
            success: function (artist) {
                // console.log(artist.albums.items);
                var albums = artist.albums.items;
                albums.forEach(function(album) {
                    $('#mySearch').val('');
                    // console.log(album.name);
                    var albumurl = album.images[1].url;
                    var albumname = album.name;
                    var theCover = $('<img class="g-flip" src="' + albumurl + '"/>');         
                    var $newDiv = $('<div class="indiv-album">')
                    var itemContainer = $('<div class="containr">');
                    var $newTitle = $('<h3>');
                        picslist.append($newDiv);
                        $newDiv.data('albumlink', album.href);
                        $newDiv.append(itemContainer);
                        TweenMax.set($newDiv, {opacity:0, scale:2});
                        $newTitle.html(albumname);
                        itemContainer.append(theCover);
                        itemContainer.data('albumlink', album.href);
                        $newDiv.append($newTitle)
                        TweenMax.staggerTo($('.indiv-album'), 1, { opacity:1, scale:1, rotationY:360, transformPerspective:1800, ease:Power3.easeIn}, .16);
                })
            } //end success from main json
        }) //end ajax command

        $('body').on('click', '.indiv-album', function () {
            var $album = $(this);
            // closeAllAlbums()
            turnAlbum($album);
        })

        function turnAlbum ($album) {
            console.log("turn album");
            console.log($album);
            // var myAlbum = $('.indiv-album')
            var $albumImg = $album.find('.g-flip');
            // var nx = myAlbum.children();
            // var nx = $albumImg.siblings().find('.g-flip');
            // console.log(nx);
            // TweenMax.to(nx, 2 , {rotationY:20})
                    // console.log($albumImg);
                // var tl = new TimelineMax({onComplete:function() { getTracklist($album) }})
            var tl = new TimelineMax()
                    tl.to($albumImg , 1.5 , { opacity:1, scale:1, rotationY:180, transformPerspective:1800, ease:Power4.easeOut});

        } // end of turnAlbum

                    // console.log($album);
                    // var $albumImg = $album.find('.g-flip');
                    // console.log($albumImg);
                    // TweenMax.to($albumImg , 1.5 , { opacity:1, scale:1, rotationY:280, transformPerspective:1800, ease:Power4.easeOut});

                
        function fuckFace($album) {
            // var $album = $(this);
            console.log('run ff');
            console.log($album);
            // body...
        }

        $('#noodles').on('click', function(){
            getTracklist($album)
        })




    // get tracklist
    function getTracklist($album) {
        console.log('get tracklist');
        $album.addClass('tracksOpen');
        var tracklistUrl = $album.data('albumlink');
        var $itemContainer = $album.find('.containr')
        var tracklist = $('<ul class="mytracks">')
            $.get(tracklistUrl, function(trax){
            var traxNames = trax.tracks.items;
            // console.log(trax.tracks.items[0].preview_url);
            var flipBtn = $('<button class="flippy">FLIP ME BACK</button>');
                $itemContainer.append(tracklist);
                $itemContainer.append(flipBtn);

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
                    $itemContainer.append(tracklist);
                    TweenMax.staggerTo($('.track-name'), .5, {opacity:1, scale:1, ease:Power3.easeIn}, .076);
                    
                    $itemContainer.data('tracklink', listenUrl);
                    // console.log(listenUrl);
                    // add functionality to preview the track
                    $newLi.click(function(e) {
                     var playing = 'playing';
                     var target = e.target;
                     var audioObject = new Audio(listenUrl);
                     // check to see if the track is already playing
                    
                         if (target.classList.contains(playing)) {
                             audioObject.pause();
                             // console.log('already playing');
                         } else {
                             if (audioObject) {
                                // console.log('should play'); 
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
            })// end of $.get trax
        // console.log('track list ran');
    } //end of getTracklist

    // turn the album cover over - check to see if it has been already turned over

    

    // theCover.click(turnAlbum);

// });


}); 



