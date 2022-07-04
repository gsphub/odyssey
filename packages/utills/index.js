// 6월 29일 기준

/**
 * 사용자 로그인 이후 검색어를 관리하기 위한 개인구별 값...
 */
if (wt_hnt_uid === undefined) {
  var wt_hnt_uid = ''
}
// wt_hnt_uid = "zJlhj45X3Fj7vGFfL2JRsBdXvyVxgKwvZRRKK2y6j4lyOxRlAAeOh1rnrluFio86";

/**
 * 웹투어/여행정보에서 전달해줘야할 값으로 동작중인 서버가 운영/비운영인지 구분할 값이다.
 */
if (wt_serv_env === undefined) {
  var wt_serv_env = 'prd'
}

// wt_serv_env 안넣어줄 경우 강제적으로 설정
// wt_serv_env = "prd";

/**
 * dotCom을 바라볼 주소를 결정한다.
 */
var getDotComUrl = function (env, device) {
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
  let result = {
    api: '',
    domain: '',
    imgDomain: '',
  }
  let _device = device === 'pc' ? '' : 'm'
  var isApp = isHybridApp()
  if (isApp) {
    _device = 'app'
  }
  let _urls = {
    local: {
      api: 'https://devapi.hanatour.com',
      domain: `${location.protocol}//${location.host}`,
    },
    dev: {
      api: 'https://devapi.hanatour.com',
      domain: `https://${_device}devtour.hanatour.com`,
    },
    stg: {
      api: 'https://stgapi.hanatour.com',
      domain: `https://${_device}stgtour.hanatour.com`,
    },
    tstg: {
      api: 'https://stgapi.hanatour.com',
      domain: `https://t${_device}stgtour.hanatour.com`,
    },
    www2: {
      api: 'https://api.hanatour.com',
      domain: `https://${_device === '' ? 'www' : _device}2.hanatour.com`,
    },
    qa: {
      api: 'https://qaapi.hanatour.com',
      domain: `https://${_device}qatour.hanatour.com`,
    },
  }

  //닷컴개발자 환경이면
  let hrefs = ['local', 'stg', 'tstg', 'dev', 'www2', 'qa-', 'qa']
  for (let i = 0; i < hrefs.length; i++) {
    if (location.href.indexOf(hrefs[i]) !== -1) {
      if (hrefs[i] === 'dev') {
        result.api = _urls[hrefs[i]].api
        result.domain = _urls[hrefs[i]].domain
        result.imgDomain = 'https://devimage.hanatour.com'
      } else if (
        hrefs[i] === 'qa-' ||
        hrefs[i] === 'stg' ||
        hrefs[i] === 'tstg'
      ) {
        result.api = _urls.stg.api
        result.domain = _urls.stg.domain
        result.imgDomain = 'https://devimage.hanatour.com'
      } else if (hrefs[i] === 'qa') {
        result.api = _urls.qa.api
        result.domain = _urls.qa.domain
        result.imgDomain = 'https://devimage.hanatour.com'
      } else {
        result.api = _urls[hrefs[i]].api
        result.domain = _urls[hrefs[i]].domain
        result.imgDomain = 'https://devimage.hanatour.com'
      }
      break
    }
  }

  //웹투어 dev환경 결제테스트를 위해 닷컴 stg 바라보도록 임시 처리
  if (location.href.indexOf('dev-mwtdom') > -1) {
    result.api = _urls.stg.api
    result.domain = _urls.stg.domain
    result.imgDomain = 'https://devimage.hanatour.com'
  }

  //웹투어 예약 페이지 - 네이티브 하단GNB 미노출 임시처리
  if (location.pathname === '/domestic/da_reserve_check.asp') {
    let isApp = isHybridApp()
    let isIOS = isIOSApp()
    let isDCR = isDCRApp()
    let param =
      '{"scheme":"dcr","tag":"hide","params":{"label":"gnbTabBar","type":"animation"}}'
    if (isApp) {
      if (isIOS !== 'Y' && isDCR) {
        //AOS
        //console.log(':::: 웹투어 예약 페이지(진입) - AOS 호출')
        window.htmlEventHandler.hanatourapp(param)
      }
    }
  }

  if (result.api === '') {
    //닷컴개발자 환경이 아니면
    if (env === 'prd') {
      //운영이면
      if (isApp === true) {
        result.api = 'https://api.hanatour.com' //api
        result.domain = 'https://apptour.hanatour.com' //링크연결 도메인
        result.imgDomain = 'https://image.hanatour.com'
      } else {
        result.api = 'https://api.hanatour.com' //api
        result.domain = 'https://m.hanatour.com' //링크연결 도메인
        result.imgDomain = 'https://image.hanatour.com'
      }
    } else {
      //운영이 아니면
      if (isApp === true) {
        result.api = 'https://stgapi.hanatour.com' //api
        result.domain = 'https://appstgtour.hanatour.com' //링크연결 도메인
        result.imgDomain = 'https://devimage.hanatour.com'
      } else {
        result.api = 'https://stgapi.hanatour.com' //api
        result.domain = 'https://mstgtour.hanatour.com' //링크연결 도메인
        result.imgDomain = 'https://devimage.hanatour.com'
      }
    }
  }

  return result
}
var wtDotComUrl = getDotComUrl(wt_serv_env, 'm')
// console.log(':::: wtDotComUrl : ',wtDotComUrl)
var apiUrl = wtDotComUrl.api //api 서버
var webtourDomain = wtDotComUrl.domain //링크 동작될 도메인
var imageDomain = wtDotComUrl.imgDomain
var webtourView = location.href.indexOf('info.hanatour.com') === -1 //웹투어인지 여행정보인지 판별
var webtourSiteId = 'hanatour' //siteId

//스케줄러 도메인 세팅
var schedulerDomain = 'https://mscheduler.hanatour.com/'
if (webtourDomain.indexOf('local') > -1 || webtourDomain.indexOf('dev') > -1) {
  //local,dev : dev-mscheduler
  schedulerDomain = 'https://dev-mscheduler.hanatour.com/'
} else if (
  webtourDomain.indexOf('stg') > -1 ||
  webtourDomain.indexOf('tstg') > -1 ||
  webtourDomain.indexOf('qa-') > -1
) {
  //stg,tstg,qa- : qa-mscheduler
  schedulerDomain = 'https://qa-mscheduler.hanatour.com/'
}

//코브랜드 여부
var currHostname = location.hostname
//var currHostname = 'mdevyanolja.hanatour.com' //(예시1)기본형 & 닷컴동일o (dtcmMainUseYn :  N / dtcmSiteInfoUseYn :  Y / hdrFotrStupDvCd :  T)
//var currHostname = 'mjiseung.hanatour.com'    //(예시2)기본형 & 닷컴동일x (dtcmMainUseYn :  Y / dtcmSiteInfoUseYn :  N / hdrFotrStupDvCd :  T)
//var currHostname = 'mdevskhynix.hanatour.com' //(예시3)HTML형            (dtcmMainUseYn :  N / dtcmSiteInfoUseYn :  Y / hdrFotrStupDvCd :  H)
var isCobrand =
  currHostname != 'local.hanatour.com' &&
  currHostname != 'mdevtour.hanatour.com' &&
  currHostname != 'mstgtour.hanatour.com' &&
  currHostname != 'tmstgtour.hanatour.com' &&
  currHostname != 'm.hanatour.com' &&
  currHostname != 'appdevtour.hanatour.com' &&
  currHostname != 'appstgtour.hanatour.com' &&
  currHostname != 'tappstgtour.hanatour.com' &&
  currHostname != 'apptour.hanatour.com' &&
  currHostname != 'mperf.hanatour.com' &&
  currHostname != 'appperf.hanatour.com' &&
  currHostname != 'qa-mscheduler.hanatour.com' &&
  currHostname != 'mscheduler.hanatour.com' &&
  currHostname != 'dev-mwtdom.hanatour.com' &&
  currHostname != 'mwtdom.hanatour.com' &&
  currHostname != 'dev-user-mobile.hanatour.com' &&
  currHostname != 'mfnd.hanatour.com' &&
  currHostname != 'mqatour.hanatour.com' &&
  currHostname != 'appqatour.hanatour.com'
