'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * 사용자 로그인 이후 검색어를 관리하기 위한 개인구별 값...
 */
if (wt_hnt_uid === undefined) {
  var wt_hnt_uid = '';
}
// wt_hnt_uid = "zJlhj45X3Fj7vGFfL2JRsBdXvyVxgKwvZRRKK2y6j4lyOxRlAAeOh1rnrluFio86";

/**
 * 웹투어/여행정보에서 전달해줘야할 값으로 동작중인 서버가 운영/비운영인지 구분할 값이다.
 */
if (wt_serv_env === undefined) {
  var wt_serv_env = 'prd';
}

// wt_serv_env 안넣어줄 경우 강제적으로 설정
// wt_serv_env = "prd";

/**
 * dotCom을 바라볼 주소를 결정한다.
 */
var getDotComUrl = function getDotComUrl(env, device) {
  /* let result = {};
      if (location.href.indexOf('local') !== -1) { //로컬이면
        result.api = 'https://devapi.hanatour.com'; //api
        result.domain = `${location.protocol}//${location.host}`; //링크연결 도메인
    } else {
        if (env === "prd") { //운영이면
            result.api = 'https://api.hanatour.com'; //api
            result.domain = "https://m2.hanatour.com" //링크연결 도메인
        } else { //로컬이 아니고, 운영이 아니면
            result.api = 'https://stgapi.hanatour.com'; //api
            result.domain = "https://mstgtour.hanatour.com" //링크연결 도메인
        }
    } */
  var result = {
    api: '',
    domain: '',
    imgDomain: ''
  };
  var _device = device === 'pc' ? '' : 'm';
  var isApp = isHybridApp();
  if (isApp) {
    _device = 'app';
  }
  var _urls = {
    local: {
      api: 'https://devapi.hanatour.com',
      domain: location.protocol + '//' + location.host
    },
    dev: {
      api: 'https://devapi.hanatour.com',
      domain: 'https://' + _device + 'devtour.hanatour.com'
    },
    stg: {
      api: 'https://stgapi.hanatour.com',
      domain: 'https://' + _device + 'stgtour.hanatour.com'
    },
    tstg: {
      api: 'https://stgapi.hanatour.com',
      domain: 'https://t' + _device + 'stgtour.hanatour.com'
    },
    www2: {
      api: 'https://api.hanatour.com',
      domain: 'https://' + (_device === '' ? 'www' : _device) + '2.hanatour.com'
    },
    qa: {
      api: 'https://qaapi.hanatour.com',
      domain: 'https://' + _device + 'qatour.hanatour.com'
    }

    //닷컴개발자 환경이면
  };var hrefs = ['local', 'stg', 'tstg', 'dev', 'www2', 'qa-', 'qa'];
  for (var i = 0; i < hrefs.length; i++) {
    if (location.href.indexOf(hrefs[i]) !== -1) {
      if (hrefs[i] === 'dev') {
        result.api = _urls[hrefs[i]].api;
        result.domain = _urls[hrefs[i]].domain;
        result.imgDomain = 'https://devimage.hanatour.com';
      } else if (hrefs[i] === 'qa-' || hrefs[i] === 'stg' || hrefs[i] === 'tstg') {
        result.api = _urls.stg.api;
        result.domain = _urls.stg.domain;
        result.imgDomain = 'https://devimage.hanatour.com';
      } else if (hrefs[i] === 'qa') {
        result.api = _urls.qa.api;
        result.domain = _urls.qa.domain;
        result.imgDomain = 'https://devimage.hanatour.com';
      } else {
        result.api = _urls[hrefs[i]].api;
        result.domain = _urls[hrefs[i]].domain;
        result.imgDomain = 'https://devimage.hanatour.com';
      }
      break;
    }
  }

  //웹투어 dev환경 결제테스트를 위해 닷컴 stg 바라보도록 임시 처리
  if (location.href.indexOf('dev-mwtdom') > -1) {
    result.api = _urls.stg.api;
    result.domain = _urls.stg.domain;
    result.imgDomain = 'https://devimage.hanatour.com';
  }

  //웹투어 예약 페이지 - 네이티브 하단GNB 미노출 임시처리
  if (location.pathname === '/domestic/da_reserve_check.asp') {
    var _isApp = isHybridApp();
    var isIOS = isIOSApp();
    var isDCR = isDCRApp();
    var param = '{"scheme":"dcr","tag":"hide","params":{"label":"gnbTabBar","type":"animation"}}';
    if (_isApp) {
      if (isIOS !== 'Y' && isDCR) {
        //AOS
        //console.log(':::: 웹투어 예약 페이지(진입) - AOS 호출')
        window.htmlEventHandler.hanatourapp(param);
      }
    }
  }

  if (result.api === '') {
    //닷컴개발자 환경이 아니면
    if (env === 'prd') {
      //운영이면
      if (isApp === true) {
        result.api = 'https://api.hanatour.com'; //api
        result.domain = 'https://apptour.hanatour.com'; //링크연결 도메인
        result.imgDomain = 'https://image.hanatour.com';
      } else {
        result.api = 'https://api.hanatour.com'; //api
        result.domain = 'https://m.hanatour.com'; //링크연결 도메인
        result.imgDomain = 'https://image.hanatour.com';
      }
    } else {
      //운영이 아니면
      if (isApp === true) {
        result.api = 'https://stgapi.hanatour.com'; //api
        result.domain = 'https://appstgtour.hanatour.com'; //링크연결 도메인
        result.imgDomain = 'https://devimage.hanatour.com';
      } else {
        result.api = 'https://stgapi.hanatour.com'; //api
        result.domain = 'https://mstgtour.hanatour.com'; //링크연결 도메인
        result.imgDomain = 'https://devimage.hanatour.com';
      }
    }
  }

  return result;
};
var wtDotComUrl = getDotComUrl(wt_serv_env, 'm');
// console.log(':::: wtDotComUrl : ',wtDotComUrl)
var apiUrl = wtDotComUrl.api; //api 서버
var webtourDomain = wtDotComUrl.domain; //링크 동작될 도메인
var imageDomain = wtDotComUrl.imgDomain;
var webtourView = location.href.indexOf('info.hanatour.com') === -1; //웹투어인지 여행정보인지 판별
var webtourSiteId = 'hanatour'; //siteId

//스케줄러 도메인 세팅
var schedulerDomain = 'https://mscheduler.hanatour.com/';
if (webtourDomain.indexOf('local') > -1 || webtourDomain.indexOf('dev') > -1) {
  //local,dev : dev-mscheduler
  schedulerDomain = 'https://dev-mscheduler.hanatour.com/';
} else if (webtourDomain.indexOf('stg') > -1 || webtourDomain.indexOf('tstg') > -1 || webtourDomain.indexOf('qa-') > -1) {
  //stg,tstg,qa- : qa-mscheduler
  schedulerDomain = 'https://qa-mscheduler.hanatour.com/';
}

//코브랜드 여부
var currHostname = location.hostname;
//var currHostname = 'mdevyanolja.hanatour.com' //(예시1)기본형 & 닷컴동일o (dtcmMainUseYn :  N / dtcmSiteInfoUseYn :  Y / hdrFotrStupDvCd :  T)
//var currHostname = 'mjiseung.hanatour.com'    //(예시2)기본형 & 닷컴동일x (dtcmMainUseYn :  Y / dtcmSiteInfoUseYn :  N / hdrFotrStupDvCd :  T)
//var currHostname = 'mdevskhynix.hanatour.com' //(예시3)HTML형            (dtcmMainUseYn :  N / dtcmSiteInfoUseYn :  Y / hdrFotrStupDvCd :  H)
var isCobrand = currHostname != 'local.hanatour.com' && currHostname != 'mdevtour.hanatour.com' && currHostname != 'mstgtour.hanatour.com' && currHostname != 'tmstgtour.hanatour.com' && currHostname != 'm.hanatour.com' && currHostname != 'appdevtour.hanatour.com' && currHostname != 'appstgtour.hanatour.com' && currHostname != 'tappstgtour.hanatour.com' && currHostname != 'apptour.hanatour.com' && currHostname != 'mperf.hanatour.com' && currHostname != 'appperf.hanatour.com' && currHostname != 'qa-mscheduler.hanatour.com' && currHostname != 'mscheduler.hanatour.com' && currHostname != 'dev-mwtdom.hanatour.com' && currHostname != 'mwtdom.hanatour.com' && currHostname != 'dev-user-mobile.hanatour.com' && currHostname != 'mfnd.hanatour.com' && currHostname != 'mqatour.hanatour.com' && currHostname != 'appqatour.hanatour.com';
//위 도메인 이외에는 코브랜드로 인식
//코브랜드일 경우, 해당 코브랜드로 도메인 설정                
if (isCobrand) {
  webtourDomain = location.origin;
}
//console.log(':::: isCobrand : ',isCobrand)

function homeDomainFunc() {
  var result = location.href.split('//')[0] + '//' + location.href.split('//')[1].split('/')[0];
  return result;
}

var homeDomain = homeDomainFunc();

/**
 * cookie값이 true면 로그인된 상태
 * cookie값이 false이거나 값이 없으면 로그아웃된 상태
 */
var _wtLogin = function (key) {
  var _cookie = key + '=';
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    cookies[i] = cookies[i].replace(/^\s*|\s*$/g, '');

    if (cookies[i].indexOf(_cookie) !== -1) {
      return cookies[i].slice(_cookie.length, cookies[i].length);
    }
  }
  return '';
}('wtLogin');

