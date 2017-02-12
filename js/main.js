( function() {
	console.clear();
	"use strict";

	const searchModule = function() {

		const media = [];
		const containerWrapper = document.querySelector( '.container-wrapper' );
		const containerResults = document.querySelector( '.container-results' );
		const message = document.querySelector( '.message' );
		const searchForm = document.querySelector( '.search-form' );
		const searchWord = document.querySelector( '.search-word' );
		const buttonSearch = document.querySelector( '.button-search' );
		const button10images = document.querySelector( '.button-10images' );
		const overlay = document.querySelector( '.overlay' );
		const overlayImageContainer = document.querySelector( '.overlay-image-container' );
		const overlayText = document.querySelector( '.overlay-text' );
		const overlayBtn = document.querySelector( '.overlay-btn' );
		// const buttonRandom = document.querySelector('.button-random');
		const button10videos = document.querySelector( '.button-10videos' );
		let word = '';
		let type = '';

		function bindEvents() {

			buttonSearch.addEventListener( 'click', () => {
				event.preventDefault();
				word = searchWord.value;
				type = 'search';
				clearContainer();
				getMedia( word, type );
			} );

			button10images.addEventListener( 'click', () => {
				event.preventDefault();
				word = '';
				type = 'images_only=true';
				clearContainer();
				getMedia( word, type );
			} );

			button10videos.addEventListener( 'click', () => {
				event.preventDefault();
				word = '';
				type = 'videos_only=true';
				clearContainer();
				getMedia( word, type );
			} );
		} //end bindEvents


		function clearContainer() {
			containerResults.innerHTML = '';
		} //end clearContainer


		function getMedia( word = 'none', type ) {
			// loading.show();
			const http = new XMLHttpRequest();
			http.onreadystatechange = function() {
				if ( http.readyState === 4 && http.status === 200 ) {
					const data = ( JSON.parse( http.response ) );
					const media = data.images;
					displayMedia( media );
					console.log( 'in' );
					console.log( media );
				}
			};
			type === 'search' ?
				http.open( 'GET', `http://www.splashbase.co/api/v1/images/search?query=${word}`, true ) :
				http.open( 'GET', `http://www.splashbase.co/api/v1/images/latest?${type}`, true );
			http.send();

		} //end getMedia

		function displayMedia( media ) {
			if ( media.length < 1 ) {
				containerResults.classList.remove( 'is-hidden' );
				containerResults.textContent = '--nothing found in Splashbase--';
			} else {
				if ( type === 'videos_only=true' ) {
					console.log( 'videos' );
					makeVideos( media );
				} else {
					console.log( 'images' );
					makeImages( media );
				}
			}
		} //end displayMedia

		function makeImages( media ) {
			for ( i = 0; i < media.length; i++ ) {
				let imgcont = document.createElement( 'div' );
				imgcont.classList = 'imgcont';
				let img = document.createElement( 'img' );
				img.src = media[ i ].url;
				img.dataset.lgurl = media[ i ].large_url;
				img.classList = 'image';
				img.alt = 'recent image';
				containerResults.appendChild( imgcont );
				imgcont.appendChild( img );
				// debugger;
				containerResults.classList.remove( 'is-hidden' );
				img.addEventListener( 'click', () => {
					containerResults.classList.add( 'is-hidden' );
					displayLightbox( event.target );
				} );
			}
		} //end makeImages

		function makeVideos( media ) {
			for ( i = 0; i < media.length; i++ ) {
				let vid = document.createElement( 'video' );
				let vidEach = document.createElement( 'source' );
				vid.setAttribute( 'controls', true );

				vid.poster = media[ i ].url;
				vid.src = media[ i ].large_url;
				// vid.dataset.lgurl = media[i].large_url;
				vid.classList = 'video';
				vid.appendChild( vidEach );
				containerResults.appendChild( vid );
			}

		} // end displayMedia

		function displayLightbox( target ) {
			overlay.classList.remove( 'is-hidden' );
			console.log( target );
			// debugger;
			let ovImg = document.createElement( 'img' );
			lgtarget = target.getAttribute( 'data-lgurl' );
			console.log( 'lgtarget ', lgtarget, ' ovImg ', ovImg );
			ovImg.src = lgtarget;
			overlayImageContainer.appendChild( ovImg );

			overlayText.textContent = `splashbase says : this is a ${word} image`;
			// overlayBox.toggleClass( 'is-hidden' );

			overlayBtn.addEventListener( 'click', () => {
				overlay.classList.add( 'is-hidden' );
				overlayImageContainer.innerHTML = '';
				containerResults.classList.remove( 'is-hidden' );
			} );
		} // end displayLightbox


		function init() {
			bindEvents();
		} //end init

		return {
			begin: init
		}; //end return

	}; //end searchModule

	const imgSearchApp = searchModule();
	imgSearchApp.begin();

} )(); //end iife
