// create 2010
(function($){
	
	//	$.fn.myTabs.defaults = {
	//		debug:false,
	//		cache:true,
	//		container:false,
	//		blockClick:true,
	//		hideAll:false,
	//		startTab: 0,
	//		animSpeed: 1000,
	//		textLoading: 'static', //static/dynamic
	//		responseType:'html', // html/json
	//		responseCollback: function(){},
	//		animationShowText: function () {},
	//		animationHideText: function () {},
	//		afterLoad: function () {}
	//	};
	
	var MyTabs = function (element, options) {
		var $MyTabs = this;
		var o = $.extend({}, $.fn.myTabs.defaults, options);
		this.o = o;
		
		var benchmark = function (s,d){
			log(s+","+(new Date().getTime()-d.getTime())+"ms");
		}

		this.benchmark=benchmark;
		
		var $LinkContainer = $(element),
		$Links = $($(element).find('a'));
		
		
		if (o.cache) {
			var cc = {};
		}
		
		// seting text conatainer
		var $TextContainer = $LinkContainer;
		if (o.container) {
			$TextContainer = $(o.container);
		}
		this.TextContainer = $TextContainer;


		if (o.textLoading) {
			
		}
		
		if (o.hideAll) {
			hideAll();
		}
		
		// setting start tab
		if (typeof o.startTab == 'string' && $(o.startTab).length > 1) {
			$TextContainer.children(o.startTab).show();
		} else if (o.startTab >= 0) {
			$TextContainer.children("div:nth("+o.startTab+")").show();
		} else {
			o.startTab = 0;
		}
		
		$Links.bind('click', loadTab);
		
		if (location.hash.length > 1) {
			loadTab(location.hash.substr(1))
		}

		// functions section
		function loadTab (object) {
			var patt = /^http:\/\//;
			debug('test object: '+$.type(object)+' '+object)
			if ($.type(object) === "string") {
				href = object;
				divID = '_'+href.replace('/', '_');
				if ($TextContainer.children("#"+divID).length <= 0) {
					$.get(href, function (data){
						var newData = $(data).find('#content').html();
						var newDiv = $('<div>');
						$(newDiv).attr({
							id: divID,
							class:'text'
						}).html(newData).appendTo($TextContainer);
						target = $TextContainer.children("#"+divID);
						debug('target '+ divID + ' '+ $TextContainer.children("#"+divID).length)
						o.animationShowText.call(this, $MyTabs,$(target));
							
					});
					return true;
				} else {
					target = $TextContainer.children("#"+divID);
				}
			} else {
				var $anchor = $(this),
				href = $anchor.attr("href");
			
				$.metadata.setType("class");
				var anchorOptions = $anchor.metadata();
			
				if(o.debug) {
					log("object: "+$anchor.attr('class'));
					log("href: "+" "+divID+" ");
				}
						
				if (href.search($('base').attr('href')) !== -1) {
					href = href.substr($('base').attr('href').length);
					debug(href);
				}

			}
			
			if (patt.test(href)) {
				if (o.textLoading == 'static' || anchorOptions.textLoading == 'redirect') {
					log('test');
					$(this).unbind('click');
					$(this).triggerHandler('click');
				} else {
					object.preventDefault();
					location.hash = href;
					o.responseCollback.call(this, $MyTabs, href);
				}
			} else {
				object.preventDefault();
				location.hash = href;
			
				var target = '';
				if (o.textLoading == 'static' || anchorOptions.textLoading == 'static') {
					if ($(anchorOptions.target).length > 0) {
						o.animationShowText.call(this, $MyTabs, $(anchorOptions.target));
						return true;
					} else {
						var divID = '';
						if (href.substr(0,1) == "#") {
							divID = '_H_'+href.substr(1).replace('/', '_');
						} else  {
							divID = '_'+href.replace('/', '_');
						}
						target = $TextContainer.children("#"+divID);
					}
				} else if (o.textLoading == 'dynamic') {
					divID = '_'+href.replace('/', '_');
					if ($TextContainer.children("#"+divID).length <= 0) {
						$.get(href, function (data){
							var newData = $(data).find('#content').html();
							var newDiv = $('<div>');
							$(newDiv).attr({
								id: divID,
								class:'text'
							}).html(newData).appendTo($TextContainer);
							target = $TextContainer.children("#"+divID);
							debug('target '+ divID + ' '+ $TextContainer.children("#"+divID).length)
							o.animationShowText.call(this, $MyTabs,$(target));
							
						});
						return true;
					} else {
						target = $TextContainer.children("#"+divID);
					}
					
				}



				$(target).ready(function (){
					o.animationShowText.call(this, $MyTabs,$(target));
				})
				
			}
			return true;
		}


		function hideAll () {
			$TextContainer.children("div").hide();
		}
		
		// For debugging
		function log (msg){
			if (this.console && typeof console.log != "undefined")
				console.log(msg);
		}
        
		//Trigger the afterLoad callback
		o.afterLoad.call(this);
		
		return this;
	}
	
	$.fn.myTabs = function(options) {
    
		return this.each(function(key, value){
			var element = $(this);
			// Return early if this element already has a plugin instance
			if (element.data('mytabs')) return element.data('mytabs');
			// Pass options to plugin constructor
			var mytabs = new MyTabs(this, options);
			// Store plugin object in this element's data
			element.data('mytabs', mytabs);
		});

	};
	
	//Default settings
	/*$.fn.myTabs.defaults = {
		debug:false,
		cache:true,
		container:false,
		blockClick:true,
		textLoading: 'static', //static/dynamic
		responseType:'html', // html/json
		responseCollback: function(){}
	};*/
	
	$.fn.myTabs.defaults = {
		debug:false,
		cache:true,
		container:false,
		blockClick:true,
		hideAll:false,
		startTab: 0,
		animations: true,
		animSpeed: 1000,
		textLoading: 'static', //static/dynamic
		responseType:'html', // html/json
		responseCollback: function(){},
		animationShowText: function () {},
		animationHideText: function () {},
		afterLoad: function () {}
	};
	
	$.fn._reverse = [].reverse;
})(jQuery);