//위 도메인 이외에는 코브랜드로 인식
//코브랜드일 경우, 해당 코브랜드로 도메인 설정
if (isCobrand) {
  webtourDomain = location.origin
}
//console.log(':::: isCobrand : ',isCobrand)

function homeDomainFunc() {
  var result =
    location.href.split('//')[0] +
    '//' +
    location.href.split('//')[1].split('/')[0]
  return result
}

var homeDomain = homeDomainFunc()

/**
 * cookie값이 true면 로그인된 상태
 * cookie값이 false이거나 값이 없으면 로그아웃된 상태
 */
let _wtLogin = (function (key) {
  let _cookie = key + '='
  let cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    cookies[i] = cookies[i].replace(/^\s*|\s*$/g, '')

    if (cookies[i].indexOf(_cookie) !== -1) {
      return cookies[i].slice(_cookie.length, cookies[i].length)
    }
  }
  return ''
})('wtLogin')

// let isLoginFromHanatour = _wtLogin === '' ? false : _wtLogin === 'true'
// let isLoginFromHanatour = wt_hnt_uid !== ''; //하나투어로부터 로그인 했는지 판별
let isLoginFromHanatour =
  getCookie('hnt_uid') !== null && getCookie('hnt_uid') !== '' ? true : false

/**
 * PC footer에서만 사용하는 기능
 */
function changeFooterSelect(obj) {
  if (obj.value !== '') {
    window.open(obj.value, '_blank')
  }
}

function webtourRedirect(url) {
  return `${url}?redirectUri=${encodeURIComponent(location.href)}`
}

function wtLogout() {
  location.href = `${
    wtDotComUrl.domain
  }/com/lgi/logout?redirectUri=${encodeURIComponent(location.href)}`
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
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
  return value ? value[2] : null
}

