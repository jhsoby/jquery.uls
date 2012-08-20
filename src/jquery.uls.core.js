/**
 * Universal Language Selector
 * ULS core component.
 *
 * Copyright (C) 2012 Alolita Sharma, Amir Aharoni, Arun Ganesh, Brandon Harris,
 * Niklas Laxström, Pau Giner, Santhosh Thottingal, Siebrand Mazeland and other
 * contributors. See CREDITS for a list.
 *
 * UniversalLanguageSelector is dual licensed GPLv2 or later and MIT. You don't
 * have to do anything special to choose one license or the other and you don't
 * have to notify anyone which license you are using. You are free to use
 * UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @file
 * @ingroup Extensions
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

(function ( $ ) {
	"use strict";

	var template = '\
		<div class="uls-menu"> \
			<div class="row"> \
				<span id="uls-close" class="icon-close"></span> \
			</div> \
			<div class="row"> \
				<div class="uls-title four columns">\
					<h1>Select language</h1>\
				</div>\
				<div class="three columns" id="settings-block"></div>\
				<div class="five columns" id="map-block">\
					<div class="row">\
						<div data-regiongroup="4" id="uls-region-4" class="three columns uls-region">\
							<a>Worldwide</a>\
						</div>\
						<div class="nine columns">\
							<div class="row uls-worldmap">\
								<div data-regiongroup="1" id="uls-region-1" class="four columns uls-region">\
									<a>America</a>\
								</div>\
								<div data-regiongroup="2" id="uls-region-2" class="four columns uls-region">\
									<a>Europe <br> Middle east <br> Africa\
									</a>\
								</div>\
								<div data-regiongroup="3" id="uls-region-3" class="four columns uls-region">\
									<a>Asia <br> Australia <br> Pacific\
									</a>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
			</div>\
			<div id="search" class="row"> \
				<div class="one column">\
					<span class="search-label"></span>\
				</div>\
				<div class="ten columns">\
					<div id="search-input-block">\
						<input type="text" class="filterinput" id="filtersuggestion" disabled="true"\
							autocomplete="off" /> <input type="text" class="filterinput" id="languagefilter"\
							data-clear="languagefilter-clear" data-suggestion="filtersuggestion"\
							placeholder="Language search" autocomplete="off" />\
					</div>\
				</div>\
				<div class="one column">\
					<span id="languagefilter-clear"></span>\
				</div>\
			</div>\
			<div class="row uls-language-list"></div>\
			<div class="row uls-no-results-view">\
				<h2 class="ten columns end offset-by-one">\
					No results found\
				</h2>\
				<div id="uls-no-found-more">\
					<div class="ten columns end offset-by-one">\
						<p>\
							You can search by language name, script name, ISO code of language or you can browse by\
							region: <a class="uls-region-link" data-region="NA" href="#">America</a>, <a\
								class="uls-region-link" data-region="EU" href="#">Europe</a>, <a class="uls-region-link"\
								data-region="ME" href="#">Middle East</a>, <a class="uls-region-link" data-region="AF"\
								href="#">Africa</a>, <a class="uls-region-link" data-region="AS" href="#">Asia</a>, <a\
								class="uls-region-link" data-region="PA" href="#">Pacific</a> or <a class="uls-region-link"\
								data-region="WW" href="#">Worldwide languages</a>.\
						</p>\
					</div>\
				</div>\
			</div>\
		</div> ';

	/**
	 * ULS Public class definition
	 */
	var ULS = function( element, options ) {
		this.$element = $( element );
		this.options = $.extend( {}, $.fn.uls.defaults, options );
		this.$menu = $( template );
		this.languages = this.options.languages;
		for ( var code in this.languages ) {
			if ( $.uls.data.languages[code] === undefined ) {
				window.console && console.log && console.log( "ULS: Unknown language " + code + "." );
				delete this.languages[code];
			}
		}
		this.left = this.options.left;
		this.top = this.options.top;
		this.shown = false;
		this.initialized = false;
		this.$languageFilter = this.$menu.find( 'input#languagefilter' );
		this.$noResultsView = this.$menu.find( 'div.uls-no-results-view' );
		this.$resultsView = this.$menu.find( 'div.uls-language-list' );
		this.$noResultsView.hide();
		this.render();
		this.listen();
		this.ready();
	};

	ULS.prototype = {
		constructor: ULS,

		ready: function() {
			if ( this.options.onReady ) {
				this.options.onReady( this );
			}
		},

		/**
		 * Calculate the position of ULS
		 * Returns an object with top and left properties.
		 * @returns {Object}
		 */
		position: function() {
			var pos = $.extend( {}, this.$element.offset(), {
				height: this.$element[0].offsetHeight
			} );
			return {
				top: this.top || pos.top + pos.height,
				left: this.left || '25%'
			};
		},

		/**
		 * Show the ULS window
		 */
		show: function() {
			var pos = this.position();
			this.$menu.css( {
				top: pos.top,
				left: '25%'
			} );

			if ( !this.initialized ) {
				$( 'body' ).prepend( this.$menu );
				// Initialize with a full search.
				// This happens on first time click of uls trigger.
				this.$languageFilter.languagefilter( 'clear' );
				this.initialized = true;
			}
			this.$menu.show();
			this.shown = true;
			this.$languageFilter.focus();
		},

		/**
		 * Hide the ULS window
		 */
		hide: function() {
			this.$menu.hide();
			this.shown = false;
		},

		/**
		 * Render the UI elements.
		 * Does nothing by default. Can be used for customization.
		 */
		render: function() {
			// Rendering stuff here
		},

		/**
		 * callback for no results found context.
		 * @param String search the search term
		 */
		noresults: function( search ) {
			this.$noResultsView.show();
			this.$noResultsView.find( 'span#uls-no-found-search-term' ).text( search );
			this.$resultsView.hide();
		},

		/**
		 * callback for results found context.
		 */
		success: function() {
			this.$noResultsView.hide();
			this.$resultsView.show();
		},

		/**
		 * Bind the UI elements with their event listeners
		 */
		listen: function() {
			var lcd,
				that = this;

			// Register all event listeners to the ULS here.
			that.$element.on( 'click', $.proxy( that.click, that ) );

			// Handle click on close button
			this.$menu.find( "#uls-close" ).on( 'click', $.proxy( that.hide, that ) );

			// Handle key press events on the menu
			that.$menu.on('keypress', $.proxy(this.keypress, this) )
				.on('keyup', $.proxy(this.keyup, this) );
			if ( $.browser.webkit || $.browser.msie ) {
				this.$menu.on( 'keydown', $.proxy( this.keypress, this ) );
			}

			lcd = that.$resultsView.lcd( {
				languages: that.languages,
				clickhandler: $.proxy( that.onSelect, that )
			} ).data( "lcd" );

			that.$languageFilter.languagefilter( {
				$target: lcd,
				languages: that.languages,
				success: function() {
					$( '.regionselector' ).removeClass( 'active' );
					that.success();
				},
				noresults: function() {
					$( '.regionselector' ).removeClass( 'active' );
					that.noresults();
				},
				searchAPI: that.options.searchAPI,
				onSelect: $.proxy( that.onSelect, that )
			} );

			// Create region selectors, one per region
			this.$menu.find( '.uls-region, .uls-region-link' ).regionselector( {
				$target: lcd,
				languages: that.languages,
				success: function() {
					// Deactivate search filtering
					that.$languageFilter.languagefilter( 'deactivate' );

					// Show 'results view' if we are in no results mode
					that.success();
				},
				noresults: function() {
					that.$languageFilter.languagefilter( 'clear' );
				}
			} );
		},

		/**
		 * On select handler for search results
		 * @param langCode
		 */
		onSelect: function( langCode ) {
			this.hide();
			if ( this.options.onSelect ) {
				this.options.onSelect.call( this, langCode );
			}
		},

		keyup: function( e ) {
			if ( !this.shown ) {
				return;
			}
			switch( e.keyCode ) {
				case 27: // escape
					this.hide();
					e.preventDefault();
					break;
			}
			e.stopPropagation();
		},

		keypress: function( e ) {
			if ( !this.shown ) {
				return;
			}
			switch( e.keyCode ) {
				case 27: // escape
					this.hide();
					e.preventDefault();
					break;
			}
			e.stopPropagation();
		},

		click: function( e ) {
			e.stopPropagation();
			e.preventDefault();
			if ( !this.shown ) {
				this.show();
			}
		}

	};

	/* ULS PLUGIN DEFINITION
	 * =========================== */

	$.fn.uls = function( option ) {
		return this.each( function() {
			var $this = $( this ),
				data = $this.data( 'uls' ),
				options = typeof option === 'object' && option;

			if ( !data ) {
				$this.data( 'uls', ( data = new ULS( this, options ) ) );
			}
			if ( typeof option === 'string' ) {
				data[option]();
			}
		} );
	};

	$.fn.uls.defaults = {
		menu: template,
		onSelect: null, // Callback function to be called when a language is selected
		searchAPI: null, // Language search API
		languages: $.uls.data.autonyms() // Languages to be used for ULS, default is all languages
	};

	$.fn.uls.Constructor = ULS;

} )( jQuery );
