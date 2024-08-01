( function( global, factory ){

	"use strict";
	if(typeof n2 === "undefined"){
		factory( global );
	}

} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ){

	"use strict";
	var version = "1.0.0", readyFn = [], screens = [],
	n2 = function(screenId, fn){
		n2.fn.init(screenId, fn);
	},
	isChrome = navigator.userAgent.indexOf("Chrome") !== -1,
	isIE = !!navigator.userAgent.match(/(MSIE|Trident)/g),
	isIpad = !!navigator.userAgent.match(/iPad/i),
	isIOS = !!navigator.userAgent.match(/(iPad|iPhone|iPod)/g),
	isAndroid = navigator.userAgent.indexOf('Android') > -1,
	isPC = !isIOS && !isAndroid,
	hasTouch =  'ontouchstart' in window,
	getIEVersion = (function() {

		if(navigator.userAgent.match(/(MSIE|Trident)/g)) {
			var userAgent = navigator.userAgent;
			var version = "-1";

			if(userAgent.indexOf("MSIE") > -1) {
				version = userAgent.substring(userAgent.indexOf("MSIE") + 5);
				version = version.substring(0, version.indexOf(";"));

			} else if(userAgent.indexOf("Trident") > -1) {

				version = userAgent.substring(userAgent.indexOf("rv:") + 3);
				version = version.substring(0, version.indexOf(".") + 1);
			}

			return Number(version);
		}

		return null;
	})();


	n2.fn = {};

	/**
	 *
	 * @memberOf ga
	 * @param {string} screenId
	 * @param {function} fn
	 */
	n2.fn.init = function(screenId, fn){
		if(typeof screenId !== "undefined" && typeof fn !== "undefined"){
			screens.push(screenId);
			readyFn.push(fn);
		}
	};

	/**
	 * 초기 실행 함수
	 * @memberOf ga
	 * @param {string} screenId
	 * @param {function} fn
	 */
	n2.ready = function(screenId, fn){

		if(typeof screenId !== "undefined" || typeof fn !== "undefined"){
			n2.fn.init(screenId, fn);
		}else{
			var runFn;
			for(var i = (readyFn.length - 1); i >= 0; i--){
				runFn = readyFn[i];
				readyFn.pop();
				runFn();
			}
		}
	};

	/**
	 * package 확장
	 * @memberOf ga
	 * @param {string} packageName
	 * @param {object} module 확장할 객체
	 * @param {boolean} isGlobal 전역 함수로(ga.)로 매핑 할지 여부
	 */
	n2.extend = function(packageName, module, isGlobal){
		var i=0,
		packages = packageName.split("."),
		cnt = packages.length,
		parent = n2, root = parent;

		for(;i<cnt; i++){
			if(typeof parent[packages[i]] === "undefined"){
				if(i === cnt-1){
					parent[packages[i]] = module || {};
					if(!!isGlobal ){
						for(var name in module){
							if(typeof root[name] === "undefined"){
								root[name] = parent[packages[i]][name];
							}
						}
					}
				}else{
					parent = parent[packages[i]] = {};
				}
			} else {

				parent = parent[packages[i]];
			}
		}
	};

    n2.extend("Utils", (function(){
        var _private = {

        }, _public = {};
        		
        /**
		 * 접속 매체가 Internet Explorer(IE)의 버젼을 반환한다.
		 * @memberOf ga.Utils
		 * @return {boolean}
		 */
		_public.getIEVersion = function(){

			return getIEVersion;
		};

        return _public;
    })());
	
    // n2 객체 노출
    if ( !noGlobal ) {
		window.n2 = window.$n2 = n2;
	}

    // 초화 
	$(function() {
		// init
		try {
			console.log('n2.ready()');
			n2.ready();
			console.log('n2.ready() 끝');
		} catch(e) {
		}
		if (n2.Utils.getIEVersion() === 8) {
			$("body").addClass("ie8");
		}
	});


});