function logInOut(status) {
  var token = wtjs.getCookie('hnt_uid')

  if (token !== null && token !== '') {
    // (status)
    return `<li style="flex:1 1 auto;"><a href="#" onclick='wtLogout()'>로그아웃</a></li>`
  } else if (isCobrand) {
    //코브랜드 footer
    let chnlDvCd = 'M'
    let dmnAdrs = currHostname

    //API 호출
    let xhr = new XMLHttpRequest()
    xhr.open(
      'GET',
      `${apiUrl}/open/bboBcmApiCategory/getListBboBcmOpenApi?_siteId=${webtourSiteId}&chnlDvCd=${chnlDvCd}&dmnAdrs=${dmnAdrs}`,
      false,
    )
    xhr.send()
    let data = JSON.parse(
      xhr.response
        .replace(/^document.write\(\'/, '')
        .replace(/\'\)\;/g, '')
        .split('null')
        .join('""'),
    )
    if (data.resultMessage === 'SUCCESS') {
      let bboBcmInfoLst = data.getListBboBcmServiceConfig.bboBcmInfoLst[0]
      if (bboBcmInfoLst.afcnResTrgtDvCd === '02') {
        return `<li style="flex:1 1 auto;"><a href="${webtourDomain}${URLS['예약조회']}">예약조회</a></li>`
      } else {
        return `<li style="flex:1 1 auto;"><a href="${webtourRedirect(
          webtourDomain + URLS['로그인'],
        )}">로그인</a></li>`
      }
    }
  } else {
    return `<li style="flex:1 1 auto;"><a href="${webtourRedirect(
      webtourDomain + URLS['로그인'],
    )}">로그인</a></li>`
  }
}

function isHybridApp() {
  var UserAgent = navigator.userAgent

  if (UserAgent.indexOf('hanatourApp') !== -1) {
    return true
  } else {
    return false
  }
}

function isIOSApp() {
  let userAgent = navigator.userAgent
  return /iP(ad|hone|od)/.test(userAgent) ? 'Y' : 'N'
}

function goBack() {
  // console.log(':::: history.length:', history.length)
  if (history.length === 1) {
    let isApp = isHybridApp()
    let isIOS = isIOSApp()
    // console.log(':::: isApp:', isApp, '/isIOS:', isIOS)
    if (isApp) {
      //뒤로가기 시 Native App인 경우, 앱을 호출한다
      let webMessage = {
        scheme: 'dcr',
        tag: 'home',
        params: {
          type: 'animation',
        },
      }
      if (isIOS === 'Y') {
        // console.log('[callNativeApi] IOS webMessage:', webMessage)
        window.webkit.messageHandlers.hanatourapp.postMessage(
          JSON.stringify(webMessage),
        )
      } else {
        // console.log('[callNativeApi] AOS webMessage:', webMessage)
        window.htmlEventHandler.hanatourapp(JSON.stringify(webMessage))
      }
    } else {
      location.href = '/'
    }
  } else {
    history.back()
  }
}

function btnHomeClick() {
  //홈
  //console.log(':::: btnHomeClick() call')
  let isIOS = isIOSApp()
  let isDCR = isDCRApp()
  var param = '{"scheme":"dcr", "tag":"home", "params":{"type":"animation"}}'
  if (isIOS === 'Y' && isDCR) {
    //IOS
    //console.log(':::: 홈 - IOS 호출')
    window.webkit.messageHandlers.hanatourapp.postMessage(param)
  } else if (isDCR) {
    //AOS
    //console.log(':::: 홈 - AOS 호출')
    window.htmlEventHandler.hanatourapp(param)
  } else {
    //console.log(':::: 홈 - WEBVIEW 호출')
    let moveUrl = webtourDomain
    location.href = moveUrl
  }
}

//CRM 태깅 - 통합검색 내
function setCrm(keyword, keywordCateg) {
  let isDCRMain = WEBTOURFNC.isDCRMain()
  if (!isDCRMain) {
    //console.log(':::: setCrm() skip')
    return
  }
  let isLoginFromHanatour =
    getCookie('hnt_uid') !== null && getCookie('hnt_uid') !== '' ? true : false
  try {
    let searchType =
      keywordCateg == 'DS'
        ? '직접 검색'
        : keywordCateg == 'SS'
        ? '샘플 검색어'
        : keywordCateg == 'RK'
        ? '추천키워드'
        : keywordCateg == 'RS'
        ? '추천검색어'
        : keywordCateg == 'PS'
        ? '인기검색어'
        : keywordCateg == 'SR'
        ? '급등검색어'
        : keywordCateg == 'TR'
        ? '연관검색어'
        : keywordCateg == 'AC'
        ? '자동완성'
        : keywordCateg == 'RE'
        ? '최근 검색어'
        : keywordCateg == 'SU'
        ? '검색어제안'
        : ''
    let crmParams = {}
    //검색어
    crmParams.keyword = keyword
    //usermode
    crmParams.usermode = 'MO'
    //loginId
    crmParams.loginId = isLoginFromHanatour
      ? $nuxt.$store.state.user.customerNumber
      : '' //로그인 여부에 따라 사용자 아이디 삽입 필요
    //검색방식
    crmParams.keywordCateg = searchType
    //console.log(":::: search crmParams : ", crmParams)
    WEBTOURFNC.setEvent('search', crmParams)
  } catch (e) {
    console.log(':::: setCrm search e : ', e)
  }
}

/**
 * DCR 앱 적용 여부
 * 하단GNB & 전체메뉴/통합검색 돋보기/전체도시 앱 분기 관련
 */
function isDCRApp() {
  let isApp = isHybridApp()
  let isIOS = isIOSApp()
  const IOS_DCR_VER = 630
  const ANDROID_DCR_VER = 872
  //IOS : "hanatourApp+332+iPhone12,1+414.0+ios14.8.1+MainWebView+6.3.0+Mozilla/5.0 (iPhone; CPU iPhone OS 14_8_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148" //샘플데이터
  //AOS : "hanatourApp+868+SM-G981N+31"//샘플데이터
  // console.log(':::: navigator.userAgent:',navigator.userAgent)
  if (isApp) {
    if (isIOS === 'Y') {
      //IOS
      let appVer = Number(navigator.userAgent.split('+')[6].replaceAll('.', ''))
      //console.log(':::: IOS appVer : ', appVer)
      if (appVer >= IOS_DCR_VER) {
        return true
      }
    } else {
      //AOS
      let appVer = Number(navigator.userAgent.split('+')[1])
      //console.log(':::: AOS appVer : ', appVer)
      if (appVer >= ANDROID_DCR_VER) {
        return true
      }
    }
  }
  return false
}

var wtjs = {
  RECENTLY_COOKIE_NAME: 'CHPC0ITS0001S100',
  MAX_COOKIE_SIZE: 20,
  isLoginFromHanatour: false,
  init: function () {
    document.domain = 'hanatour.com'
    this.isLoginFromHanatour = !!this.getCookie('hnt_uid')
    return ''
  },
  wishListCnt: function () {
    //찜 개수 api호출
    let wishCount = 0
    if (this.getCookie('hnt_uid') !== null) {
      let hnt_uid = encodeURIComponent(this.getCookie('hnt_uid'))
      let xhr = new XMLHttpRequest()
      xhr.open(
        'GET',
        `${apiUrl}/open/comSbkApiCategory/getWishCount?hnt_uid=${hnt_uid}`,
        false,
      )
      xhr.send()
      let wishCountRes = JSON.parse(
        xhr.response
          .replace(/^document.write\(\'/, '')
          .replace(/\'\)\;/g, '')
          .split('null')
          .join('""'),
      )
      if (wishCountRes.result === '200') {
        wishCount = wishCountRes.getWishCount.wishCnt
      }
    }
    return wishCount
  },
  isWishView: function () {
    //관심 개수 노출여부
    if (this.getCookie('hnt_uid') !== null && this.wishListCnt() > 0) {
      return 'block'
    } else {
      return 'none'
    }
  },
  linkProc: function (text, keywordCateg) {
    setCrm(text, keywordCateg) //CRM 태깅 - 통합검색 내
    let isApp = isHybridApp()
    // 최근/인기/추천 검색어 리스트 클릭
    if (text !== '') {
      if (text.indexOf('http') > -1) {
        //어드민에서 추천키워드가 URL형식으로 세팅된 경우
        if (text.indexOf('m.hanatour.com') > -1 && isApp) {
          //앱이면서 랜딩URL이 닷컴모바일 이라면, 닷컴앱으로 도메인 적용(앱 이탈 방지)
          text = text.replace('m.hanatour.com', 'apptour.hanatour.com')
        }
        location.href = text
      } else {
        wtjs.saveKeyword(text, (data) => {
          location.href = `${webtourDomain}/com/its/CHPC0ITS0002M100?keyword=${text}&keywordCateg=${keywordCateg}`
        })
      }
    }
  },
  setCookie: function (cookieName, cookieValue) {
    let cookieText = cookieName + '=' + encodeURIComponent(cookieValue)

    // $nuxt.$q.cookies.set() 의 expired : 10과 동일하게 처리하도록
    function addDays(days) {
      let result = new Date()
      result.setDate(result.getDate() + days)
      return result
    }
    function getDomainForSharingCookies() {
      const host = window.location.hostname
      return '.' + host.split('.').slice(-2).join('.')
    }
    cookieText += '; EXPIRES=' + addDays(10).toGMTString()
    cookieText += '; PATH=/'
    cookieText += '; DOMAIN=' + getDomainForSharingCookies()
    document.cookie = cookieText
  },
  getCookie: function (cookieName) {
    let cookieValue = null
    if (document.cookie) {
      const array = document.cookie.split(cookieName + '=')
      if (array.length >= 2) {
        const arraySub = array[1].split(';')
        cookieValue = arraySub[0]
      }
    }

    function isEncoded(value) {
      return typeof value === 'string' && decodeURIComponent(value) !== value
    }
    return isEncoded(cookieValue)
      ? decodeURIComponent(cookieValue)
      : cookieValue
  },
  deleteCookie: function (cookieName) {
    const temp = this.getCookie(cookieName)
    if (temp) {
      this.setCookie(cookieName, temp, new Date(1))
    }
  },
  ui: {
    autoSearch: function (iconName, val) {
      //iconNames: default/recom/pkg/air/htl/info/pos
      return `<li>
				<span class="icn ${iconName}"></span>
				<a href="#">${val}</a>
			</li>`
    },
    getRecentlyKeywordHtml: function (val) {
      return `<li><a href="#" onclick="wtjs.linkProc('${val}','RE')">${val}</a><a href="#" class="btn_del" onclick="wtjs.removeKeyword('${val}')">검색어 삭제</a></li>`
    }, //end: recentSearch: function(val) {
    popularSearch: function (idx, val) {
      //console.log('popularSearch: ', idx, val)

      let i = idx + 1
      return `<li>
				<span class="num">${i}</span>
				<a href="#" onclick="wtjs.linkProc('${val}','PS')">${val}</a>
			</li>`
    }, //end: popularSearch: function(idx, val) {
    recommendSearch: function (type = 'c1', val, lnkSrwrNm) {
      return `<a href="#" onclick="wtjs.linkProc('${lnkSrwrNm}','RK')" class='${type}'>#${val}</a>`
    },
    dataNo: function (val) {
      return `<div class="data_no">
				<div class="cont">
					<strong>${val}</strong>
				</div>
			</div>`
    },
    toggleMenuAll: function (obj1, obj2) {
      //obj1.classList.toggle("on")
      //obj2.classList.toggle("on")
    },
    headerType: function () {
      let temps = []
      /* headerType 정의 */
      //Type0. [좌]이전페이지                          - default 헤더
      //Type1. [좌]전체메뉴   [우]통합검색,전체도시     - 스케줄러 헤더
      //Type2. [좌]이전페이지 [우]찜,닷컴홈           - 웹투어/FND 상품목록 헤더
      //Type3. [좌]이전페이지 [우]통합검색,전체도시      - FND 홈 헤더
      //Type4. [좌]이전페이지 [우]찜,닷컴홈 - FND 상품상세 헤더
      //Type5. [좌]이전페이지 [우]공유하기,닷컴홈 - MBTI 헤더
      //Type6. [좌]전체메뉴   [우]통합검색             - 코브랜드 헤더
      //Type7. [좌]전체메뉴   [우]통합검색,전체도시     - DCR 헤더
      let headerType = 0
      if (location.href.indexOf('mscheduler.hanatour.com') > -1) {
        //Type1.[좌]전체메뉴 [우]통합검색,전체도시 - 스케줄러 헤더
        headerType = 1
      } else if (
        location.href.indexOf('?category=') > -1 ||
        location.href.indexOf('mwtdom.hanatour.com') > -1
      ) {
        //Type2.[좌]이전페이지 [우]찜,닷컴홈 - 웹투어/FND 상품목록 헤더
        headerType = 2
      } else if (
        location.href === 'https://mfnd.hanatour.com/ko' ||
        location.href.indexOf('mfnd.hanatour.com/ko?') > -1 ||
        location.href.indexOf('mfnd.hanatour.com/ko/?') > -1 ||
        location.href === 'https://dev-user-mobile.hanatour.com/ko'
      ) {
        //Type3.[좌]이전페이지 [우]통합검색,전체도시 - FND 홈 헤더
        headerType = 3
      } else if (
        location.href.indexOf('mfnd.hanatour.com/ko/product/') > -1 ||
        location.href.indexOf('dev-user-mobile.hanatour.com/ko/product/') > -1
      ) {
        //Type4. [좌]이전페이지 [우]찜,닷컴홈 - FND 상품상세 헤더
        headerType = 4
      } else if (
        location.href.indexOf('travel-style') > -1 ||
        location.href.indexOf('overseas-travel') > -1
      ) {
        //Type5. [좌]이전페이지 [우]공유하기,닷컴홈 - MBTI 헤더
        headerType = 5
      } else if (isCobrand) {
        //Type6. [좌]전체메뉴 [우]통합검색 - 코브랜드 헤더
        headerType = 6
      } else if (
        location.pathname == '/' ||
        location.pathname == '/dcr/' ||
        location.pathname == '/dcr'
      ) {
        //Type7. [좌]전체메뉴 [우]통합검색,전체도시 - DCR 헤더
        headerType = 7
      }

      if (headerType === 1) {
        temps = `<!-- Type1. [좌]전체메뉴 [우]통합검색,전체도시 - 스케줄러 헤더 -->
              <div class="sched_header">
                <span class="progressbar"></span>
                  <a href="#" onclick="WEBTOURFNC.rightMenuClick()" class="js_act btn_right_menu"><span>전체메뉴</span></a>               
                  <div class="top_btn_bundle">
                    <a href="#" onclick="WEBTOURFNC.btnSearchClick()" class="js_act btn_search" ><span>통합 검색</span></a>
                    <a href="#" onclick="WEBTOURFNC.btnAllClick()" class="js_act btn_all"><span>전체 도시</span></a>
                  </div>    
              </div>
            `
      } else if (headerType === 2) {
        temps = `<!-- Type2. [좌]이전페이지 [우]찜,닷컴홈 - 웹투어/FND 상품목록 헤더 -->
                <span class="progressbar"></span>
                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>이전페이지</span></a>
                  <div class="top_btn_bundle">
                    <a href="${webtourDomain}${URLS['찜']}" class="btn_cart">
                      <span>찜</span>
                      <span class="alarm" style="display:${wtjs.isWishView()}">${wtjs.wishListCnt()}</span>
                    </a>
                    <a href="#" onclick="btnHomeClick()" class="btn_home"><span>홈</span></a>
                  </div> 
            `
      } else if (headerType === 3) {
        temps = `<!-- Type3. [좌]이전페이지 [우]통합검색,전체도시 - FND 홈 헤더 -->
                <span class="progressbar"></span>
                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>이전페이지</span></a>
                  <div class="top_btn_bundle">
                    <a href="javascript:WEBTOURFNC.js_act_btn_search()" class="js_act btn_search"><span>통합 검색</span></a>
                    <a href="${webtourDomain}${URLS['전체도시']}" class="js_act btn_all"><span>전체 도시</span></a>
                  </div> 
            `
      } else if (headerType === 4) {
        temps = `<!-- Type4. [좌]이전페이지 [우]찜,닷컴홈 - FND 상품상세 헤더 -->
                <span class="progressbar"></span>
                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>이전페이지</span></a>
                  <div class="top_btn_bundle">
                    <!--<a href="javascript:WEBTOURFNC.js_act_btn_share()" class="js_act btn_share"><span>공유하기</span></a>-->
                    <a href="${webtourDomain}${URLS['찜']}" class="btn_cart">
                      <span>찜</span>
                      <span class="alarm" style="display:${wtjs.isWishView()}">${wtjs.wishListCnt()}</span>
                    </a>
                    <a href="#" onclick="btnHomeClick()" class="btn_home"><span>홈</span></a>
                  </div> 
            `
      } else if (headerType === 5) {
        temps = `<!-- Type5. [좌]이전페이지 [우]공유하기,닷컴홈 - MBTI 헤더 -->
                <span class="progressbar"></span>
                  <a href="#" onclick="window.goMbtiBack()" class="js_act btn_prev_none"><span>이전페이지</span></a>
                  <h1 class="title">${wtjs.pageTitle()}</h1>
                  ${
                    location.href.indexOf('shared-result') > -1
                      ? `<div class="top_btn_bundle" style="display:none">`
                      : `<div class="top_btn_bundle">`
                  }
                    <a href="javascript:WEBTOURFNC.js_act_btn_share()" onclick="window.setShareData()" class="js_act btn_share"><span>공유하기</span></a>
                    <a href="#" onclick="btnHomeClick()" class="btn_home"><span>홈</span></a>
                  </div> 
            `
      } else if (headerType === 6) {
        temps = `<!-- Type6. [좌]전체메뉴 [우]통합검색 - 코브랜드 헤더 -->
                <span class="progressbar"></span>
                  <a href="#" onclick="WEBTOURFNC.rightMenuClick()" class="js_act btn_right_menu"><span>전체메뉴</span></a>   
                  <span onmouseover="wtjs.headerLogo()" id="ic_header_logo" class="ic_header_logo"></span>                           
                  <div class="top_btn_bundle">
                    <a href="#" onclick="WEBTOURFNC.btnSearchClick()" class="js_act btn_search" ><span>통합 검색</span></a>
                  </div> 
            `
      } else if (headerType === 7) {
        temps = `<!-- Type7. [좌]전체메뉴 [우]통합검색,전체도시 - DCR 헤더 -->
                <span class="progressbar"></span>
                  <a href="#" onclick="WEBTOURFNC.rightMenuClick()" class="js_act btn_right_menu"><span>전체메뉴</span></a>   
                  <span onmouseover="wtjs.headerLogo()" id="ic_header_logo" class="ic_header_logo"></span>                           
                  <div class="top_btn_bundle">
                    <a href="#" onclick="WEBTOURFNC.btnSearchClick()" class="js_act btn_search" ><span>통합 검색</span></a>
                    <a href="#" onclick="WEBTOURFNC.btnAllClick()" class="js_act btn_all"><span>전체도시</span></a>
                  </div> 
            `
      } else {
        temps = `<!-- Type0. [좌]이전페이지 - default 헤더 -->
                <span class="progressbar"></span>
                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>이전페이지</span></a>
                  <div class="top_btn_bundle">
                  </div> 
            `
      }
      return temps
    }, //end: headerWrite: function() {
    headerTypeChange: function () {
      let str = []
      /* headerType 정의 */
      //Type0. [좌]이전페이지                          - default 헤더
      //Type1. [좌]전체메뉴   [우]통합검색,전체도시     - 스케줄러 헤더
      //Type2. [좌]이전페이지 [우]찜,닷컴홈           - 웹투어/FND 상품목록 헤더
      //Type3. [좌]이전페이지 [우]통합검색,전체도시      - FND 홈 헤더
      //Type4. [좌]이전페이지 [우]찜,닷컴홈 - FND 상품상세 헤더
      //Type5. [좌]이전페이지 [우]공유하기,닷컴홈 - MBTI 헤더
      //Type6. [좌]전체메뉴   [우]통합검색             - 코브랜드 헤더
      //Type7. [좌]전체메뉴   [우]통합검색,전체도시     - DCR 헤더
      let headerType = 0
      if (location.href.indexOf('mscheduler.hanatour.com') > -1) {
        //Type1.[좌]전체메뉴 [우]통합검색,전체도시 - 스케줄러 헤더
        headerType = 1
      } else if (
        location.href.indexOf('?category=') > -1 ||
        location.href.indexOf('mwtdom.hanatour.com') > -1
      ) {
        //Type2.[좌]이전페이지 [우]찜,닷컴홈 - 웹투어/FND 상품목록 헤더
        headerType = 2
      } else if (
        location.href === 'https://mfnd.hanatour.com/ko' ||
        location.href.indexOf('mfnd.hanatour.com/ko?') > -1 ||
        location.href.indexOf('mfnd.hanatour.com/ko/?') > -1 ||
        location.href === 'https://dev-user-mobile.hanatour.com/ko'
      ) {
        //Type3.[좌]이전페이지 [우]통합검색,전체도시 - FND 홈 헤더
        headerType = 3
      } else if (
        location.href.indexOf('mfnd.hanatour.com/ko/product/') > -1 ||
        location.href.indexOf('dev-user-mobile.hanatour.com/ko/product/') > -1
      ) {
        //Type4. [좌]이전페이지 [우]찜,닷컴홈 - FND 상품상세 헤더
        headerType = 4
      } else if (
        location.href.indexOf('travel-style') > -1 ||
        location.href.indexOf('overseas-travel') > -1
      ) {
        //Type5. [좌]이전페이지 [우]공유하기,닷컴홈 - MBTI 헤더
        headerType = 5
      } else if (isCobrand) {
        //Type6. [좌]전체메뉴 [우]통합검색 - 코브랜드 헤더
        headerType = 6
      } else if (
        location.pathname == '/' ||
        location.pathname == '/dcr/' ||
        location.pathname == '/dcr'
      ) {
        //Type7. [좌]전체메뉴 [우]통합검색,전체도시 - DCR 헤더
        headerType = 7
      }

      if (headerType === 1) {
        str = `<!-- Type1. [좌]전체메뉴 [우]통합검색,전체도시 - 스케줄러 헤더 -->
              <div class="sched_header">
                <span class="progressbar"></span>
                  <a href="#" onclick="WEBTOURFNC.rightMenuClick()" class="js_act btn_right_menu"><span>전체메뉴</span></a>               
                  <div class="top_btn_bundle">
                    <a href="#" onclick="WEBTOURFNC.btnSearchClick()" class="js_act btn_search" ><span>통합 검색</span></a>
                    <a href="#" onclick="WEBTOURFNC.btnAllClick()" class="js_act btn_all"><span>전체 도시</span></a>
                  </div>    
              </div>
            `
      } else if (headerType === 2) {
        str = `<!-- Type2. [좌]이전페이지 [우]찜,닷컴홈 - 웹투어/FND 상품목록 헤더 -->
                <span class="progressbar"></span>
                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>이전페이지</span></a>
                  <div class="top_btn_bundle">
                    <a href="${webtourDomain}${URLS['찜']}" class="btn_cart">
                      <span>찜</span>
                      <span class="alarm" style="display:${wtjs.isWishView()}">${wtjs.wishListCnt()}</span>
                    </a>
                    <a href="#" onclick="btnHomeClick()" class="btn_home"><span>홈</span></a>
                  </div> 
            `
      } else if (headerType === 3) {
        str = `<!-- Type3. [좌]이전페이지 [우]통합검색,전체도시 - FND 홈 헤더 -->
                <span class="progressbar"></span>
                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>이전페이지</span></a>
                  <div class="top_btn_bundle">
                    <a href="javascript:WEBTOURFNC.js_act_btn_search()" class="js_act btn_search"><span>통합 검색</span></a>
                    <a href="${webtourDomain}${URLS['전체도시']}" class="js_act btn_all"><span>전체 도시</span></a>
                  </div> 
            `
      } else if (headerType === 4) {
        str = `<!-- Type4. [좌]이전페이지 [우]찜,닷컴홈 - FND 상품상세 헤더 -->
                <span class="progressbar"></span>
                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>이전페이지</span></a>
                  <div class="top_btn_bundle">
                    <!--<a href="javascript:WEBTOURFNC.js_act_btn_share()" class="js_act btn_share"><span>공유하기</span></a>-->
                    <a href="${webtourDomain}${URLS['찜']}" class="btn_cart">
                      <span>찜</span>
                      <span class="alarm" style="display:${wtjs.isWishView()}">${wtjs.wishListCnt()}</span>
                    </a>
                    <a href="#" onclick="btnHomeClick()" class="btn_home"><span>홈</span></a>
                  </div> 
            `
      } else if (headerType === 5) {
        str = `<!-- Type5. [좌]이전페이지 [우]공유하기,닷컴홈 - MBTI 헤더 -->
                <span class="progressbar"></span>
                  <a href="#" onclick="window.goMbtiBack()" class="js_act btn_prev_none"><span>이전페이지</span></a>
                  <h1 class="title">${wtjs.pageTitle()}</h1>
                  ${
                    location.href.indexOf('shared-result') > -1
                      ? `<div class="top_btn_bundle" style="display:none">`
                      : `<div class="top_btn_bundle">`
                  }
                    <a href="javascript:WEBTOURFNC.js_act_btn_share()" onclick="window.setShareData()" class="js_act btn_share"><span>공유하기</span></a>
                    <a href="#" onclick="btnHomeClick()" class="btn_home"><span>홈</span></a>
                  </div> 
            `
      } else if (headerType === 6) {
        str = `<!-- Type6. [좌]전체메뉴 [우]통합검색 - 코브랜드 헤더 -->
                <span class="progressbar"></span>
                  <a href="#" onclick="WEBTOURFNC.rightMenuClick()" class="js_act btn_right_menu"><span>전체메뉴</span></a>   
                  <span onmouseover="wtjs.headerLogo()" id="ic_header_logo" class="ic_header_logo"></span>                           
                  <div class="top_btn_bundle">
                    <a href="#" onclick="WEBTOURFNC.btnSearchClick()" class="js_act btn_search" ><span>통합 검색</span></a>
                  </div> 
            `
      } else if (headerType === 7) {
        str = `<!-- Type7. [좌]전체메뉴 [우]통합검색,전체도시 - DCR 헤더 -->
                <span class="progressbar"></span>
                <a href="#" onclick="WEBTOURFNC.rightMenuClick()" class="js_act btn_right_menu"><span>전체메뉴</span></a>
                  <span onmouseover="wtjs.headerLogo()" id="ic_header_logo" class="ic_header_logo"></span>               
                  <div class="top_btn_bundle">
                    <a href="#" onclick="WEBTOURFNC.btnSearchClick()" class="js_act btn_search" ><span>통합 검색</span></a>
                    <a href="#" onclick="WEBTOURFNC.btnAllClick()" class="js_act btn_all"><span>전체도시</span></a>
                  </div> 
            `
      } else {
        str = `<!-- Type0. [좌]이전페이지 - default 헤더 -->
                <span class="progressbar"></span>
                  <a href="#" onclick="goBack()" class="js_act btn_prev_none"><span>이전페이지</span></a>
                  <div class="top_btn_bundle">
                  </div> 
            `
      }
      document.querySelector('#header').innerHTML = str
    },
    cobrand: function (type) {
      let str = ``
      if (!isCobrand) {
        //닷컴 footer
        if (type == 'footer') {
          str = `<div class="office_info_wrap">
                    <a class="header" href="#footer_aco" id="btn_aco" onClick="WEBTOURFNC.btn_aco()">(주)하나투어</a>
                    <ul class="office_info view" id="footer_aco" style="display: none;">
                      <li>대표자 : 송미선, 육경건</li>
                      <li>사업자등록번호 : 102-81-39440 <a href="${URLS['사업자정보확인']}">사업자정보확인</a></li>
                      <li>통신판매업신고번호 : 종로01-1806호</li>
                      <li>03161 서울특별시 종로구 인사동 5길 41</li>
                      <li>하나투어 고객센터 : <a href="tel:1577-1233">1577-1233</a> FAX : 02-734-0392</li>
                      <li>이메일 : <a href="mailto:15771233@hanatour.com">15771233@hanatour.com</a></li>
                      <li>호스팅 서비스 사업자 : (주)하나투어</li>
                      <li>개인정보보호책임자 : 채철훈</li>
                      <li>관광사업자 등록번호 : 제1993-000006호</li>
                      <li>영업보증보험 : 22억 1천만원 가입</li>
                    </ul>
                    <ul class="office_info">
                      <li><br></li>
                      <li>※ 부득이한 사정에 의해 여행일정이 변경되는 경우 사전 동의를 받습니다.<br>※ 하나투어는 개별 항공권, 단품 및 일부 여행상품에 대하여 통신판매중개자로서 통신판매의 당사자가 아니며 해당상품의 거래정보 및 거래등에 대해 책임을 지지 않습니다.</li>
                    </ul>
                    <small>COPYRIGHT ⓒ HANATOUR SERVICE INC.</small>
                  </div>
                `
        }
        return str
      }
      //코브랜드 footer
      let chnlDvCd = 'M'
      let dmnAdrs = currHostname

      //API 호출
      let xhr = new XMLHttpRequest()
      xhr.open(
        'GET',
        `${apiUrl}/open/bboBcmApiCategory/getListBboBcmOpenApi?_siteId=${webtourSiteId}&chnlDvCd=${chnlDvCd}&dmnAdrs=${dmnAdrs}`,
        false,
      )
      xhr.send()
      let data = JSON.parse(
        xhr.response
          .replace(/^document.write\(\'/, '')
          .replace(/\'\)\;/g, '')
          .split('null')
          .join('""'),
      )

      if (data.resultMessage === 'SUCCESS') {
        let bboBcmInfoLst = data.getListBboBcmServiceConfig.bboBcmInfoLst[0]

        if (type == 'header') {
          let mblSiteGdncWrdngNm = ''
          if (bboBcmInfoLst.mblSiteGdncWrdngNm === null) {
            mblSiteGdncWrdngNm = ''
          } else {
            mblSiteGdncWrdngNm = bboBcmInfoLst.mblSiteGdncWrdngNm
          }
          if (bboBcmInfoLst.hdrFotrStupDvCd === 'T') {
            //header - 기본형
            //console.log(':::: cobrand header - 기본형')
            str = `<div>
                            <div class="co_brand" style="display: block;">
                              <strong>${bboBcmInfoLst.afcnNm}</strong>
                              <p>${mblSiteGdncWrdngNm}</p>
                            </div>
                          </div>`
          } else if (bboBcmInfoLst.hdrFotrStupDvCd === 'H') {
            //header - HTML형
            //console.log(':::: cobrand header - HTML형')
            str = `<div>
                          <div class="co_brand html">
                            ${bboBcmInfoLst.htmlCdContHd}
                          </div>
                        </div>`
          }
        } else if (type == 'footer') {
          let footerType = 1
          if (
            bboBcmInfoLst.dtcmMainUseYn === 'N' &&
            bboBcmInfoLst.dtcmSiteInfoUseYn === 'Y' &&
            bboBcmInfoLst.hdrFotrStupDvCd === 'T'
          ) {
            footerType = 1 //footer - 기본형 & 닷컴동일o
          } else if (
            bboBcmInfoLst.dtcmMainUseYn === 'Y' &&
            bboBcmInfoLst.dtcmSiteInfoUseYn === 'N' &&
            bboBcmInfoLst.hdrFotrStupDvCd === 'T'
          ) {
            footerType = 2 //footer - 기본형 & 닷컴동일x
          } else if (bboBcmInfoLst.hdrFotrStupDvCd === 'H') {
            footerType = 3 //footer - HTML형
          }
          //console.log(':::: cobrand footer - ',footerType)
          if (footerType === 1) {
            //footer - 기본형 & 닷컴동일o
            str = `<div class="office_info_wrap">                      
                                <a class="header" href="#footer_aco" id="btn_aco" onClick="WEBTOURFNC.btn_aco()">(주)하나투어</a>
                                <ul class="office_info view" id="footer_aco" style="display: none;">
                                  <li>대표자 : 송미선, 육경건</li>
                                  <li>사업자등록번호 : 102-81-39440 <a href="${URLS['사업자정보확인']}">사업자정보확인</a></li>
                                  <li>통신판매업신고번호 : 종로01-1806호</li>
                                  <li>03161 서울특별시 종로구 인사동 5길 41</li>
                                  <li>하나투어 고객센터 : <a href="tel:1577-1233">1577-1233</a> FAX : 02-734-0392</li>
                                  <li>이메일 : <a href="mailto:15771233@hanatour.com">15771233@hanatour.com</a></li>
                                  <li>호스팅 서비스 사업자 : (주)하나투어</li>
                                  <li>개인정보보호책임자 : 채철훈</li>
                                  <li>관광사업자 등록번호 : 제1993-000006호</li>
                                  <li>영업보증보험 : 22억 1천만원 가입</li>
                                </ul>
                                <ul class="office_info">
                                  <li><br></li>
                                  <li>※ 부득이한 사정에 의해 여행일정이 변경되는 경우 사전 동의를 받습니다.<br>※ 하나투어는 개별 항공권 단독 판매에 대하여 통신판매중개자로서 통신판매의 당사자가 아니며 해당상품의 거래정보 및 거래등에 대해 책임을 지지 않습니다.</li>
                                </ul>
                                <small>COPYRIGHT ⓒ HANATOUR SERVICE INC.</small>
                              </div>
                            `
          } else if (footerType === 2) {
            //footer - 기본형 & 닷컴동일x
            str = `<div class="office_info_wrap">                       
                                <a class="header" href="#footer_aco" id="btn_aco" onClick="WEBTOURFNC.btn_aco()">(주)하나투어</a>
                                <ul class="office_info" id="footer_aco" style="display: none;">
                                  <li><strong>${
                                    bboBcmInfoLst.afcnNm
                                  }</strong></li>
                                  <li>대표자 : ${bboBcmInfoLst.rprnNm}</li>
                                  <li>사업자등록번호 : ${
                                    bboBcmInfoLst.bzmnNum
                                  } <a href="${
              URLS['사업자정보확인']
            }">사업자정보확인</a></li>
                                  ${
                                    bboBcmInfoLst.cmncSlbsnNum
                                      ? `<li>통신판매업신고번호 : ${bboBcmInfoLst.cmncSlbsnNum}</li>`
                                      : ``
                                  }
                                  <li>${bboBcmInfoLst.zip} ${
              bboBcmInfoLst.adrs
            }</li>
                                  <li>하나투어 고객센터 : <a href="tel:${
                                    bboBcmInfoLst.rpprTel
                                  }">${bboBcmInfoLst.rpprTel}</a> FAX : ${
              bboBcmInfoLst.faxn
            }</li>
                                  ${
                                    bboBcmInfoLst.emlAdrs
                                      ? `<li>이메일 : <a href="mailto:${bboBcmInfoLst.emlAdrs}">${bboBcmInfoLst.emlAdrs}</a></li>`
                                      : ``
                                  }
                                  <li>호스팅 서비스 사업자 : (주)하나투어</li>
                                  ${
                                    bboBcmInfoLst.pdatSpvsNm
                                      ? `<li>개인정보보호책임자 : ${bboBcmInfoLst.pdatSpvsNm}</li>`
                                      : ``
                                  }
                                  ${
                                    bboBcmInfoLst.stsngBrn
                                      ? `<li>관광사업자 등록번호 : ${bboBcmInfoLst.stsngBrn}</li>`
                                      : ``
                                  }
                                  <li>영업보증보험 : 22억 1천만원 가입</li>
                                </ul>
                                <small>COPYRIGHT ⓒ HANATOUR SERVICE INC.</small>
                              </div>
                            `
          } else if (footerType === 3) {
            //footer - HTML형
            str = `${bboBcmInfoLst.htmlCdContFt}`
          }
        }
      }
      return str
    }, //end: cobrandHeader()
  }, //end: ui: {
  swipe: {
    left: function (wrapper, targets) {
      let objs = wrapper.querySelectorAll(targets)
      wrapper.appendChild(objs[0])
    },
    right: function (wrapper, targets) {
      let objs = wrapper.querySelectorAll(targets)
      wrapper.insertBefore(objs[objs.length - 1], wrapper.firstChild)
    },
    up: function (wrapper, targets) {
      this.left(wrapper, targets)
    },
    down: function (wrapper, targets) {
      this.right(wrapper, targets)
    },
  },
  //열기
  clickSearch: function (obj, obj1, obj2) {
    let val = obj.value.replace(/^\s*|\s*$/g, '')
    /* if (val.length > 0) {
            //검색어 있으면
            obj1.style.display = 'none'
            obj2.style.display = 'block'
        } else {
            //검색어 없으면
            obj1.style.display = 'block'
            obj2.style.display = 'none'
        } */

    this.drawRecentlyKeywords() //최근
    this.popularSearch(val) //인기ajax
    this.recommendSearch(val) //추천ajax
  },
  //닫기
  closeSearch: function (obj) {
    obj.style.display = 'none'
  },
  //자동완성ajax
  autoSearch: function (val, obj1, obj2) {
    let _val = val.replace(/^\s*|\s*$/g, '')
    if (_val.length > 0) {
      //검색어 있으면
      obj1.style.display = 'block'
      obj2.style.display = 'none'
    } else {
      //검색어 없으면
      obj1.style.display = 'none'
      obj2.style.display = 'block'
    }

    let params = {
      userMode: 'MO',
      keyword: _val,
    }

    this.ajax(
      `${apiUrl}/open/comItsApiCategory/getAtmtCmptTourApi?_siteId=${webtourSiteId}`,
      { params: params, credentials: true },
      function (data) {
        let str = ``

        if (data.resultMessage === 'SUCCESS') {
          let cmptConfig = data.getAtmtCmptConfig

          let tripMap = cmptConfig.tripInfoMap || ''
          if (tripMap !== '') {
            str += wtjs.ui.autoSearch(
              'pkg',
              `<em>${cmptConfig.keyword}</em> 패키지 모두 보기`,
            )
            str += wtjs.ui.autoSearch(
              'htl',
              `<em>${cmptConfig.keyword}</em> 호텔 모두 보기`,
            )
            str += wtjs.ui.autoSearch(
              'air',
              `<em>${cmptConfig.keyword}</em> 항공권 모두 보기`,
            )
            str += wtjs.ui.autoSearch(
              'info',
              `<em>${cmptConfig.keyword}</em> 여행정보 모두 보기`,
            )
          }

          let list2 = cmptConfig.packageList || ''
          if (list2 !== '') {
            for (let i = 0; i < list2.length; i++) {
              str += wtjs.ui.autoSearch('pkg', list2[i].packageTitle)
            }
          }

          let list3 = cmptConfig.hotelList || ''
          if (list3 !== '') {
            for (let i = 0; i < list3.length; i++) {
              str += wtjs.ui.autoSearch('htl', list3[i].hotelTitle)
            }
          }

          let list1 = cmptConfig.autoCompleteList || ''
          if (list1 !== '') {
            for (let i = 0; i < list1.length; i++) {
              str += wtjs.ui.autoSearch('pos', list1[i])
            }
          }
        } else {
          str += wtjs.ui.dataNo('최근 검색어 내역이 없습니다.')
        }

        document.querySelector('ul.list_autocomplete').innerHTML = str
      },
    )
  },
  drawRecentlyKeywords: function () {
    // [MGTT-1349]@hslee - 외부 헤더에서 최근 검색어를 쿠키로 관리
    let recentlyKeywords = this.getCookie(this.RECENTLY_COOKIE_NAME)
    recentlyKeywords =
      (recentlyKeywords && JSON.parse(recentlyKeywords).reverse()) || []
    let keywordsHtmlString = ''

    if (recentlyKeywords.length > 0) {
      for (let i = 0; i < recentlyKeywords.length; i++) {
        keywordsHtmlString += wtjs.ui.getRecentlyKeywordHtml(
          recentlyKeywords[i],
        )
      }
    } else {
      keywordsHtmlString += wtjs.ui.dataNo('최근 검색어 내역이 없습니다.')
      document.querySelector('a.js_act_all').style.display = 'none'
    }
    document.querySelector('ul.list_srchword.type').innerHTML =
      keywordsHtmlString

    // [QA-4156] 최종적으로 최근 검색어가 있으면 해당 탭 on
    if (recentlyKeywords.length > 0) {
      WEBTOURFNC.js_tabs01()
    }
  },
  //인기ajax
  popularSearch: function (val) {
    let params = {
      userMode: 'MO',
    }
    this.ajax(
      `${apiUrl}/open/comItsApiCategory/getPpltSrwrTourApi?_siteId=${webtourSiteId}`,
      { params: params, credentials: true },
      function (data) {
        let str = ``

        if (data.resultMessage === 'SUCCESS') {
          let list = data.getPpltSrwrConfig.popularWord
          for (let i = 0; i < list.length; i++) {
            str += wtjs.ui.popularSearch(i, list[i].keyword)
          }
        } else {
          str += wtjs.ui.dataNo('인기 검색어 내역이 없습니다.')
        }

        document.querySelector('ol.list_srchword.type').innerHTML = str
      },
    )
  }, //end: popularSearch: function (val) {
  //추천ajax
  recommendSearch: function (val) {
    let getParams = '&srwrDvCd=SWD02&srwrExprDvCd=M&srwrNm=' //Pc,Mobile에 따라 구분필요
    this.ajax(
      `${apiUrl}/open/comSrhApiCategory/getListSrhTourApi?_siteId=${webtourSiteId}${getParams}`,
      { credentials: true, method: 'GET' },
      function (data) {
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

        let str = ``

        if (data.resultMessage === 'SUCCESS') {
          let list = data.getListSrhConfig.srwrMgmtLst
          for (let i = 0; i < list.length; i++) {
            str += wtjs.ui.recommendSearch(
              `hashtag tag_hash2`,
              list[i].srwrNm,
              list[i].lnkSrwrNm,
            )
          }
        } else {
          // str += wtjs.ui.dataNo("추천 검색어 내역이 없습니다.")
          str += ''
        }

        document.querySelector('div.hash_group').innerHTML = str
      },
    )
  }, //end: recommendSearch: function (val) {
  removeKeyword: function (val = '') {
    // [MGTT-1349]@hslee - 외부 헤더에서 최근 검색어를 쿠키로 관리
    let recentlyKeywords = this.getCookie(this.RECENTLY_COOKIE_NAME)
    recentlyKeywords =
      (recentlyKeywords && JSON.parse(recentlyKeywords).reverse()) || []

    if (val) {
      // 'DEL' 단품 삭제
      if (recentlyKeywords.indexOf(val) > -1) {
        recentlyKeywords = recentlyKeywords.filter((keyword) => keyword !== val)
      }
    } else {
      // 'DELALL' 전체 삭제
      recentlyKeywords = []
    }

    this.setCookie(this.RECENTLY_COOKIE_NAME, JSON.stringify(recentlyKeywords))
    this.drawRecentlyKeywords()
  },
  saveKeyword: function (val = '', callback) {
    // [MGTT-1349]@hslee - 외부 헤더에서 최근 검색어를 쿠키로 관리
    if (!val) {
      return false
    }
    let recentlyKeywords = this.getCookie(this.RECENTLY_COOKIE_NAME)
    recentlyKeywords =
      (recentlyKeywords && JSON.parse(recentlyKeywords).reverse()) || []

    // [QA-1433]@hslee - 외부헤더 최근 검색어 최대 갯수
    if (recentlyKeywords.length >= this.MAX_COOKIE_SIZE) {
      // [1,2,3,4,5,6,7,8,9,10, 11, 12] => [4,5,6,7,8,9,10, 11, 12]
      recentlyKeywords = recentlyKeywords.splice(
        recentlyKeywords.length - this.MAX_COOKIE_SIZE + 1,
        this.MAX_COOKIE_SIZE,
      )
    }

    // 기존 쿠키에 존재하는 키워드라면 삭제. 이후 다시 추가
    if (recentlyKeywords.indexOf(val) > -1) {
      recentlyKeywords.splice(recentlyKeywords.indexOf(val), 1)
    }
    recentlyKeywords.push(val)

    this.setCookie(this.RECENTLY_COOKIE_NAME, JSON.stringify(recentlyKeywords))
    callback && callback()
  }, //end: saveKeyword: function (val = "", callback) {
  //ajax
  ajax: function (url, data = {}, callback) {
    var xhr = new XMLHttpRequest()
    let credentials =
      (data.credentials || '') === ''
        ? false
        : data.credentials === false
        ? false
        : true
    xhr.open((data.method || '') === '' ? 'POST' : data.method, url)
    xhr.withCredentials = credentials
    xhr.onload = function () {
      callback(JSON.parse(xhr.response))
    }
    xhr.setRequestHeader('Accept', 'application/json, text/plain, */*')
    xhr.setRequestHeader('prgmId', '/') // "EX00000001"
    if (data.params !== undefined && typeof data.params === 'object') {
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    }
    xhr.send(JSON.stringify(data.params || ''))
  },
  gnb: {
    height: function (isWebtour) {
      return isWebtour ? '' : 'height: 116px;'
    }, //end: height: function(isWebtour){
  }, //end: , gnb: {
  //페이지 타이틀 세팅
  pageTitle: function () {
    let title = ''
    if (location.href.indexOf('travel-style') > -1) {
      title = '여행 스타일 테스트'
    } else if (location.href.indexOf('overseas-travel') > -1) {
      title = '해외여행 안전정보'
    }
    return title
  },
  headerLogo: function () {
    //상단로고
    animHeaderLogo.setDirection(1)
    animHeaderLogo.play()
  },
} //end: var wtjs = {

var URLS = {
  //headers
  하나투어: '/', // /mma/smn/EX00000001
  로그인: '/com/lgi/CHPC0LGI0106M100',
  예약조회: '/com/lgi/CHPC0LGI0103M100',
  마이페이지:
    '/com/lgi/CHPC0LGI0114M100?redirectUri=%2Fcom%2Fmpg%2FCHPC0MPG0001M100&siteId=05',
  DCR마이페이지:
    '/com/lgi/CHPC0LGI0106M100?redirectUri=%2Fcom%2Fmpg%2FCHPC0MPG0001M100',
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
  회사소개:
    'http://www.hanatourcompany.com/kor/main/main.asp?hanacode=main_bottom_01',
  이용약관: '/els/prv/CHPC0PRV0004M100',
  개인정보처리방침: '/els/prv/CHPC0PRV0002M100',
  여행약관: '/els/prv/CHPC0PRV0003M100',
  해외여행자보험: '/els/etc/CHPC0ETC0008M100',
  마케팅제휴: '/els/etc/CHPC0ETC0001M100',
  '공식인증예약센터 검색': '/els/etc/CHPC0ETC0004M100',
  사업자정보확인: 'http://www.ftc.go.kr/bizCommPop.do?wrkr_no=1028139440',
  travel_mark1:
    'http://www.smartoutbound.or.kr/guide/html/guideInfo4.do?menu_code=0000000016',
  travel_mark2: 'http://www.eprivacy.or.kr/seal/mark.jsp?mark=e&code=2019-R055',
  travel_mark3: 'http://www.kca.go.kr/ccm/certSystemOutlineView.do',
} //end: var URLS = {

document.write(`
	<link rel="shortcut icon" href="https://image.hanatour.com/usr/static/img2/mobile/favicon.ico">
	<link data-n-head="true" type="text/css" rel="stylesheet" href="${webtourDomain}/assets/css/mobile/cp.css">

	<script src="${webtourDomain}/fx/lib/jquery-3.3.1.min.js"><\/script>
	<script src="${webtourDomain}/fx/js/fx-jquery.js"><\/script>
	<script src="${webtourDomain}/fx/js/fx-ui-lib.js"><\/script>
	<script src="${webtourDomain}/fx/js/fx-ui-mobile.js"><\/script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.7.12/lottie.min.js"><\/script>
`)

document.write(`
<div class="header_wrap">
  ${wtjs.ui.cobrand('header')}
  <div class="ribbon_popup" style="display: none;">
    <span class="ir">매일매일 모바일 특가!<strong>하나투어 앱</strong></span>
    <a href="#" class="btn sml em">앱 다운받기</a>
    <a href="#" class="js_act btn_cls">닫기</a>
  </div>
	<div id="header">
    ${wtjs.ui.headerType()}
	</div>
	${wtjs.init()}
</div>
  `)

if (webtourDomain === 'http://local.hanatour.com:8000') {
  document.write(
    `<div style="width: 100%; height: 300px; background: silver;"></div>`,
  )
}

var getPcUrl = function () {
  return location.href.indexOf('localhost') !== -1
    ? 'http://localhost:9000/'
    : 'https://www.hanatour.com/'
}

var appInstall = {
  하나투어: {
    ios: 'https://itunes.apple.com/kr/app/hanatueodaskeom/id550971489?mt=8',
    android:
      'intent://hanatour/#Intent;scheme=hanatour://dotcom.hanatour.com;package=com.hanatour.dotcom;end',
  },
  항공: {
    ios: 'https://itunes.apple.com/kr/app/hanapeuli-hang-gong/id724543589?mt=8',
    android:
      'intent://hanatour/#Intent;scheme=hanafreeair://link;package=com.hanatour.hanafreeair;end',
  },
  호텔: {
    ios: 'https://itunes.apple.com/kr/app/hanapeuli-hotel/id896120310?mt=8',
    android:
      'intent://hanatour/#Intent;scheme=tour-hotel://link?;package=kr.co.alocan.hanatour03;end',
  },
  하나free: {
    ios: 'https://itunes.apple.com/kr/app/hanafree/id724534617?mt=8',
    android:
      'intent://hanatour/#Intent;scheme=hanatour://hanafree.hanatour.com;package=com.hanatour.hanafree;end',
  },
  하나티켓: {
    ios: 'https://itunes.apple.com/kr/app/hanaticket/id744791909?mt=8',
    android:
      'intent://HanaTicket/#Intent;scheme=HanaTicket://;package=com.hana.freeticket;end',
  },
  getOs: function () {
    let userAgent = navigator.userAgent
    if (/iP(ad|hone|od)/.test(userAgent)) {
      return 'ios'
    } else if (userAgent.toLowerCase().indexOf('android') > -1) {
      return 'android'
    } else {
      return ''
    }
  },
  url: function (str) {
    let os = this.getOs()
    return os === ''
      ? "javascript:alert('PC버전에서는 지원되지 않는 기능입니다.')"
      : this[str][os]
  },
}

window.onpageshow = function (e) {
  // 플래너 홈 최초 진입 - 스크롤 시, 헤더 색상 제어
  if (location.href.indexOf('mscheduler.hanatour.com') > -1) {
    $(window).scroll(function () {
      $('.header_wrap').addClass('sched_home')
      var height = $(document).scrollTop()
      if (height > 0) {
        $('.header_wrap').addClass('fixed')
      } else if (height == 0) {
        $('.header_wrap').removeClass('fixed')
      }
    })
  }
  // e.persisted || (window.performance && window.performance.navigation.type == 2) // IE, 크롬 포함
  if (e.persisted) {
    // history.back 이벤트일 경우
    window.location.reload()
  }
}
