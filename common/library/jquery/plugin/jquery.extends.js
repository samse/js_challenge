/**************************************************************************
 * Project				: TLC
 * File Name			: jquery.extends.js
 * Description			: TLC 프로젝트에서 사용하는 jQuery 확장 Library
 * Author				: 유민근
 * Date Created			: 2017. 7. 26.
 * -------------------------------------------------------------------------
 *		변경No			변경일자			변경자			Description
 * -------------------------------------------------------------------------
 *		Ver 1.0			2017. 7. 26.		유민근			Initialized
 **************************************************************************/


(function($) {
	$.fn.extend({

		/**
		 * 객체 존재 여부를 반환한다
		 * @memberOf $
		 */
		isExt : function() {

			return $(this).length > 0;

		},

		/**
		 * input text, textarea, select 에 대해 입력값이 존재하는지, 선택된 값이 존재 하는지 여부를 반환한다.
		 * 공백도 값이 없는것으로 처리한다.
		 * @memberOf $
		 */
		isEmpty : function() {
			var result = false;

			// 선택된 Selector 가 없는 경우 true 반환.
			if ($(this).length == 0) {
				return true;
			}

			this.each(function() {
				var tagName = this.tagName.toUpperCase();
				if (tagName == "INPUT" || tagName == "SELECT"
						|| tagName == "TEXTAREA") {
					var selValue = $(this).val();

					if (selValue == null || typeof (selValue) == "undefined"
							|| selValue.trim() === "") {
						result = true;
						return false;
					}
				}

			});// each

			return result;
		},


		/**
		 * jQuery Selector 에 대해 Enter 이벤트를 처리한다.
		 *
		 * @memberOf $
		 * @param processFunc
		 *            Enter 이벤트 콜백함수
		 */
		enter : function(processFunc) {
			$(this).on("keydown", function(event) {
				if (event.keyCode == 13) {
					$(this).blur();
					// TODO : 앱 체크 추가
//					if (dblife.library.Meap.isApp()) {
//						$(this).focusout();
//					}
					if (!!processFunc) {
						processFunc();
					}
					return false;
				}
			});
		},

		/**
		 * 입력 필드(INPUT, SELECT, TEXTAREA)의 값을 제거한다.
		 *
		 * @memberOf $
		 * @param processFunc
		 *            Enter 이벤트 콜백함수
		 */
		clear : function() {

			this.each(function() {

				ga.UI.clear($(this));
				$(this).find("input, select, textarea").each(function() {

					ga.UI.clear($(this));
				});
			});
		},

		/**
		 * 공통코드 select 박스를 구성한다.
		 *
		 * @param {object} 공통코드 조회 option, 또는 통합코드 ID
		 * @param {object} option 공통코드 구성 option
		 * @param {function} callbackFunc 콜백 Function
		 * @memberOf $
		 */
		setCode : function(codeOption, selectOption, callbackFunc) {

			/**
			 * codeOption : {
			 *	intgCdId : "",			// 통합코드 ID(필수)
			 *	cdClssTypBitCd : "",	// 코드분류유형비트코드 : 해당 번호 및 전체(20)코드
			 *	cdEftvVluKorNm : "",	// 코드유효값한글명 명이 있는 경우 like %cdEftvVluKorNm% 로 검색
			 *	cdEftvVlu : "",			// 코드유효값 있는 경우 like 'cdEftvVluKorNm%' 로 검색
			 *  sysId : ""				// 공통코드를 가져올 대상 시스템(기본 메타, ICM, GABS)
			 *
			 * }
			 */

			/**
			 * selectOption : {
			 * 		,defaultValue : 기본적으로 표시할 내용 ex.) ==전체==, ==선택==
			 * 		,defaultCode : 기본적으로 표시할 코드
			 * 		,selectedCode : 기본적으로 선택할 코드값
			 * }
			 */

			var _selectOption = {
					valueKey : "cdVldtValu",
					textKey : "cdVldtValuHanNm"
			}
			if(selectOption != null){
				for(var key in selectOption){
					if( typeof _selectOption[key] == "undefined" ){
						_selectOption[key] = selectOption[key];
					}
				}
			}

			var $this = $(this);

			ga.Biz.getCdList(codeOption, function(res){
				$this.setSelect(_selectOption, res, callbackFunc);
			});


		},

		/**
		 * 커스텀 SELECT option div를 재구성 한다.
		 *
		 * @memberOf $
		 * @param {object} SELECT option 구성에 대한 object
		 * @param {object} SELECT option data
		 * @param {function}
		 */
		setSelect : function(option, data, callbackFunc) {

			/**
			 * option 설정 값들
			 *
			 * valueKey		: option 의 value 값
			 * textKey		: option 의 text 값
			 * delimiter	: textKey가 배열일 경우 구분자
			 * defaultValue : 최초에 생성 될 option의 value 값
			 * defaultText	: 최초에 생성 될 option의 text 값
			 * selectValue	: 선택할 option value 값
			 * dataField	: array option의 data attribute를 구성 할 필드명
			 *
			 */
			if(ga.Utils.isSmartPhone()) {
				// 모바일 일때
				var sOption = {
					name : !!option.textKey ? option.textKey : 'cdVldtValuHanNm',
					value : !!option.valueKey ? option.valueKey : 'cdVldtValu',
					optTit : !!option.defaultText ? option.defaultText : '==선택==',
					optVal: !!option.defaultValue ? option.defaultValue : '',
					selected : !!option.selectValue ? option.selectValue : '',
					isOptTit : !!option.isOptTit ? option.isOptTit : false,
					dataField : !!option.dataField ? option.dataField : undefined
				}

				ga.MBiz.select($(this), data, sOption)
				.then(function(){
					if(!!callbackFunc) {
						callbackFunc();
					}
				});
			} else {
				// PC 일때
				this.each(function() {

					// 초기화
					$(this).empty();

					if(!!data) {

						var optionArry = [];
						var $option, item, textValue;

						// 기본 option
						if(!!option.defaultText) {

							var defaultValue = !!option.defaultValue ? option.defaultValue : "";

							$option = $('<option value="' + defaultValue + '">' + option.defaultText + '</option>');

							// option array
							optionArry.push($option);
						}

						// 데이터 설정
						for(var i = 0, len = data.length; i < len; i++) {

							item = data[i];

							textValue = item[option.textKey];

							// text 값이 하나가 아니고 배열일 경우
							if(typeof option.textKey === "object") {

								textValue = item[option.textKey[0]];

								// 구분자 설정.
								option.delimiter = !!option.delimiter ? option.delimiter : "";

								// 배열만큼 text appned
								for(var j = 1, textKeyLen = option.textKey.length; j < textKeyLen; j++) {

									textValue += option.delimiter + item[option.textKey[j]];
								}
							}

							// option 설정
							$option = $('<option value="' + item[option.valueKey] + '">' + textValue + '</option>');

							// option data attribute 설정
							if(!!option.dataField) {
								for(var key in option.dataField) {
									$option.data(option.dataField[key], item[option.dataField[key]]);
								}
							}

							// option array
							optionArry.push($option);
						}

						// 요청 서버 리스트 SELECT 설정.
						$(this).append(optionArry);

						if(!!option.selectValue) {

							$(this).find("option[value=" + option.selectValue + "]").prop("selected", true);
						}
					}

					if(!!callbackFunc) {

						callbackFunc();
					}
				});
			}
		},

		/**
		 * radio, checkbox 에 대해 checked 속성값을 설정한다.
		 *
		 * @memberOf $
		 * @param {Boolean}
		 *            체크여부
		 */
		checked : function(isChecked) {
			// TODO
			this.each(function() {
				var tagName = this.tagName.toUpperCase();
				var type = $(this).prop("type").toUpperCase();
				if (tagName == "INPUT"
						&& (type == "CHECKBOX" || type == "RADIO")) {
					if (!!isChecked) {
						if (type === "RADIO") {
							var rdoNm = $(this).attr("name");
							$("input[type=radio][name=" + rdoNm + "]").prop(
									"checked", false);
							$("input[type=radio][name=" + rdoNm + "]").parent(
									"span").removeClass("on");
						}

						$(this).prop("checked", true);
						$(this).parent("span").addClass("on");
					} else {
						$(this).prop("checked", false);
						$(this).parent("span").removeClass("on");
					}
				}
			});// each

			return this;
		},

		/**
		 * radio,checkbox 에 대해 disable 속성값을 설정한다.
		 *
		 * @memberOf $
		 * @param {Boolean}
		 *            활성화,비활성화 여부
		 */
		disabled : function(isDisabled, dataVal) {
			if(ga.Utils.isSmartPhone() || ga.Utils.isOm()){
				// 스마트일경우
				if($(this).length > 0){
					$.each($(this), function(idx, iData){
						var tagName = $(iData)[0].tagName.toUpperCase();
						var type = $(this).prop("type").toUpperCase();

						if(tagName == 'SELECT'){
							if(ga.Utils.isNotEmpty(dataVal)){
								// select 내 속성 disabled 제어
								if(isDisabled) {
									$(iData).find('option:disabled').removeAttr('disabled');
									$(iData).find('option[value="' + dataVal + '"]').attr('disabled', true);
								} else {
									$(iData).find('option:disabled').removeAttr('disabled');
								}
							} else {
								if(isDisabled) {
									$(iData).removeAttr('disabled');
									$(iData).attr('disabled', true);
								} else {
									$(iData).removeAttr('disabled');
									$(iData).next().removeClass('disabled');
								}
							}
							$(iData).each(function(){

								if(ga.Utils.isSmartPhone()) {
									ga.MBiz.ComEvnt.selectBoxReFresh($(iData));
								} else {
									ga.OMBiz.ComEvnt.selectBoxReFresh($(iData));
								}
							})

						} else if (tagName == "INPUT" || tagName == "TEXTAREA") {
								var targetId = $(this).attr("id");

								if (!!isDisabled) {
									$(this).prop("disabled", true);
									if (type == "CHECKBOX" || type == "RADIO") {
										$(this).parent().addClass("disabled");
									} else if($(this).parent().hasClass("calendar")) {
										$(this).parent().addClass("disable");
										$(this).next().prop("disabled", true);
									}
								} else {
									$(this).prop("disabled", false);
									if (type == "CHECKBOX" || type == "RADIO") {
										$(this).parent().removeClass("disabled");
									} else if($(this).parent().hasClass("calendar")) {
										$(this).parent().removeClass("disable");
										$(this).next().prop("disabled", false);
									}
								}
						} else if(tagName == 'A'){
							if (!!isDisabled) {
								$(this).prop("disabled", true);
								$(this).addClass("dis");
							} else {
								$(this).prop("disabled", false);
								$(this).removeClass("dis");
							}
						}
					});

				} else {
					console.warn("$.fn.disabled - Dom Element를 찾을 수 없습니다.");
				}
			} else {

				// PC or 태블릿
				this.each(function() {
					var tagName = this.tagName.toUpperCase();
					var type = $(this).prop("type").toUpperCase();

					if (tagName == "INPUT" || tagName == "SELECT" || tagName == "TEXTAREA") {
						var targetId = $(this).attr("id");

						if (!!isDisabled) {

							$(this).prop("disabled", true);
							if (type == "CHECKBOX" || type == "RADIO") {
								$(this).parent().addClass("disabled");
							} else if(tagName === "SELECT") {
								$(this).next().addClass("disabled");
							} else if($(this).parent().hasClass("calendar")) {

								$(this).parent().addClass("disable");
								$(this).next().prop("disabled", true);
							}
						} else {

							$(this).prop("disabled", false);
							if (type == "CHECKBOX" || type == "RADIO") {
								$(this).parent().removeClass("disabled");
							} else if(tagName === "SELECT") {
								$(this).next().removeClass("disabled");
							} else if($(this).parent().hasClass("calendar")) {

								$(this).parent().removeClass("disable");
								$(this).next().prop("disabled", false);
							}
						}
					} else if (tagName == "A") {
						if (!!isDisabled) {
							$(this).prop("disabled", true);
							$(this).addClass("dis");
						} else {
							$(this).prop("disabled", false);
							$(this).removeClass("dis");
						}
					}
				});
			}

			return $(this);
		},

		/**
		 * readOnly 속성값을 설정한다.
		 * @memberOf $
		 * @param {Boolean}
		 *            활성화,비활성화 여부
		 */
		readOnly : function(isReadOnly) {
			this.each(function() {
				var tagName = this.tagName.toUpperCase();
				if (!!isReadOnly) {
					if (tagName == "SELECT") {
						$(this).addClass("dis");
						$(this).prop("disabled", true);
					} else {
						$(this).addClass("readOnly");
						$(this).prop("readonly", true);
						$(this).removeData("keypadReadonly");

					    if($(this).parent().hasClass("calendar")) {

					    	$(this).parent().addClass("readonly");
					    }
					}
				} else {

					if (tagName == "SELECT") {
						$(this).removeClass("dis");
						$(this).prop("disabled", false);
					} else {
						$(this).removeClass("readOnly");
						$(this).prop("readonly", false);
						$(this).removeData("keypadReadonly");

					    if($(this).parent().hasClass("calendar")) {

					    	$(this).parent().removeClass("readonly");
					    }
					}
				}
			});
		},

		/**
		 * input text 값을 숫자타입으로 반환한다.
		 * 문자만 입력되어 있는 경우 0값을 반환한다.
		 * @memberOf $
		 * @return {number}
		 */
		getNumVal : function() {
			var rtnVal = 0;
			this.each(function() {
				var tagName = this.tagName.toUpperCase();
				if (tagName == "INPUT") {
					rtnVal = ga.Utils.getNumber($(this).val());
					return false;
				}
			});
			return rtnVal;
		},

		/**
		 * 숫자 또는 숫자로 구성성 문자열에 대해 콤마 처리하여 값을 입력한다.
		 *
		 * @memberOf $
		 * @param {string,number} 입력값
		 */
		setCommaVal : function(amt) {
			this.each(function() {
				var tagName = this.tagName.toUpperCase();
				if (tagName == "INPUT") {
					$(this).val(ga.Utils.getComma(amt));
					return false;
				}
			});
		},

		/**
		 * FileUpload Component(data-ui-upload) 업로드를 지원한다.
		 * @memberOf $
		 * @param {function} 업로드완료 콜백
		 */
		upload : function(callbackFun){
			ga.Upload.upload($(this).prop("id"), callbackFun);
		},

		/**
		 * 입력받은 요소의 자식 중 data-id 속성이 있는 요소의 값을 json 형태로 반환한다.
		 * @memberOf $
		 */
		toJson : function(){

			return ga.Biz.toJson($(this));
		},

		/**
		 * 해당 Element 의 스크롤이 마지막으로 갔을때 이벤트를 반환한다.
		 * @memberOf $
		 */
		scrollBottom : function(callbackFunc){

			$(this).scroll(function(e) {
				var element = e.target;
				if(element.scrollHeight - element.scrollTop === element.clientHeight){
					if (!!callbackFunc) {
						callbackFunc();
					}
				}
			});
		},

		/**
		 * 애미메이션 css 를 객체에 적용한다.
		 * @memberOf $
		 */
		animateCss : function(animationName, callback){
			if(typeof $(this).attr("src") != 'undefined'){
				if($(this).attr("src").indexOf('data:') == 0){

				}
			}

			var animationEnd = (function(el) {
				var animations = {
					animation : 'animationend',
					OAnimation : 'oAnimationEnd',
					MozAnimation : 'mozAnimationEnd',
					WebkitAnimation : 'webkitAnimationEnd',
				};

				for ( var t in animations) {
					if (el.style[t] !== undefined) {
						return animations[t];
					}
				}
			})(document.createElement('div'));

			this.addClass('animated ' + animationName).one(animationEnd,function() {
						$(this).removeClass('animated ' + animationName);

						if (typeof callback === 'function'){
							callback();
						}
			});

			$(this).removeClass("none");
			return this;

		},

		/**
		 * 모바일용 커스텀 selected
		 */
		selected : function(dataVal, fireChangeEvent) {
			if($(this).length > 0){
				var tagNm = $(this)[0].tagName.toUpperCase();

				if(tagNm == 'SELECT'){
					if(dataVal) {
						$(this).find('option:selected').prop('selected', false);
						if(ga.Utils.isArray(dataVal)) {
							$(this).val(dataVal);
						} else {
							$(this).find('option[value="' + dataVal + '"]').prop('selected', true);
						}
					} else {
						$(this).prev('a.selectResult').removeClass('chk');
						$(this).find('option:selected').prop('selected', false);
						$(this).find('option[value=""]').prop('selected', true);
					}

					if(ga.Utils.isSmartPhone()) {
						// 모바일
						ga.MBiz.ComEvnt.selectBoxReFresh($(this));
					} else {
						// omni
						ga.OMBiz.ComEvnt.selectBoxReFresh($(this));
					}

					if(fireChangeEvent !== false){
						$(this).trigger("change");
					}
				}

			} else {
				console.warn("$.fn.selected - Dom Element를 찾을 수 없습니다.");
			}
			return $(this);
		},

		/**
		 * 모바일용 selectedIdx
		 */
		selectedIdx : function(optIdx) {

			if($(this).length > 0){
				var tagNm = $(this)[0].tagName.toUpperCase();

				if(tagNm == 'SELECT'){
					$(this).selected($(this).find("option:eq(" + optIdx + ")").val());
				}  else {
					console.warn("$.fn.selectedIdx [" + $(this).attr("id") + "]는 selectBox가 아닙니다.");
				}
			} else {
				console.warn("$.fn.selectedIdx - Dom Element를 찾을 수 없습니다.");
			}
			return $(this);
		}
	});

	/**
	 * jQuery val api Override
	 */
	var _jQueryValfunc = jQuery.fn.val;
	jQuery.fn.val = function() {

		// Formatter 의 경우 값 입력시 자동으로 콤마 처리한다.
		if (arguments.length == 1 && arguments[0] != "") {

			if ($(this).length == 0) {
				ga.Debug.log("화면에 없는 DOM 을 selector 하였습니다. : "
						+ $(this).selector, true);
				return _jQueryValfunc.apply(this, arguments);
			}

			var dataUiMask = $(this).attr("data-ui-mask");

			if (!!dataUiMask && dataUiMask.indexOf("amt") > -1
					|| dataUiMask == "minus_amt") {

				arguments[0] = ga.Utils.getComma(arguments[0]);
			}

			// calendar 컴포넌트의 경우 값을 넣을때 "-" 를 추가.
			if ($(this)[0].hasAttribute("data-ui-calendar")) {

				arguments[0] = ga.Utils.getFormatting(arguments[0], "DATE", "-");

				// 월달력일 경우
				if($(this).data("type") === "monthInp") {

					if(arguments[0].length > 6) {

						arguments[0] = arguments[0].substring(0, 7);
					}
				}
			}

			// ASCII CODE TO HTML
			if ($(this)[0].tagName.toUpperCase() === "INPUT") {

				arguments[0] = ga.Utils.convertAsciiToHtml(arguments[0]);
			}
		}

		if (arguments.length == 0 && $(this).length > 0) {

			var dataUiMask = $(this).attr("data-ui-mask");

			if (!!dataUiMask && dataUiMask.indexOf("amt") > -1
					|| dataUiMask == "minus_amt") {
				var val = _jQueryValfunc.apply(this, arguments);
				return val.split(',').join('');
			}

			// calendar 컴포넌트의 경우 값을 가져올때 "-" 를 제거 한다.
			if ($(this)[0].hasAttribute("data-ui-calendar")) {
				var val = _jQueryValfunc.apply(this, arguments);
				return ga.Utils.getDigits(val);
			}

			// 메모타입(textarea) 금칙어 제그
			if ($(this)[0].tagName.toUpperCase() === "TEXTAREA" && !ga.Utils.isEmpty($(this).data("uiMemoTyp"))) {
				return ga.UI.validateMemoFbdWord($(this), true);
			}

			// 보안키패드
			if (ga.App.isApp() && ($(this).attr("data-ui-security") == "A" || $(this).attr("data-ui-security") == "B")) {
				return $(this).data("securityData");
			}

			//e2e (includeJs.jsp 에서 외부망, 모바일여부 체크후 ga.e2e.js include함)
			if( !! ga.e2e && $(this).attr("e2e_type") == "1") {
				return ga.e2e.getEncData($(this).attr("id"));
			}

		}

		return _jQueryValfunc.apply(this, arguments);
	};

	/**
	* ie8에선 trim 지원 안하기 때문에 따로 정의
	*/
	if(!String.prototype.trim) {

		String.prototype.trim = function() {

			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
		}
	}
})(jQuery);