// let isLoginFromHanatour = _wtLogin === '' ? false : _wtLogin === 'true'
// let isLoginFromHanatour = wt_hnt_uid !== ''; //하나투어로부터 로그인 했는지 판별
var isLoginFromHanatour = getCookie('hnt_uid') !== null && getCookie('hnt_uid') !== '' ? true : false;

/**
 * PC footer에서만 사용하는 기능
 */
function changeFooterSelect(obj) {
  if (obj.value !== '') {
    window.open(obj.value, '_blank');
  }
}

function webtourRedirect(url) {
  return url + '?redirectUri=' + encodeURIComponent(location.href);
}

function wtLogout() {
  location.href = wtDotComUrl.domain + '/com/lgi/logout?redirectUri=' + encodeURIComponent(location.href);
  /* wtjs.ajax(`${apiUrl}/svc/signOut`, {}, function(data) {
        if (localStorage) {
            localStorage.removeItem('redirectUri')
            localStorage.removeItem('siteId')
        }
          document.cookie =
            'wtLogin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.hanatour.com'
        location.reload()
    }) */
}

function getCookie(name) {
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value ? value[2] : null;
}

function logInOut(status) {
  var token = wtjs.getCookie('hnt_uid');

  if (token !== null && token !== '') {
    // (status)
    return '<li style="flex:1 1 auto;"><a href="#" onclick=\'wtLogout()\'>\uB85C\uADF8\uC544\uC6C3</a></li>';
  } else if (isCobrand) {
    //코브랜드 footer
    var chnlDvCd = 'M';
    var dmnAdrs = currHostname;

    //API 호출
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl + '/open/bboBcmApiCategory/getListBboBcmOpenApi?_siteId=' + webtourSiteId + '&chnlDvCd=' + chnlDvCd + '&dmnAdrs=' + dmnAdrs, false);
    xhr.send();
    var data = JSON.parse(xhr.response.replace(/^document.write\(\'/, '').replace(/\'\)\;/g, '').split('null').join('""'));
    if (data.resultMessage === 'SUCCESS') {
      var bboBcmInfoLst = data.getListBboBcmServiceConfig.bboBcmInfoLst[0];
      if (bboBcmInfoLst.afcnResTrgtDvCd === '02') {
        return '<li style="flex:1 1 auto;"><a href="' + webtourDomain + URLS['예약조회'] + '">\uC608\uC57D\uC870\uD68C</a></li>';
      } else {
        return '<li style="flex:1 1 auto;"><a href="' + webtourRedirect(webtourDomain + URLS['로그인']) + '">\uB85C\uADF8\uC778</a></li>';
      }
    }
  } else {
    return '<li style="flex:1 1 auto;"><a href="' + webtourRedirect(webtourDomain + URLS['로그인']) + '">\uB85C\uADF8\uC778</a></li>';
  }
}

function isHybridApp() {
  var UserAgent = navigator.userAgent;

  if (UserAgent.indexOf('hanatourApp') !== -1) {
    return true;
  } else {
    return false;
  }
}

function isIOSApp() {
  var userAgent = navigator.userAgent;
  return (/iP(ad|hone|od)/.test(userAgent) ? 'Y' : 'N'
  );
}

function goBack() {
  // console.log(':::: history.length:', history.length)
  if (history.length === 1) {
    var isApp = isHybridApp();
    var isIOS = isIOSApp();
    // console.log(':::: isApp:', isApp, '/isIOS:', isIOS)
    if (isApp) {
      //뒤로가기 시 Native App인 경우, 앱을 호출한다
      var webMessage = {
        scheme: 'dcr',
        tag: 'home',
        params: {
          type: 'animation'
        }
      };
      if (isIOS === 'Y') {
        // console.log('[callNativeApi] IOS webMessage:', webMessage)
        window.webkit.messageHandlers.hanatourapp.postMessage(JSON.stringify(webMessage));
      } else {
        // console.log('[callNativeApi] AOS webMessage:', webMessage)
        window.htmlEventHandler.hanatourapp(JSON.stringify(webMessage));
      }
    } else {
      location.href = '/';
    }
  } else {
    history.back();
  }
}

function btnHomeClick() {
  //홈
  //console.log(':::: btnHomeClick() call')
  var isIOS = isIOSApp();
  var isDCR = isDCRApp();
  var param = '{"scheme":"dcr", "tag":"home", "params":{"type":"animation"}}';
  if (isIOS === 'Y' && isDCR) {
    //IOS
    //console.log(':::: 홈 - IOS 호출')
    window.webkit.messageHandlers.hanatourapp.postMessage(param);
  } else if (isDCR) {
    //AOS
    //console.log(':::: 홈 - AOS 호출')
    window.htmlEventHandler.hanatourapp(param);
  } else {
    //console.log(':::: 홈 - WEBVIEW 호출')
    var moveUrl = webtourDomain;
    location.href = moveUrl;
  }
}

//CRM 태깅 - 통합검색 내
function setCrm(keyword, keywordCateg) {
  var isDCRMain = WEBTOURFNC.isDCRMain();
  if (!isDCRMain) {
    //console.log(':::: setCrm() skip')
    return;
  }
  var isLoginFromHanatour = getCookie('hnt_uid') !== null && getCookie('hnt_uid') !== '' ? true : false;
  try {
    var searchType = keywordCateg == 'DS' ? '직접 검색' : keywordCateg == 'SS' ? '샘플 검색어' : keywordCateg == 'RK' ? '추천키워드' : keywordCateg == 'RS' ? '추천검색어' : keywordCateg == 'PS' ? '인기검색어' : keywordCateg == 'SR' ? '급등검색어' : keywordCateg == 'TR' ? '연관검색어' : keywordCateg == 'AC' ? '자동완성' : keywordCateg == 'RE' ? '최근 검색어' : keywordCateg == 'SU' ? '검색어제안' : '';
    var crmParams = {};
    //검색어
    crmParams.keyword = keyword;
    //usermode
    crmParams.usermode = 'MO';
    //loginId
    crmParams.loginId = isLoginFromHanatour ? $nuxt.$store.state.user.customerNumber : ''; //로그인 여부에 따라 사용자 아이디 삽입 필요
    //검색방식
    crmParams.keywordCateg = searchType;
    //console.log(":::: search crmParams : ", crmParams)
    WEBTOURFNC.setEvent('search', crmParams);
  } catch (e) {
    console.log(":::: setCrm search e : ", e);
  }
}

/**
 * DCR 앱 적용 여부
 * 하단GNB & 전체메뉴/통합검색 돋보기/전체도시 앱 분기 관련
*/
function isDCRApp() {
  var isApp = isHybridApp();
  var isIOS = isIOSApp();
  var IOS_DCR_VER = 630;
  var ANDROID_DCR_VER = 872;
  //IOS : "hanatourApp+332+iPhone12,1+414.0+ios14.8.1+MainWebView+6.3.0+Mozilla/5.0 (iPhone; CPU iPhone OS 14_8_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148" //샘플데이터
  //AOS : "hanatourApp+868+SM-G981N+31"//샘플데이터
  // console.log(':::: navigator.userAgent:',navigator.userAgent)
  if (isApp) {
    if (isIOS === 'Y') {
      //IOS
      var appVer = Number(navigator.userAgent.split('+')[6].replaceAll('.', ''));
      //console.log(':::: IOS appVer : ', appVer)
      if (appVer >= IOS_DCR_VER) {
        return true;
      }
    } else {
      //AOS
      var _appVer = Number(navigator.userAgent.split('+')[1]);
      //console.log(':::: AOS appVer : ', appVer)
      if (_appVer >= ANDROID_DCR_VER) {
        return true;
      }
    }
  }
  return false;
}

var wtjs = {
  RECENTLY_COOKIE_NAME: 'CHPC0ITS0001S100',
  MAX_COOKIE_SIZE: 20,
  isLoginFromHanatour: false,
  init: function init() {
    document.domain = 'hanatour.com';
    this.isLoginFromHanatour = !!this.getCookie('hnt_uid');
    return '';
  },
  wishListCnt: function wishListCnt() {
    //찜 개수 api호출
    var wishCount = 0;
    if (this.getCookie('hnt_uid') !== null) {
      var hnt_uid = encodeURIComponent(this.getCookie('hnt_uid'));
      var xhr = new XMLHttpRequest();
      xhr.open('GET', apiUrl + '/open/comSbkApiCategory/getWishCount?hnt_uid=' + hnt_uid, false);
      xhr.send();
      var wishCountRes = JSON.parse(xhr.response.replace(/^document.write\(\'/, '').replace(/\'\)\;/g, '').split('null').join('""'));
      if (wishCountRes.result === '200') {
        wishCount = wishCountRes.getWishCount.wishCnt;
      }
    }
    return wishCount;
  },
  isWishView: function isWishView() {
    //관심 개수 노출여부
    if (this.getCookie('hnt_uid') !== null && this.wishListCnt() > 0) {
      return 'block';
    } else {
      return 'none';
    }
  },
  linkProc: function linkProc(text, keywordCateg) {
    setCrm(text, keywordCateg); //CRM 태깅 - 통합검색 내
    var isApp = isHybridApp();
    // 최근/인기/추천 검색어 리스트 클릭
    if (text !== '') {
      if (text.indexOf('http') > -1) {
        //어드민에서 추천키워드가 URL형식으로 세팅된 경우
        if (text.indexOf('m.hanatour.com') > -1 && isApp) {
          //앱이면서 랜딩URL이 닷컴모바일 이라면, 닷컴앱으로 도메인 적용(앱 이탈 방지)
          text = text.replace('m.hanatour.com', 'apptour.hanatour.com');
        }
        location.href = text;
      } else {
        wtjs.saveKeyword(text, function (data) {
          location.href = webtourDomain + '/com/its/CHPC0ITS0002M100?keyword=' + text + '&keywordCateg=' + keywordCateg;
        });
      }
    }
  },
  setCookie: function setCookie(cookieName, cookieValue) {
    var cookieText = cookieName + '=' + encodeURIComponent(cookieValue);

    // $nuxt.$q.cookies.set() 의 expired : 10과 동일하게 처리하도록
    function addDays(days) {
      var result = new Date();
      result.setDate(result.getDate() + days);
      return result;
    }
    function getDomainForSharingCookies() {
      var host = window.location.hostname;
      return '.' + host.split('.').slice(-2).join('.');
    }
    cookieText += '; EXPIRES=' + addDays(10).toGMTString();
    cookieText += '; PATH=/';
    cookieText += '; DOMAIN=' + getDomainForSharingCookies();
    document.cookie = cookieText;
  },
  getCookie: function getCookie(cookieName) {
    var cookieValue = null;
    if (document.cookie) {
      var array = document.cookie.split(cookieName + '=');
      if (array.length >= 2) {
        var arraySub = array[1].split(';');
        cookieValue = arraySub[0];
      }
    }

    function isEncoded(value) {
      return typeof value === 'string' && decodeURIComponent(value) !== value;
    }
    return isEncoded(cookieValue) ? decodeURIComponent(cookieValue) : cookieValue;
  },
  deleteCookie: function deleteCookie(cookieName) {
    var temp = this.getCookie(cookieName);
    if (temp) {
      this.setCookie(cookieName, temp, new Date(1));
    }
  },
  ui: {
    autoSearch: function autoSearch(iconName, val) {
      //iconNames: default/recom/pkg/air/htl/info/pos
      return '<li>\n\t\t\t\t<span class="icn ' + iconName + '"></span>\n\t\t\t\t<a href="#">' + val + '</a>\n\t\t\t</li>';
    },
    getRecentlyKeywordHtml: function getRecentlyKeywordHtml(val) {
      return '<li><a href="#" onclick="wtjs.linkProc(\'' + val + '\',\'RE\')">' + val + '</a><a href="#" class="btn_del" onclick="wtjs.removeKeyword(\'' + val + '\')">\uAC80\uC0C9\uC5B4 \uC0AD\uC81C</a></li>';
    }, //end: recentSearch: function(val) {
    popularSearch: function popularSearch(idx, val) {
      //console.log('popularSearch: ', idx, val)

      var i = idx + 1;
      return '<li>\n\t\t\t\t<span class="num">' + i + '</span>\n\t\t\t\t<a href="#" onclick="wtjs.linkProc(\'' + val + '\',\'PS\')">' + val + '</a>\n\t\t\t</li>';
    }, //end: popularSearch: function(idx, val) {
    recommendSearch: function recommendSearch() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'c1';
      var val = arguments[1];
      var lnkSrwrNm = arguments[2];

      return '<a href="#" onclick="wtjs.linkProc(\'' + lnkSrwrNm + '\',\'RK\')" class=\'' + type + '\'>#' + val + '</a>';
    },
    dataNo: function dataNo(val) {
      return '<div class="data_no">\n\t\t\t\t<div class="cont">\n\t\t\t\t\t<strong>' + val + '</strong>\n\t\t\t\t</div>\n\t\t\t</div>';
    },
    toggleMenuAll: function toggleMenuAll(obj1, obj2) {
      //obj1.classList.toggle("on")
      //obj2.classList.toggle("on")
    },
    headerType: function headerType() {
      var temps = [];
      /* headerType 정의 */
      //Type0. [좌]이전페이지                          - default 헤더
      //Type1. [좌]전체메뉴   [우]통합검색,전체도시     - 스케줄러 헤더
      //Type2. [좌]이전페이지 [우]찜,닷컴홈           - 웹투어/FND 상품목록 헤더
      //Type3. [좌]이전페이지 [우]통합검색,전체도시      - FND 홈 헤더
      //Type4. [좌]이전페이지 [우]찜,닷컴홈 - FND 상품상세 헤더
      //Type5. [좌]이전페이지 [우]공유하기,닷컴홈 - MBTI 헤더
      //Type6. [좌]전체메뉴   [우]통합검색             - 코브랜드 헤더
      //Type7. [좌]전체메뉴   [우]통합검색,전체도시     - DCR 헤더
      var headerType = 0;
      if (location.href.indexOf('mscheduler.hanatour.com') > -1) {
        //Type1.[좌]전체메뉴 [우]통합검색,전체도시 - 스케줄러 헤더
        headerType = 1;
      } else if (location.href.indexOf('?category=') > -1 || location.href.indexOf('mwtdom.hanatour.com') > -1) {
        //Type2.[좌]이전페이지 [우]찜,닷컴홈 - 웹투어/FND 상품목록 헤더
        headerType = 2;
      } else if (location.href === 'https://mfnd.hanatour.com/ko' || location.href.indexOf('mfnd.hanatour.com/ko?') > -1 || location.href.indexOf('mfnd.hanatour.com/ko/?') > -1 || location.href === 'https://dev-user-mobile.hanatour.com/ko') {
        //Type3.[좌]이전페이지 [우]통합검색,전체도시 - FND 홈 헤더
        headerType = 3;
      } else if (location.href.indexOf('mfnd.hanatour.com/ko/product/') > -1 || location.href.indexOf('dev-user-mobile.hanatour.com/ko/product/') > -1) {
        //Type4. [좌]이전페이지 [우]찜,닷컴홈 - FND 상품상세 헤더
        headerType = 4;
      } else if (location.href.indexOf('travel-style') > -1 || location.href.indexOf('overseas-travel') > -1) {
        //Type5. [좌]이전페이지 [우]공유하기,닷컴홈 - MBTI 헤더
        headerType = 5;
      } else if (isCobrand) {
        //Type6. [좌]전체메뉴 [우]통합검색 - 코브랜드 헤더
        headerType = 6;
      } else if (location.pathname == '/' || location.pathname == '/dcr/' || location.pathname == '/dcr') {
        //Type7. [좌]전체메뉴 [우]통합검색,전체도시 - DCR 헤더
        headerType = 7;
      }

      if (headerType === 1) {
        temps = '<!-- Type1. [\uC88C]\uC804\uCCB4\uBA54\uB274 [\uC6B0]\uD1B5\uD569\uAC80\uC0C9,\uC804\uCCB4\uB3C4\uC2DC - \uC2A4\uCF00\uC904\uB7EC \uD5E4\uB354 -->\n              <div class="sched_header">\n                <span class="progressbar"></span>\n                  <a href="#" onclick="WEBTOURFNC.rightMenuClick()" class="js_act btn_right_menu"><span>\uC804\uCCB4\uBA54\uB274</span></a>               \n                  <div class="top_btn_bundle">\n                    <a href="#" onclick="WEBTOURFNC.btnSearchClick()" class="js_act btn_search" ><span>\uD1B5\uD569 \uAC80\uC0C9</span></a>\n                    <a href="#" onclick="WEBTOURFNC.btnAllClick()" class="js_act btn_all"><span>\uC804\uCCB4 \uB3C4\uC2DC</span></a>\n                  </div>    \n              </div>\n            ';
      } else if (headerType === 2) {
        temps = '<!-- Type2. [\uC88C]\uC774\uC804\uD398\uC774\uC9C0 [\uC6B0]\uCC1C,\uB2F7\uCEF4\uD648 - \uC6F9\uD22C\uC5B4/FND \uC0C1\uD488\uBAA9\uB85D \uD5E4\uB354 -->\n                <span class="progressbar"></span>\n                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>\uC774\uC804\uD398\uC774\uC9C0</span></a>\n                  <div class="top_btn_bundle">\n                    <a href="' + webtourDomain + URLS['찜'] + '" class="btn_cart">\n                      <span>\uCC1C</span>\n                      <span class="alarm" style="display:' + wtjs.isWishView() + '">' + wtjs.wishListCnt() + '</span>\n                    </a>\n                    <a href="#" onclick="btnHomeClick()" class="btn_home"><span>\uD648</span></a>\n                  </div> \n            ';
      } else if (headerType === 3) {
        temps = '<!-- Type3. [\uC88C]\uC774\uC804\uD398\uC774\uC9C0 [\uC6B0]\uD1B5\uD569\uAC80\uC0C9,\uC804\uCCB4\uB3C4\uC2DC - FND \uD648 \uD5E4\uB354 -->\n                <span class="progressbar"></span>\n                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>\uC774\uC804\uD398\uC774\uC9C0</span></a>\n                  <div class="top_btn_bundle">\n                    <a href="javascript:WEBTOURFNC.js_act_btn_search()" class="js_act btn_search"><span>\uD1B5\uD569 \uAC80\uC0C9</span></a>\n                    <a href="' + webtourDomain + URLS['전체도시'] + '" class="js_act btn_all"><span>\uC804\uCCB4 \uB3C4\uC2DC</span></a>\n                  </div> \n            ';
      } else if (headerType === 4) {
        temps = '<!-- Type4. [\uC88C]\uC774\uC804\uD398\uC774\uC9C0 [\uC6B0]\uCC1C,\uB2F7\uCEF4\uD648 - FND \uC0C1\uD488\uC0C1\uC138 \uD5E4\uB354 -->\n                <span class="progressbar"></span>\n                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>\uC774\uC804\uD398\uC774\uC9C0</span></a>\n                  <div class="top_btn_bundle">\n                    <!--<a href="javascript:WEBTOURFNC.js_act_btn_share()" class="js_act btn_share"><span>\uACF5\uC720\uD558\uAE30</span></a>-->\n                    <a href="' + webtourDomain + URLS['찜'] + '" class="btn_cart">\n                      <span>\uCC1C</span>\n                      <span class="alarm" style="display:' + wtjs.isWishView() + '">' + wtjs.wishListCnt() + '</span>\n                    </a>\n                    <a href="#" onclick="btnHomeClick()" class="btn_home"><span>\uD648</span></a>\n                  </div> \n            ';
      } else if (headerType === 5) {
        temps = '<!-- Type5. [\uC88C]\uC774\uC804\uD398\uC774\uC9C0 [\uC6B0]\uACF5\uC720\uD558\uAE30,\uB2F7\uCEF4\uD648 - MBTI \uD5E4\uB354 -->\n                <span class="progressbar"></span>\n                  <a href="#" onclick="window.goMbtiBack()" class="js_act btn_prev_none"><span>\uC774\uC804\uD398\uC774\uC9C0</span></a>\n                  <h1 class="title">' + wtjs.pageTitle() + '</h1>\n                  ' + (location.href.indexOf('shared-result') > -1 ? '<div class="top_btn_bundle" style="display:none">' : '<div class="top_btn_bundle">') + '\n                    <a href="javascript:WEBTOURFNC.js_act_btn_share()" onclick="window.setShareData()" class="js_act btn_share"><span>\uACF5\uC720\uD558\uAE30</span></a>\n                    <a href="#" onclick="btnHomeClick()" class="btn_home"><span>\uD648</span></a>\n                  </div> \n            ';
      } else if (headerType === 6) {
        temps = '<!-- Type6. [\uC88C]\uC804\uCCB4\uBA54\uB274 [\uC6B0]\uD1B5\uD569\uAC80\uC0C9 - \uCF54\uBE0C\uB79C\uB4DC \uD5E4\uB354 -->\n                <span class="progressbar"></span>\n                  <a href="#" onclick="WEBTOURFNC.rightMenuClick()" class="js_act btn_right_menu"><span>\uC804\uCCB4\uBA54\uB274</span></a>   \n                  <span onmouseover="wtjs.headerLogo()" id="ic_header_logo" class="ic_header_logo"></span>                           \n                  <div class="top_btn_bundle">\n                    <a href="#" onclick="WEBTOURFNC.btnSearchClick()" class="js_act btn_search" ><span>\uD1B5\uD569 \uAC80\uC0C9</span></a>\n                  </div> \n            ';
      } else if (headerType === 7) {
        temps = '<!-- Type7. [\uC88C]\uC804\uCCB4\uBA54\uB274 [\uC6B0]\uD1B5\uD569\uAC80\uC0C9,\uC804\uCCB4\uB3C4\uC2DC - DCR \uD5E4\uB354 -->\n                <span class="progressbar"></span>\n                  <a href="#" onclick="WEBTOURFNC.rightMenuClick()" class="js_act btn_right_menu"><span>\uC804\uCCB4\uBA54\uB274</span></a>   \n                  <span onmouseover="wtjs.headerLogo()" id="ic_header_logo" class="ic_header_logo"></span>                           \n                  <div class="top_btn_bundle">\n                    <a href="#" onclick="WEBTOURFNC.btnSearchClick()" class="js_act btn_search" ><span>\uD1B5\uD569 \uAC80\uC0C9</span></a>\n                    <a href="#" onclick="WEBTOURFNC.btnAllClick()" class="js_act btn_all"><span>\uC804\uCCB4\uB3C4\uC2DC</span></a>\n                  </div> \n            ';
      } else {
        temps = '<!-- Type0. [\uC88C]\uC774\uC804\uD398\uC774\uC9C0 - default \uD5E4\uB354 -->\n                <span class="progressbar"></span>\n                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>\uC774\uC804\uD398\uC774\uC9C0</span></a>\n                  <div class="top_btn_bundle">\n                  </div> \n            ';
      }
      return temps;
    }, //end: headerWrite: function() {
    headerTypeChange: function headerTypeChange() {
      var str = [];
      /* headerType 정의 */
      //Type0. [좌]이전페이지                          - default 헤더
      //Type1. [좌]전체메뉴   [우]통합검색,전체도시     - 스케줄러 헤더
      //Type2. [좌]이전페이지 [우]찜,닷컴홈           - 웹투어/FND 상품목록 헤더
      //Type3. [좌]이전페이지 [우]통합검색,전체도시      - FND 홈 헤더
      //Type4. [좌]이전페이지 [우]찜,닷컴홈 - FND 상품상세 헤더
      //Type5. [좌]이전페이지 [우]공유하기,닷컴홈 - MBTI 헤더
      //Type6. [좌]전체메뉴   [우]통합검색             - 코브랜드 헤더
      //Type7. [좌]전체메뉴   [우]통합검색,전체도시     - DCR 헤더
      var headerType = 0;
      if (location.href.indexOf('mscheduler.hanatour.com') > -1) {
        //Type1.[좌]전체메뉴 [우]통합검색,전체도시 - 스케줄러 헤더
        headerType = 1;
      } else if (location.href.indexOf('?category=') > -1 || location.href.indexOf('mwtdom.hanatour.com') > -1) {
        //Type2.[좌]이전페이지 [우]찜,닷컴홈 - 웹투어/FND 상품목록 헤더
        headerType = 2;
      } else if (location.href === 'https://mfnd.hanatour.com/ko' || location.href.indexOf('mfnd.hanatour.com/ko?') > -1 || location.href.indexOf('mfnd.hanatour.com/ko/?') > -1 || location.href === 'https://dev-user-mobile.hanatour.com/ko') {
        //Type3.[좌]이전페이지 [우]통합검색,전체도시 - FND 홈 헤더
        headerType = 3;
      } else if (location.href.indexOf('mfnd.hanatour.com/ko/product/') > -1 || location.href.indexOf('dev-user-mobile.hanatour.com/ko/product/') > -1) {
        //Type4. [좌]이전페이지 [우]찜,닷컴홈 - FND 상품상세 헤더
        headerType = 4;
      } else if (location.href.indexOf('travel-style') > -1 || location.href.indexOf('overseas-travel') > -1) {
        //Type5. [좌]이전페이지 [우]공유하기,닷컴홈 - MBTI 헤더
        headerType = 5;
      } else if (isCobrand) {
        //Type6. [좌]전체메뉴 [우]통합검색 - 코브랜드 헤더
        headerType = 6;
      } else if (location.pathname == '/' || location.pathname == '/dcr/' || location.pathname == '/dcr') {
        //Type7. [좌]전체메뉴 [우]통합검색,전체도시 - DCR 헤더
        headerType = 7;
      }

      if (headerType === 1) {
        str = '<!-- Type1. [\uC88C]\uC804\uCCB4\uBA54\uB274 [\uC6B0]\uD1B5\uD569\uAC80\uC0C9,\uC804\uCCB4\uB3C4\uC2DC - \uC2A4\uCF00\uC904\uB7EC \uD5E4\uB354 -->\n              <div class="sched_header">\n                <span class="progressbar"></span>\n                  <a href="#" onclick="WEBTOURFNC.rightMenuClick()" class="js_act btn_right_menu"><span>\uC804\uCCB4\uBA54\uB274</span></a>               \n                  <div class="top_btn_bundle">\n                    <a href="#" onclick="WEBTOURFNC.btnSearchClick()" class="js_act btn_search" ><span>\uD1B5\uD569 \uAC80\uC0C9</span></a>\n                    <a href="#" onclick="WEBTOURFNC.btnAllClick()" class="js_act btn_all"><span>\uC804\uCCB4 \uB3C4\uC2DC</span></a>\n                  </div>    \n              </div>\n            ';
      } else if (headerType === 2) {
        str = '<!-- Type2. [\uC88C]\uC774\uC804\uD398\uC774\uC9C0 [\uC6B0]\uCC1C,\uB2F7\uCEF4\uD648 - \uC6F9\uD22C\uC5B4/FND \uC0C1\uD488\uBAA9\uB85D \uD5E4\uB354 -->\n                <span class="progressbar"></span>\n                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>\uC774\uC804\uD398\uC774\uC9C0</span></a>\n                  <div class="top_btn_bundle">\n                    <a href="' + webtourDomain + URLS['찜'] + '" class="btn_cart">\n                      <span>\uCC1C</span>\n                      <span class="alarm" style="display:' + wtjs.isWishView() + '">' + wtjs.wishListCnt() + '</span>\n                    </a>\n                    <a href="#" onclick="btnHomeClick()" class="btn_home"><span>\uD648</span></a>\n                  </div> \n            ';
      } else if (headerType === 3) {
        str = '<!-- Type3. [\uC88C]\uC774\uC804\uD398\uC774\uC9C0 [\uC6B0]\uD1B5\uD569\uAC80\uC0C9,\uC804\uCCB4\uB3C4\uC2DC - FND \uD648 \uD5E4\uB354 -->\n                <span class="progressbar"></span>\n                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>\uC774\uC804\uD398\uC774\uC9C0</span></a>\n                  <div class="top_btn_bundle">\n                    <a href="javascript:WEBTOURFNC.js_act_btn_search()" class="js_act btn_search"><span>\uD1B5\uD569 \uAC80\uC0C9</span></a>\n                    <a href="' + webtourDomain + URLS['전체도시'] + '" class="js_act btn_all"><span>\uC804\uCCB4 \uB3C4\uC2DC</span></a>\n                  </div> \n            ';
      } else if (headerType === 4) {
        str = '<!-- Type4. [\uC88C]\uC774\uC804\uD398\uC774\uC9C0 [\uC6B0]\uCC1C,\uB2F7\uCEF4\uD648 - FND \uC0C1\uD488\uC0C1\uC138 \uD5E4\uB354 -->\n                <span class="progressbar"></span>\n                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>\uC774\uC804\uD398\uC774\uC9C0</span></a>\n                  <div class="top_btn_bundle">\n                    <!--<a href="javascript:WEBTOURFNC.js_act_btn_share()" class="js_act btn_share"><span>\uACF5\uC720\uD558\uAE30</span></a>-->\n                    <a href="' + webtourDomain + URLS['찜'] + '" class="btn_cart">\n                      <span>\uCC1C</span>\n                      <span class="alarm" style="display:' + wtjs.isWishView() + '">' + wtjs.wishListCnt() + '</span>\n                    </a>\n                    <a href="#" onclick="btnHomeClick()" class="btn_home"><span>\uD648</span></a>\n                  </div> \n            ';
      } else if (headerType === 5) {
        str = '<!-- Type5. [\uC88C]\uC774\uC804\uD398\uC774\uC9C0 [\uC6B0]\uACF5\uC720\uD558\uAE30,\uB2F7\uCEF4\uD648 - MBTI \uD5E4\uB354 -->\n                <span class="progressbar"></span>\n                  <a href="#" onclick="window.goMbtiBack()" class="js_act btn_prev_none"><span>\uC774\uC804\uD398\uC774\uC9C0</span></a>\n                  <h1 class="title">' + wtjs.pageTitle() + '</h1>\n                  ' + (location.href.indexOf('shared-result') > -1 ? '<div class="top_btn_bundle" style="display:none">' : '<div class="top_btn_bundle">') + '\n                    <a href="javascript:WEBTOURFNC.js_act_btn_share()" onclick="window.setShareData()" class="js_act btn_share"><span>\uACF5\uC720\uD558\uAE30</span></a>\n                    <a href="#" onclick="btnHomeClick()" class="btn_home"><span>\uD648</span></a>\n                  </div> \n            ';
      } else if (headerType === 6) {
        str = '<!-- Type6. [\uC88C]\uC804\uCCB4\uBA54\uB274 [\uC6B0]\uD1B5\uD569\uAC80\uC0C9 - \uCF54\uBE0C\uB79C\uB4DC \uD5E4\uB354 -->\n                <span class="progressbar"></span>\n                  <a href="#" onclick="WEBTOURFNC.rightMenuClick()" class="js_act btn_right_menu"><span>\uC804\uCCB4\uBA54\uB274</span></a>   \n                  <span onmouseover="wtjs.headerLogo()" id="ic_header_logo" class="ic_header_logo"></span>                           \n                  <div class="top_btn_bundle">\n                    <a href="#" onclick="WEBTOURFNC.btnSearchClick()" class="js_act btn_search" ><span>\uD1B5\uD569 \uAC80\uC0C9</span></a>\n                  </div> \n            ';
      } else if (headerType === 7) {
        str = '<!-- Type7. [\uC88C]\uC804\uCCB4\uBA54\uB274 [\uC6B0]\uD1B5\uD569\uAC80\uC0C9,\uC804\uCCB4\uB3C4\uC2DC - DCR \uD5E4\uB354 -->\n                <span class="progressbar"></span>\n                <a href="#" onclick="WEBTOURFNC.rightMenuClick()" class="js_act btn_right_menu"><span>\uC804\uCCB4\uBA54\uB274</span></a>\n                  <span onmouseover="wtjs.headerLogo()" id="ic_header_logo" class="ic_header_logo"></span>               \n                  <div class="top_btn_bundle">\n                    <a href="#" onclick="WEBTOURFNC.btnSearchClick()" class="js_act btn_search" ><span>\uD1B5\uD569 \uAC80\uC0C9</span></a>\n                    <a href="#" onclick="WEBTOURFNC.btnAllClick()" class="js_act btn_all"><span>\uC804\uCCB4\uB3C4\uC2DC</span></a>\n                  </div> \n            ';
      } else {
        str = '<!-- Type0. [\uC88C]\uC774\uC804\uD398\uC774\uC9C0 - default \uD5E4\uB354 -->\n                <span class="progressbar"></span>\n                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>\uC774\uC804\uD398\uC774\uC9C0</span></a>\n                  <div class="top_btn_bundle">\n                  </div> \n            ';
      }
      document.querySelector('#header').innerHTML = str;
    },
    cobrand: function cobrand(type) {
      var str = '';
      if (!isCobrand) {
        //닷컴 footer
        if (type == 'footer') {
          str = '<div class="office_info_wrap">\n                    <a class="header" href="#footer_aco" id="btn_aco" onClick="WEBTOURFNC.btn_aco()">(\uC8FC)\uD558\uB098\uD22C\uC5B4</a>\n                    <ul class="office_info view" id="footer_aco" style="display: none;">\n                      <li>\uB300\uD45C\uC790 : \uC1A1\uBBF8\uC120, \uC721\uACBD\uAC74</li>\n                      <li>\uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638 : 102-81-39440 <a href="' + URLS['사업자정보확인'] + '">\uC0AC\uC5C5\uC790\uC815\uBCF4\uD655\uC778</a></li>\n                      <li>\uD1B5\uC2E0\uD310\uB9E4\uC5C5\uC2E0\uACE0\uBC88\uD638 : \uC885\uB85C01-1806\uD638</li>\n                      <li>03161 \uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uC885\uB85C\uAD6C \uC778\uC0AC\uB3D9 5\uAE38 41</li>\n                      <li>\uD558\uB098\uD22C\uC5B4 \uACE0\uAC1D\uC13C\uD130 : <a href="tel:1577-1233">1577-1233</a> FAX : 02-734-0392</li>\n                      <li>\uC774\uBA54\uC77C : <a href="mailto:15771233@hanatour.com">15771233@hanatour.com</a></li>\n                      <li>\uD638\uC2A4\uD305 \uC11C\uBE44\uC2A4 \uC0AC\uC5C5\uC790 : (\uC8FC)\uD558\uB098\uD22C\uC5B4</li>\n                      <li>\uAC1C\uC778\uC815\uBCF4\uBCF4\uD638\uCC45\uC784\uC790 : \uCC44\uCCA0\uD6C8</li>\n                      <li>\uAD00\uAD11\uC0AC\uC5C5\uC790 \uB4F1\uB85D\uBC88\uD638 : \uC81C1993-000006\uD638</li>\n                      <li>\uC601\uC5C5\uBCF4\uC99D\uBCF4\uD5D8 : 22\uC5B5 1\uCC9C\uB9CC\uC6D0 \uAC00\uC785</li>\n                    </ul>\n                    <ul class="office_info">\n                      <li><br></li>\n                      <li>\u203B \uBD80\uB4DD\uC774\uD55C \uC0AC\uC815\uC5D0 \uC758\uD574 \uC5EC\uD589\uC77C\uC815\uC774 \uBCC0\uACBD\uB418\uB294 \uACBD\uC6B0 \uC0AC\uC804 \uB3D9\uC758\uB97C \uBC1B\uC2B5\uB2C8\uB2E4.<br>\u203B \uD558\uB098\uD22C\uC5B4\uB294 \uAC1C\uBCC4 \uD56D\uACF5\uAD8C, \uB2E8\uD488 \uBC0F \uC77C\uBD80 \uC5EC\uD589\uC0C1\uD488\uC5D0 \uB300\uD558\uC5EC \uD1B5\uC2E0\uD310\uB9E4\uC911\uAC1C\uC790\uB85C\uC11C \uD1B5\uC2E0\uD310\uB9E4\uC758 \uB2F9\uC0AC\uC790\uAC00 \uC544\uB2C8\uBA70 \uD574\uB2F9\uC0C1\uD488\uC758 \uAC70\uB798\uC815\uBCF4 \uBC0F \uAC70\uB798\uB4F1\uC5D0 \uB300\uD574 \uCC45\uC784\uC744 \uC9C0\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.</li>\n                    </ul>\n                    <small>COPYRIGHT \u24D2 HANATOUR SERVICE INC.</small>\n                  </div>\n                ';
        }
        return str;
      }
      //코브랜드 footer
      var chnlDvCd = 'M';
      var dmnAdrs = currHostname;

      //API 호출
      var xhr = new XMLHttpRequest();
      xhr.open('GET', apiUrl + '/open/bboBcmApiCategory/getListBboBcmOpenApi?_siteId=' + webtourSiteId + '&chnlDvCd=' + chnlDvCd + '&dmnAdrs=' + dmnAdrs, false);
      xhr.send();
      var data = JSON.parse(xhr.response.replace(/^document.write\(\'/, '').replace(/\'\)\;/g, '').split('null').join('""'));

      if (data.resultMessage === 'SUCCESS') {
        var bboBcmInfoLst = data.getListBboBcmServiceConfig.bboBcmInfoLst[0];

        if (type == 'header') {
          var mblSiteGdncWrdngNm = '';
          if (bboBcmInfoLst.mblSiteGdncWrdngNm === null) {
            mblSiteGdncWrdngNm = '';
          } else {
            mblSiteGdncWrdngNm = bboBcmInfoLst.mblSiteGdncWrdngNm;
          }
          if (bboBcmInfoLst.hdrFotrStupDvCd === 'T') {
            //header - 기본형
            //console.log(':::: cobrand header - 기본형')
            str = '<div>\n                            <div class="co_brand" style="display: block;">\n                              <strong>' + bboBcmInfoLst.afcnNm + '</strong>\n                              <p>' + mblSiteGdncWrdngNm + '</p>\n                            </div>\n                          </div>';
          } else if (bboBcmInfoLst.hdrFotrStupDvCd === 'H') {
            //header - HTML형
            //console.log(':::: cobrand header - HTML형')
            str = '<div>\n                          <div class="co_brand html">\n                            ' + bboBcmInfoLst.htmlCdContHd + '\n                          </div>\n                        </div>';
          }
        } else if (type == 'footer') {
          var footerType = 1;
          if (bboBcmInfoLst.dtcmMainUseYn === 'N' && bboBcmInfoLst.dtcmSiteInfoUseYn === 'Y' && bboBcmInfoLst.hdrFotrStupDvCd === 'T') {
            footerType = 1; //footer - 기본형 & 닷컴동일o
          } else if (bboBcmInfoLst.dtcmMainUseYn === 'Y' && bboBcmInfoLst.dtcmSiteInfoUseYn === 'N' && bboBcmInfoLst.hdrFotrStupDvCd === 'T') {
            footerType = 2; //footer - 기본형 & 닷컴동일x
          } else if (bboBcmInfoLst.hdrFotrStupDvCd === 'H') {
            footerType = 3; //footer - HTML형
          }
          //console.log(':::: cobrand footer - ',footerType)
          if (footerType === 1) {
            //footer - 기본형 & 닷컴동일o
            str = '<div class="office_info_wrap">                      \n                                <a class="header" href="#footer_aco" id="btn_aco" onClick="WEBTOURFNC.btn_aco()">(\uC8FC)\uD558\uB098\uD22C\uC5B4</a>\n                                <ul class="office_info view" id="footer_aco" style="display: none;">\n                                  <li>\uB300\uD45C\uC790 : \uC1A1\uBBF8\uC120, \uC721\uACBD\uAC74</li>\n                                  <li>\uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638 : 102-81-39440 <a href="' + URLS['사업자정보확인'] + '">\uC0AC\uC5C5\uC790\uC815\uBCF4\uD655\uC778</a></li>\n                                  <li>\uD1B5\uC2E0\uD310\uB9E4\uC5C5\uC2E0\uACE0\uBC88\uD638 : \uC885\uB85C01-1806\uD638</li>\n                                  <li>03161 \uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uC885\uB85C\uAD6C \uC778\uC0AC\uB3D9 5\uAE38 41</li>\n                                  <li>\uD558\uB098\uD22C\uC5B4 \uACE0\uAC1D\uC13C\uD130 : <a href="tel:1577-1233">1577-1233</a> FAX : 02-734-0392</li>\n                                  <li>\uC774\uBA54\uC77C : <a href="mailto:15771233@hanatour.com">15771233@hanatour.com</a></li>\n                                  <li>\uD638\uC2A4\uD305 \uC11C\uBE44\uC2A4 \uC0AC\uC5C5\uC790 : (\uC8FC)\uD558\uB098\uD22C\uC5B4</li>\n                                  <li>\uAC1C\uC778\uC815\uBCF4\uBCF4\uD638\uCC45\uC784\uC790 : \uCC44\uCCA0\uD6C8</li>\n                                  <li>\uAD00\uAD11\uC0AC\uC5C5\uC790 \uB4F1\uB85D\uBC88\uD638 : \uC81C1993-000006\uD638</li>\n                                  <li>\uC601\uC5C5\uBCF4\uC99D\uBCF4\uD5D8 : 22\uC5B5 1\uCC9C\uB9CC\uC6D0 \uAC00\uC785</li>\n                                </ul>\n                                <ul class="office_info">\n                                  <li><br></li>\n                                  <li>\u203B \uBD80\uB4DD\uC774\uD55C \uC0AC\uC815\uC5D0 \uC758\uD574 \uC5EC\uD589\uC77C\uC815\uC774 \uBCC0\uACBD\uB418\uB294 \uACBD\uC6B0 \uC0AC\uC804 \uB3D9\uC758\uB97C \uBC1B\uC2B5\uB2C8\uB2E4.<br>\u203B \uD558\uB098\uD22C\uC5B4\uB294 \uAC1C\uBCC4 \uD56D\uACF5\uAD8C \uB2E8\uB3C5 \uD310\uB9E4\uC5D0 \uB300\uD558\uC5EC \uD1B5\uC2E0\uD310\uB9E4\uC911\uAC1C\uC790\uB85C\uC11C \uD1B5\uC2E0\uD310\uB9E4\uC758 \uB2F9\uC0AC\uC790\uAC00 \uC544\uB2C8\uBA70 \uD574\uB2F9\uC0C1\uD488\uC758 \uAC70\uB798\uC815\uBCF4 \uBC0F \uAC70\uB798\uB4F1\uC5D0 \uB300\uD574 \uCC45\uC784\uC744 \uC9C0\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.</li>\n                                </ul>\n                                <small>COPYRIGHT \u24D2 HANATOUR SERVICE INC.</small>\n                              </div>\n                            ';
          } else if (footerType === 2) {
            //footer - 기본형 & 닷컴동일x
            str = '<div class="office_info_wrap">                       \n                                <a class="header" href="#footer_aco" id="btn_aco" onClick="WEBTOURFNC.btn_aco()">(\uC8FC)\uD558\uB098\uD22C\uC5B4</a>\n                                <ul class="office_info" id="footer_aco" style="display: none;">\n                                  <li><strong>' + bboBcmInfoLst.afcnNm + '</strong></li>\n                                  <li>\uB300\uD45C\uC790 : ' + bboBcmInfoLst.rprnNm + '</li>\n                                  <li>\uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638 : ' + bboBcmInfoLst.bzmnNum + ' <a href="' + URLS['사업자정보확인'] + '">\uC0AC\uC5C5\uC790\uC815\uBCF4\uD655\uC778</a></li>\n                                  ' + (bboBcmInfoLst.cmncSlbsnNum ? '<li>\uD1B5\uC2E0\uD310\uB9E4\uC5C5\uC2E0\uACE0\uBC88\uD638 : ' + bboBcmInfoLst.cmncSlbsnNum + '</li>' : '') + '\n                                  <li>' + bboBcmInfoLst.zip + ' ' + bboBcmInfoLst.adrs + '</li>\n                                  <li>\uD558\uB098\uD22C\uC5B4 \uACE0\uAC1D\uC13C\uD130 : <a href="tel:' + bboBcmInfoLst.rpprTel + '">' + bboBcmInfoLst.rpprTel + '</a> FAX : ' + bboBcmInfoLst.faxn + '</li>\n                                  ' + (bboBcmInfoLst.emlAdrs ? '<li>\uC774\uBA54\uC77C : <a href="mailto:' + bboBcmInfoLst.emlAdrs + '">' + bboBcmInfoLst.emlAdrs + '</a></li>' : '') + '\n                                  <li>\uD638\uC2A4\uD305 \uC11C\uBE44\uC2A4 \uC0AC\uC5C5\uC790 : (\uC8FC)\uD558\uB098\uD22C\uC5B4</li>\n                                  ' + (bboBcmInfoLst.pdatSpvsNm ? '<li>\uAC1C\uC778\uC815\uBCF4\uBCF4\uD638\uCC45\uC784\uC790 : ' + bboBcmInfoLst.pdatSpvsNm + '</li>' : '') + '\n                                  ' + (bboBcmInfoLst.stsngBrn ? '<li>\uAD00\uAD11\uC0AC\uC5C5\uC790 \uB4F1\uB85D\uBC88\uD638 : ' + bboBcmInfoLst.stsngBrn + '</li>' : '') + '\n                                  <li>\uC601\uC5C5\uBCF4\uC99D\uBCF4\uD5D8 : 22\uC5B5 1\uCC9C\uB9CC\uC6D0 \uAC00\uC785</li>\n                                </ul>\n                                <small>COPYRIGHT \u24D2 HANATOUR SERVICE INC.</small>\n                              </div>\n                            ';
          } else if (footerType === 3) {
            //footer - HTML형
            str = '' + bboBcmInfoLst.htmlCdContFt;
          }
        }
      }
      return str;
    } //end: cobrandHeader()
  }, //end: ui: {
  swipe: {
    left: function left(wrapper, targets) {
      var objs = wrapper.querySelectorAll(targets);
      wrapper.appendChild(objs[0]);
    },
    right: function right(wrapper, targets) {
      var objs = wrapper.querySelectorAll(targets);
      wrapper.insertBefore(objs[objs.length - 1], wrapper.firstChild);
    },
    up: function up(wrapper, targets) {
      this.left(wrapper, targets);
    },
    down: function down(wrapper, targets) {
      this.right(wrapper, targets);
    }
  },
  //열기
  clickSearch: function clickSearch(obj, obj1, obj2) {
    var val = obj.value.replace(/^\s*|\s*$/g, '');
    /* if (val.length > 0) {
            //검색어 있으면
            obj1.style.display = 'none'
            obj2.style.display = 'block'
        } else {
            //검색어 없으면
            obj1.style.display = 'block'
            obj2.style.display = 'none'
        } */

    this.drawRecentlyKeywords(); //최근
    this.popularSearch(val); //인기ajax
    this.recommendSearch(val); //추천ajax
  },
  //닫기
  closeSearch: function closeSearch(obj) {
    obj.style.display = 'none';
  },
  //자동완성ajax
  autoSearch: function autoSearch(val, obj1, obj2) {
    var _val = val.replace(/^\s*|\s*$/g, '');
    if (_val.length > 0) {
      //검색어 있으면
      obj1.style.display = 'block';
      obj2.style.display = 'none';
    } else {
      //검색어 없으면
      obj1.style.display = 'none';
      obj2.style.display = 'block';
    }

    var params = {
      userMode: 'MO',
      keyword: _val
    };

    this.ajax(apiUrl + '/open/comItsApiCategory/getAtmtCmptTourApi?_siteId=' + webtourSiteId, { params: params, credentials: true }, function (data) {
      var str = '';

      if (data.resultMessage === 'SUCCESS') {
        var cmptConfig = data.getAtmtCmptConfig;

        var tripMap = cmptConfig.tripInfoMap || '';
        if (tripMap !== '') {
          str += wtjs.ui.autoSearch('pkg', '<em>' + cmptConfig.keyword + '</em> \uD328\uD0A4\uC9C0 \uBAA8\uB450 \uBCF4\uAE30');
          str += wtjs.ui.autoSearch('htl', '<em>' + cmptConfig.keyword + '</em> \uD638\uD154 \uBAA8\uB450 \uBCF4\uAE30');
          str += wtjs.ui.autoSearch('air', '<em>' + cmptConfig.keyword + '</em> \uD56D\uACF5\uAD8C \uBAA8\uB450 \uBCF4\uAE30');
          str += wtjs.ui.autoSearch('info', '<em>' + cmptConfig.keyword + '</em> \uC5EC\uD589\uC815\uBCF4 \uBAA8\uB450 \uBCF4\uAE30');
        }

        var list2 = cmptConfig.packageList || '';
        if (list2 !== '') {
          for (var i = 0; i < list2.length; i++) {
            str += wtjs.ui.autoSearch('pkg', list2[i].packageTitle);
          }
        }

        var list3 = cmptConfig.hotelList || '';
        if (list3 !== '') {
          for (var _i = 0; _i < list3.length; _i++) {
            str += wtjs.ui.autoSearch('htl', list3[_i].hotelTitle);
          }
        }

        var list1 = cmptConfig.autoCompleteList || '';
        if (list1 !== '') {
          for (var _i2 = 0; _i2 < list1.length; _i2++) {
            str += wtjs.ui.autoSearch('pos', list1[_i2]);
          }
        }
      } else {
        str += wtjs.ui.dataNo('최근 검색어 내역이 없습니다.');
      }

      document.querySelector('ul.list_autocomplete').innerHTML = str;
    });
  },
  drawRecentlyKeywords: function drawRecentlyKeywords() {
    // [MGTT-1349]@hslee - 외부 헤더에서 최근 검색어를 쿠키로 관리
    var recentlyKeywords = this.getCookie(this.RECENTLY_COOKIE_NAME);
    recentlyKeywords = recentlyKeywords && JSON.parse(recentlyKeywords).reverse() || [];
    var keywordsHtmlString = '';

    if (recentlyKeywords.length > 0) {
      for (var i = 0; i < recentlyKeywords.length; i++) {
        keywordsHtmlString += wtjs.ui.getRecentlyKeywordHtml(recentlyKeywords[i]);
      }
    } else {
      keywordsHtmlString += wtjs.ui.dataNo('최근 검색어 내역이 없습니다.');
      document.querySelector('a.js_act_all').style.display = 'none';
    }
    document.querySelector('ul.list_srchword.type').innerHTML = keywordsHtmlString;

    // [QA-4156] 최종적으로 최근 검색어가 있으면 해당 탭 on
    if (recentlyKeywords.length > 0) {
      WEBTOURFNC.js_tabs01();
    }
  },
  //인기ajax
  popularSearch: function popularSearch(val) {
    var params = {
      userMode: 'MO'
    };
    this.ajax(apiUrl + '/open/comItsApiCategory/getPpltSrwrTourApi?_siteId=' + webtourSiteId, { params: params, credentials: true }, function (data) {
      var str = '';

      if (data.resultMessage === 'SUCCESS') {
        var list = data.getPpltSrwrConfig.popularWord;
        for (var i = 0; i < list.length; i++) {
          str += wtjs.ui.popularSearch(i, list[i].keyword);
        }
      } else {
        str += wtjs.ui.dataNo('인기 검색어 내역이 없습니다.');
      }

      document.querySelector('ol.list_srchword.type').innerHTML = str;
    });
  }, //end: popularSearch: function (val) {
  //추천ajax
  recommendSearch: function recommendSearch(val) {
    var getParams = '&srwrDvCd=SWD02&srwrExprDvCd=M&srwrNm='; //Pc,Mobile에 따라 구분필요
    this.ajax(apiUrl + '/open/comSrhApiCategory/getListSrhTourApi?_siteId=' + webtourSiteId + getParams, { credentials: true, method: 'GET' }, function (data) {
      /* data = {
                  bizResCd: "0000",
                  getListSrhConfig: {
                      popularWordCount: 3306,
                      srwrMgmtLst: [{ srwrNm: "방콕", rnum: 1, oppbYn: "Y", srwrSrn: "SW00400328", lnkUrlAdrs: null, lnkSrwrNm: "방콕" },
                      { srwrNm: "하와이는 미국땅", rnum: 2, oppbYn: "Y", srwrSrn: "SW00400328", lnkUrlAdrs: null, lnkSrwrNm: "하와이" },
                      { srwrNm: "대마도는 한국땅", rnum: 3, oppbYn: "Y", srwrSrn: "SW00400328", lnkUrlAdrs: null, lnkSrwrNm: "한국" },
                      { srwrNm: "방콕땅", rnum: 4, oppbYn: "Y", srwrSrn: "SW00400328", lnkUrlAdrs: null, lnkSrwrNm: "방콕" },
                      { srwrNm: "베트남땅", rnum: 5, oppbYn: "Y", srwrSrn: "SW00400328", lnkUrlAdrs: null, lnkSrwrNm: "베트남" }]
                  },
                  logKey: "20200420f2185a7c55e249a2b723719260d96ed8.001",
                  result: "200",
                  resultMessage: "SUCCESS"
              } */

      var str = '';

      if (data.resultMessage === 'SUCCESS') {
        var list = data.getListSrhConfig.srwrMgmtLst;
        for (var i = 0; i < list.length; i++) {
          str += wtjs.ui.recommendSearch('hashtag tag_hash2', list[i].srwrNm, list[i].lnkSrwrNm);
        }
      } else {
        // str += wtjs.ui.dataNo("추천 검색어 내역이 없습니다.")
        str += '';
      }

      document.querySelector('div.hash_group').innerHTML = str;
    });
  }, //end: recommendSearch: function (val) {
  removeKeyword: function removeKeyword() {
    var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    // [MGTT-1349]@hslee - 외부 헤더에서 최근 검색어를 쿠키로 관리
    var recentlyKeywords = this.getCookie(this.RECENTLY_COOKIE_NAME);
    recentlyKeywords = recentlyKeywords && JSON.parse(recentlyKeywords).reverse() || [];

    if (val) {
      // 'DEL' 단품 삭제
      if (recentlyKeywords.indexOf(val) > -1) {
        recentlyKeywords = recentlyKeywords.filter(function (keyword) {
          return keyword !== val;
        });
      }
    } else {
      // 'DELALL' 전체 삭제
      recentlyKeywords = [];
    }

    this.setCookie(this.RECENTLY_COOKIE_NAME, JSON.stringify(recentlyKeywords));
    this.drawRecentlyKeywords();
  },
  saveKeyword: function saveKeyword() {
    var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var callback = arguments[1];

    // [MGTT-1349]@hslee - 외부 헤더에서 최근 검색어를 쿠키로 관리
    if (!val) {
      return false;
    }
    var recentlyKeywords = this.getCookie(this.RECENTLY_COOKIE_NAME);
    recentlyKeywords = recentlyKeywords && JSON.parse(recentlyKeywords).reverse() || [];

    // [QA-1433]@hslee - 외부헤더 최근 검색어 최대 갯수
    if (recentlyKeywords.length >= this.MAX_COOKIE_SIZE) {
      // [1,2,3,4,5,6,7,8,9,10, 11, 12] => [4,5,6,7,8,9,10, 11, 12]
      recentlyKeywords = recentlyKeywords.splice(recentlyKeywords.length - this.MAX_COOKIE_SIZE + 1, this.MAX_COOKIE_SIZE);
    }

    // 기존 쿠키에 존재하는 키워드라면 삭제. 이후 다시 추가
    if (recentlyKeywords.indexOf(val) > -1) {
      recentlyKeywords.splice(recentlyKeywords.indexOf(val), 1);
    }
    recentlyKeywords.push(val);

    this.setCookie(this.RECENTLY_COOKIE_NAME, JSON.stringify(recentlyKeywords));
    callback && callback();
  }, //end: saveKeyword: function (val = "", callback) {
  //ajax
  ajax: function ajax(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var callback = arguments[2];

    var xhr = new XMLHttpRequest();
    var credentials = (data.credentials || '') === '' ? false : data.credentials === false ? false : true;
    xhr.open((data.method || '') === '' ? 'POST' : data.method, url);
    xhr.withCredentials = credentials;
    xhr.onload = function () {
      callback(JSON.parse(xhr.response));
    };
    xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
    xhr.setRequestHeader('prgmId', '/'); // "EX00000001"
    if (data.params !== undefined && _typeof(data.params) === 'object') {
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    }
    xhr.send(JSON.stringify(data.params || ''));
  },
  gnb: {
    height: function height(isWebtour) {
      return isWebtour ? '' : 'height: 116px;';
    } //end: height: function(isWebtour){
  }, //end: , gnb: {
  //페이지 타이틀 세팅
  pageTitle: function pageTitle() {
    var title = '';
    if (location.href.indexOf('travel-style') > -1) {
      title = '여행 스타일 테스트';
    } else if (location.href.indexOf('overseas-travel') > -1) {
      title = '해외여행 안전정보';
    }
    return title;
  },
  headerLogo: function headerLogo() {
    //상단로고
    animHeaderLogo.setDirection(1);
    animHeaderLogo.play();
  } //end: var wtjs = {

};var URLS = {
  //headers
  하나투어: '/', // /mma/smn/EX00000001
  로그인: '/com/lgi/CHPC0LGI0106M100',
  예약조회: '/com/lgi/CHPC0LGI0103M100',
  마이페이지: '/com/lgi/CHPC0LGI0114M100?redirectUri=%2Fcom%2Fmpg%2FCHPC0MPG0001M100&siteId=05',
  DCR마이페이지: '/com/lgi/CHPC0LGI0106M100?redirectUri=%2Fcom%2Fmpg%2FCHPC0MPG0001M100',
  장바구니: '/com/sbk/CHPC0COM0300M100',
  고객센터: '/com/cuc/CHPC0CUC0100M100',
  플레이스: '/com/area/main',
  플래너: schedulerDomain,
  공지사항: '/com/cuc/CHPC0CUC0004M100',
  최근본: '/com/etc/CHPC0CFD0003M100?selectedTab=recently',
  찜: '/com/etc/CHPC0CFD0003M100?selectedTab=wish',
  전체도시: '/com/area/popupCitysearchASP',
  //SNS
  facebook: 'https://m.facebook.com/HanaTour.fb',
  instagram: 'https://www.instagram.com/hanatour_official',
  blog: 'http://m.blog.hanatour.com/',
  kakaoplus: 'https://pf.kakao.com/_ftrPI',
  youtube: 'https://www.youtube.com/user/HanaTour',
  kakaostory: 'https://story.kakao.com/ch/hanatour',
  //footer
  회사소개: 'http://www.hanatourcompany.com/kor/main/main.asp?hanacode=main_bottom_01',
  이용약관: '/els/prv/CHPC0PRV0004M100',
  개인정보처리방침: '/els/prv/CHPC0PRV0002M100',
  여행약관: '/els/prv/CHPC0PRV0003M100',
  해외여행자보험: '/els/etc/CHPC0ETC0008M100',
  마케팅제휴: '/els/etc/CHPC0ETC0001M100',
  '공식인증예약센터 검색': '/els/etc/CHPC0ETC0004M100',
  사업자정보확인: 'http://www.ftc.go.kr/bizCommPop.do?wrkr_no=1028139440',
  travel_mark1: 'http://www.smartoutbound.or.kr/guide/html/guideInfo4.do?menu_code=0000000016',
  travel_mark2: 'http://www.eprivacy.or.kr/seal/mark.jsp?mark=e&code=2019-R055',
  travel_mark3: 'http://www.kca.go.kr/ccm/certSystemOutlineView.do' //end: var URLS = {

};
if (location.hostname === 'tmstgtour.hanatour.com') {
  webtourDomain = 'https://tmstgtour.hanatour.com'
}

document.write('\n\t<link rel="shortcut icon" href="https://image.hanatour.com/usr/static/img2/mobile/favicon.ico">\n\t<link data-n-head="true" type="text/css" rel="stylesheet" href="' + webtourDomain + '/assets/css/mobile/cp.css">\n\n\t<script src="' + webtourDomain + '/fx/lib/jquery-3.3.1.min.js"></script>\n\t<script src="' + webtourDomain + '/fx/js/fx-jquery.js"></script>\n\t<script src="' + webtourDomain + '/fx/js/fx-ui-lib.js"></script>\n\t<script src="' + webtourDomain + '/fx/js/fx-ui-mobile.js"></script>\n  <script src="' + webtourDomain + '/assets/js/lottie-5.9.4.js"></script>\n');

document.write('\n<div class="header_wrap">\n  ' + wtjs.ui.cobrand('header') + '\n  <div class="ribbon_popup" style="display: none;">\n    <span class="ir">\uB9E4\uC77C\uB9E4\uC77C \uBAA8\uBC14\uC77C \uD2B9\uAC00!<strong>\uD558\uB098\uD22C\uC5B4 \uC571</strong></span>\n    <a href="#" class="btn sml em">\uC571 \uB2E4\uC6B4\uBC1B\uAE30</a>\n    <a href="#" class="js_act btn_cls">\uB2EB\uAE30</a>\n  </div>\n\t<div id="header">\n    ' + wtjs.ui.headerType() + '\n\t</div>\n\t' + wtjs.init() + '\n</div>\n  ');

if (webtourDomain === 'http://local.hanatour.com:8000') {
  document.write('<div style="width: 100%; height: 300px; background: silver;"></div>');
}

var getPcUrl = function getPcUrl() {
  return location.href.indexOf('localhost') !== -1 ? 'http://localhost:9000/' : 'https://www.hanatour.com/';
};

var appInstall = {
  하나투어: {
    ios: 'https://itunes.apple.com/kr/app/hanatueodaskeom/id550971489?mt=8',
    android: 'intent://hanatour/#Intent;scheme=hanatour://dotcom.hanatour.com;package=com.hanatour.dotcom;end'
  },
  항공: {
    ios: 'https://itunes.apple.com/kr/app/hanapeuli-hang-gong/id724543589?mt=8',
    android: 'intent://hanatour/#Intent;scheme=hanafreeair://link;package=com.hanatour.hanafreeair;end'
  },
  호텔: {
    ios: 'https://itunes.apple.com/kr/app/hanapeuli-hotel/id896120310?mt=8',
    android: 'intent://hanatour/#Intent;scheme=tour-hotel://link?;package=kr.co.alocan.hanatour03;end'
  },
  하나free: {
    ios: 'https://itunes.apple.com/kr/app/hanafree/id724534617?mt=8',
    android: 'intent://hanatour/#Intent;scheme=hanatour://hanafree.hanatour.com;package=com.hanatour.hanafree;end'
  },
  하나티켓: {
    ios: 'https://itunes.apple.com/kr/app/hanaticket/id744791909?mt=8',
    android: 'intent://HanaTicket/#Intent;scheme=HanaTicket://;package=com.hana.freeticket;end'
  },
  getOs: function getOs() {
    var userAgent = navigator.userAgent;
    if (/iP(ad|hone|od)/.test(userAgent)) {
      return 'ios';
    } else if (userAgent.toLowerCase().indexOf('android') > -1) {
      return 'android';
    } else {
      return '';
    }
  },
  url: function url(str) {
    var os = this.getOs();
    return os === '' ? "javascript:alert('PC버전에서는 지원되지 않는 기능입니다.')" : this[str][os];
  }
};

var getHntHeader = function getHntHeader(params) {
  // if (params !== undefined) {
  //   if (params.isHomeBtn == true) {
  //     document.querySelector('#header .btn_home').style.display = 'inline'
  //   } else {
  //     document.querySelector('#header .btn_home').style.display = 'none'
  //   }
  // } else {
  //   document.querySelector('#header .btn_home').style.display = 'none'
  // }
};

window.onload = function () {
  //공유하기
  // document.querySelector('.btn_share').addEventListener('click', e => {
  // })
};

window.onpageshow = function (e) {
  //스케줄러 홈 최초 진입 - 스크롤 시, 헤더 색상 제어
  if (location.href.indexOf('mscheduler.hanatour.com') > -1) {
    $(window).scroll(function () {
      $('.header_wrap').addClass('sched_home');
      var height = $(document).scrollTop();
      if (height > 0) {
        $('.header_wrap').addClass('fixed');
      } else if (height == 0) {
        $('.header_wrap').removeClass('fixed');
      }
    });
  }
  // e.persisted || (window.performance && window.performance.navigation.type == 2) // IE, 크롬 포함
  if (e.persisted) {
    // history.back 이벤트일 경우
    window.location.reload();
  }
};
