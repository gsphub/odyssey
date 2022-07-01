/**
 * json 구조로 메뉴를 구성한다...
 */
var jsonize = function (data, options = {}) {
  let result = {
    name: data.menuNm || '', //메뉴명
    url: data.urlAdrs || '', //랜딩URL
    id: data.menuId || '', //메뉴ID
    htmlTypeCd: data.htmlTypeCd || '', //구분값
    imgUrlAdrs: data.imgUrlAdrs || '', //이미지URL
    memoTitlNm: data.memoTitlNm || '', //블릿명
    scrnLnkMthdDvCd: data.scrnLnkMthdDvCd || '', //화면연결
  }

  for (let key in options) {
    result[key] = options[key]
  }

  return result
} //end: var jsonize = function(data, options){

var RERIGHT = {
  menus: [],
  params: {
    //공유하기에 필요한 params(MBTI쪽에서 얻어옴)
    imgUrl: '', //이미지(썸네일 이미지 URL)
    name: '', //제목
    description: '', //설명
    url: '',
    buttonTitle: '', //버튼 타이틀
    buttonUrl: '', //출처링크(버튼 URL링크)
    buttonTitle2: '', //버튼 타이틀2
    buttonUrl2: '', //출처링크2(버튼 URL링크2)
  },
  kakao_init: false,
  setParams: function (obj) {
    this.params.imgUrl = obj.imgUrl
    this.params.name = obj.name
    this.params.description = obj.description
    this.params.url = obj.url
    this.params.buttonTitle = obj.buttonTitle
    this.params.buttonUrl = obj.buttonUrl
    this.params.buttonTitle2 = obj.buttonTitle2
    this.params.buttonUrl2 = obj.buttonUrl2
    // console.log(':::: [MBTI] RERIGHT.setParams : ', this.params)
  },
  depth1: function (datas) {
    for (let i = 0; i < datas.length; i++) {
      let data = datas[i]
      
      if (data.lvl === 1 && data.useYn === 'Y') {
        this.menus.push(jsonize(data, { subs: [] }))
      }
    }
  }, //end: , depth1: function (datas) {
  depth2: function (datas) {
    //console.log(':::: 전체메뉴 > isCobrand : ',isCobrand)
    for (let i = 0; i < this.menus.length; i++) {
      let menu = this.menus[i]

      for (let j = 0; j < datas.length; j++) {
        let data = datas[j]
        if(isCobrand){ //코브랜드인 경우
          if (menu.id === data.hgrnMenuId) {
            if (data.lvl === 2 && data.useYn === 'Y' && data.htmlTypeCd != '04' && data.menuNm != '인기플레이스') {
              menu.subs.push(jsonize(data, { subs: [] }))
            }
          }
        } else { //코브랜드 아닌 경우
          if (menu.id === data.hgrnMenuId) {
            if (data.lvl === 2 && data.useYn === 'Y') {
              menu.subs.push(jsonize(data, { subs: [] }))
            }
          }
        }
      } //end: for (let j = 0; j < datas.length; j++) {
    } //end: for (let i = 0; i < this.menus.length; i++) {
  }, //end: , depth2: function (datas) {
  depth3: function (datas) {
    for (let i = 0; i < this.menus.length; i++) {
      let menu = this.menus[i]

      for (let j = 0; j < menu.subs.length; j++) {
        let sub = menu.subs[j]

        for (let k = 0; k < datas.length; k++) {
          let data = datas[k]

          if (sub.id === data.hgrnMenuId && data.useYn === 'Y') {
            sub.subs.push(jsonize(data))
          }
        } //end: for (let k = 0; k < datas.length; k++) {
      } //end: for (let j = 0; j < menu.subs.length; j++) {
    } //end: for (let i = 0; i < this.menus.length; i++) {
  }, //end: , depth3: function (datas) {
  getAreaMenuList: function () {
    //인기플레이스 리스트
    let areaMenuData = []
    let xhr = new XMLHttpRequest()
    xhr.open('GET', `${apiUrl}/open/lctDarAre/getPopularAreasForOpen?limit=6`, false)
    xhr.send()
    let PopularAreas = JSON.parse(
      xhr.response
        .replace(/^document.write\(\'/, '')
        .replace(/\'\)\;/g, '')
        .split('null')
        .join('""')
    )
    if (PopularAreas.result === '200') {
      areaMenuData = PopularAreas.popularAreasForOpen.popularAreas
    }
    return areaMenuData
  },
  /**
       통합검색 추천키워드 세팅을 위한 랜덤함수
    */
  getRandomInt: function (start, end) {
    let min = Math.ceil(start)
    let max = Math.floor(end)
    return Math.floor(Math.random() * (max - min)) + min
  }, //end: getRandomInt: function(start,end)

  /**
   * SNS 공유하기 > shortUrl 얻기위한 함수
   */
  getShortUrl: function () {
    // 공유할 문구 (상품:상품명, 상품외:기본문구)
    if (RERIGHT.params.buttonUrl.indexOf('apptour') > -1) {
      RERIGHT.params.buttonUrl = RERIGHT.params.buttonUrl.replace('apptour', 'm')
    }
    let shortUrl = ''
    let url = encodeURIComponent(RERIGHT.params.buttonUrl)

    let xhr = new XMLHttpRequest()
    xhr.open('GET', `${apiUrl}/open/comLgiApiCategory/getShortUrlOpenApi?url=${url}`, false)
    xhr.send()
    shortUrl = JSON.parse(
      xhr.response
        .replace(/^document.write\(\'/, '')
        .replace(/\'\)\;/g, '')
        .split('null')
        .join('""')
    )
    if (shortUrl.result === '200') {
      shortUrl = shortUrl.getShortUrlConfig.shortUrl.result.url
    }
    return shortUrl
  },
  /**
   * SNS 공유하기 > 문자보내기(app)
   */
  doShareSMS: function (msg) {
    let isIOS = isIOSApp()

    let param =
      '{"scheme":"common" , "tag":"sendSMS" , "params":{"phoneNumber":"","message":"' + msg + '"}}'
    // (샘플)var param = '{"scheme":"common" , "tag":"sendSMS" , "params":{"phoneNumber":"","message":"[하나투어]일정표 정보가 도착하였습니다. http://m.hanatour.com/package/scheduleInfo.hnt?pkgCode=ADP100190602KEE"}}'

    if (isIOS === 'Y') {
      window.webkit.messageHandlers.hanatourapp.postMessage(param)
    } else {
      window.htmlEventHandler.hanatourapp(param)
    }
  },
  /**
   * 페이스북 공유하기 > 디바이스 체크
   */
  checkDevice() {
    var filter = 'win16|win32|win64|mac'
    var vWebType = ''
    if (navigator.platform) {
      if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
        vWebType = 'MOBILE'
      } else {
        vWebType = 'PC'
      }
    }
    return vWebType
  },
  /**
   * 카카오톡 공유하기 > DCR앱일 경우
   */
  doShareKakao() {
    var isIOS = isIOSApp()
    let param = '{"scheme":"common" , "tag":"kakaoLink" , "params":{"url":"'+ RERIGHT.params.url +'", "label":"' + RERIGHT.params.name +'", "imageUrl":"' + RERIGHT.params.imgUrl + '", "imageWidth":"414" , "imageHeight":"414","description":"'+RERIGHT.params.description+'" }}'
    //console.log(':::: doShareKakao() - param : ',param)
    if (isIOS === 'Y') {
      window.webkit.messageHandlers.hanatourapp.postMessage(param)
    } else {
      window.htmlEventHandler.hanatourapp(param)
    }
  },

  rebuild: function (datas) {
    let result = this.getMenu()

    this.depth1(result)
    this.depth2(result)
    this.depth3(result)

    return this.ui.render(this.menus)
  }, //end: , rebuild: function(datas){
  getMenu: function () {
    var menuData = localStorage.getItem('menuData') //전체메뉴
    var menuTime = localStorage.getItem('menuTime') //기 전체메뉴를 설정한 시간
    //현재시간 설정
    var currTime = new Date() //현재시간
    var menuTimeTemp = new Date(menuTime) //기 전체메뉴를 설정한 시간
    var menuTimeExp = menuTimeTemp.setHours(menuTimeTemp.getHours() + 1) //전체메뉴 설정 만료시간(1시간 이후)
    //로그 확인용
    var menuTimeExpChk = new Date(menuTimeExp)
    /*
     ** 전체메뉴 api를 새로 호출하는 기준
     * 1. 로컬스토리지에 전체메뉴(menuData)가 없는 경우
     * 2. 로컬스토리지에 전체메뉴 설정시간(menuTime)이 없는 경우
     * 3. 전체메뉴 설정시간이 1시간 경과한 경우
     */
    if (menuData == null || menuTime == null || menuTimeExp < currTime) {
      //전체메뉴 api 호출부
      let xhr = new XMLHttpRequest()
      xhr.open(
        'GET',
        `${apiUrl}/open/smgSmmApiCategory/getListSmmNewApi?siteExprChnlDvCd=WTM&menuObjId=ALL`,
        false
      )
      xhr.send()
      let resultData = JSON.parse(
        xhr.response
          .replace(/^document.write\(\'/, '')
          .replace(/\'\)\;/g, '')
          .split('null')
          .join('""')
      )
      menuData = resultData.getListSmmConfig.dtcmExhtMenuMLst
      localStorage.setItem('menuData', encodeURIComponent(JSON.stringify(menuData)))
      localStorage.setItem('menuTime', currTime) //전체메뉴 설정시간(menuTime)을 현재시간으로 세팅
    } else {
      //로컬스토리지에 저장되어있는 기 전체메뉴(menuData)를 그대로 사용
      menuData = JSON.parse(decodeURIComponent(localStorage.getItem('menuData')))
    }
    return menuData
  },
  //   setCookie: function(name, value, hour) {
  //     let date = new Date()
  //     date.setTime(date.getTime() + hour * 60 * 60 * 1000)
  //     document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/'
  //   },
  //   getCookie: function(name) {
  //     let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
  //     return value ? value[2] : null
  //   },
  //   deleteCookie: function(name) {
  //     var date = new Date()
  //     document.cookie = name + '= ' + '; expires=' + date.toUTCString() + '; path=/'
  //   },
  ui: {
    render: function (menus) {
      let temps = []

      for (let i = 0; i < menus.length; i++) {
        let menu = menus[i]
        temps[i] = ``

        for (let j = 0; j < menu.subs.length; j++) {
          // 전체메뉴 > 하위 폴더가 있는 경우
          let sub = menu.subs[j] // sub === 1depth폴더들(타이틀)
          //console.log(':::::::: sub(1depth) : ',sub)
          //let urlJoin = ''
          // if (sub.url !== null) { //랜딩URL 세팅
          // 	urlJoin = sub.url.indexOf('http') === -1 ? webtourDomain + sub.url : sub.url
          // }

          /* 1depth(타이틀) */
          let bulletName = `` //블릿명

          if (sub.memoTitlNm) {
            // 블릿값이 있는 경우
            bulletName = `<span class="label">${sub.memoTitlNm}</span>`
          }

          let fontType = ``
          if (sub.htmlTypeCd === '00') {
            fontType = ``
          } else if (sub.htmlTypeCd === '01') {
            fontType = `class="lv1"`
          } else if (sub.htmlTypeCd === '03') {
            fontType = `class="lv3"`
          }

          if (sub.htmlTypeCd === '02') {
            //내가만드는여행 영역(htmlTypeCd : 02)
            temps[i] += `<div class="my_schedule">\n`
          } else if (sub.htmlTypeCd === '04') {
            //추천서비스 영역(htmlTypeCd : 04)
            temps[i] += `<div class="banner_wrap">\n`
          } else if (sub.name === '-') {
            //구분선 처리(어드민에서 타이틀을 '-'로 설정한 케이스)
            temps[i] += `<div class="pkg_sec line">\n`
          } else {
            temps[i] += `<div class="pkg_sec">
											<h2 class="h2_tit">
												<a href="#" onclick="javascript:WEBTOURFNC.go('${sub.url}','${sub.scrnLnkMthdDvCd}','${sub.name}','${sub.id}')" ${fontType}>${sub.name}</a>
												${bulletName}
											</h2>\n`
          }
          /* 2depth(소항목) */
          let tr = ``
          for (let k = 0; k < sub.subs.length; k++) {
            //2depth애들(소항목)
            if (k === 0) {
              //<ul>시작태그 삽입
              temps[i] += `<ul>`
            }

            let _sub = sub.subs[k]
            //console.log(':::: _sub(2depth) : ',_sub)
            // let _urlJoin = ''

            // if (_sub.url !== null) { //랜딩URL 세팅
            // 	_urlJoin = _sub.url.indexOf('http') === -1 ? webtourDomain + _sub.url : _sub.url
            // }

            bulletName = `` //블릿명 초기화
            if (_sub.memoTitlNm) {
              // 블릿값이 있는 경우, 블릿 추가
              if (_sub.imgUrlAdrs) {
                //추천서비스 영역의 경우, <span>태그 추가 삽입
                bulletName = `<span class="label"><span>${_sub.memoTitlNm}</span></span>`
              } else {
                bulletName = `<span class="label">${_sub.memoTitlNm}</span>`
              }
            }

            if (_sub.imgUrlAdrs) {
              //추천서비스 영역의 경우, 이미지URL(절대경로,상대경로) 분기처리
              if (_sub.imgUrlAdrs.indexOf('http') === -1) {
                //'http'가 없는 경우(상대경로)
                _sub.imgUrlAdrs = imageDomain + '/usr/cms/resize/400_0/' + _sub.imgUrlAdrs
              }
            }

            if (_sub.imgUrlAdrs) {
              //추천서비스 영역의 경우(이미지URL값이 있는 경우)
              let trLive = ``
              if (_sub.name === '하나 LIVE') {
                trLive = ` <div class="svg_live">
												<div class="box_equalizer"> 
												<svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" viewBox="0 0 9 8"> 
													<rect class="eq_bar eq_bar_01" x="0" y="0" rx="2" ry="2" width="2" height="0"/> 
													<rect class="eq_bar eq_bar_02" x="3.5" y="0" rx="2" ry="2" width="2" height="0"/> 
													<rect class="eq_bar eq_bar_03" x="7" y="0" rx="2" ry="2" width="2" height="0"/> 
												</svg> 
												</div> 
											</div>`
              }

              if (k === sub.subs.length - 1) {
                //</ur>종료태그 삽입
                tr +=
                  `<li>
												<a href="#none" onclick="javascript:WEBTOURFNC.go('${_sub.url}','${_sub.scrnLnkMthdDvCd}','${_sub.name}','${_sub.id}')">
												<span class="txt">${_sub.name}` +
                  trLive +
                  `</span>
												<img src="${_sub.imgUrlAdrs}" alt=""/>
												</a>
												${bulletName}
											</li>
										</ul>` //2depth(소항목) 중 마지막 항목
              } else {
                tr +=
                  `<li>
												<a href="#none" onclick="javascript:WEBTOURFNC.go('${_sub.url}','${_sub.scrnLnkMthdDvCd}','${_sub.name}','${_sub.id}')">
												<span class="txt">${_sub.name}` +
                  trLive +
                  `</span>
												<img src="${_sub.imgUrlAdrs}" alt=""/>
												</a>
												${bulletName}
											</li>` //2depth(소항목)
              }
            } else {
              //추천서비스 이외의 영역
              if (k === sub.subs.length - 1) {
                //</ur>종료태그 삽입
                tr += `<li>
												<a href="#none" onclick="javascript:WEBTOURFNC.go('${_sub.url}','${_sub.scrnLnkMthdDvCd}','${_sub.name}','${_sub.id}')">${_sub.name}</a>
												${bulletName}
											</li>
										</ul>` //2depth(소항목) 중 마지막 항목
              } else {
                tr += `<li>
												<a href="#none" onclick="javascript:WEBTOURFNC.go('${_sub.url}','${_sub.scrnLnkMthdDvCd}','${_sub.name}','${_sub.id}')">${_sub.name}</a>
												${bulletName}
											</li>` //2depth(소항목)
              }
            }
          } //end: for (let k = 0; k < sub.subs.length; k++) {

          if (sub.name == '인기플레이스') {
            //인기플레이스 영역
            let areaMenuList = RERIGHT.getAreaMenuList()

            for (let a = 0; a < areaMenuList.length; a++) {
              let areaName = areaMenuList[a].name
              let areaDetail = areaMenuList[a].code
              if (a === 0) {
                //<ul>시작태그 삽입
                temps[i] += `<ul>`
              }

              if (a === areaMenuList.length - 1) {
                //</ur>종료태그 삽입
                tr += `<li>
                        <a href="#none" onclick="javascript:WEBTOURFNC.go('${webtourDomain}/com/area/detail?areaId=${areaDetail}','1','${areaName}')">${areaName}</a>
											</li>
										</ul>` //2depth(소항목) 중 마지막 항목
              } else {
                tr += `<li>
                        <a href="#none" onclick="javascript:WEBTOURFNC.go('${webtourDomain}/com/area/detail?areaId=${areaDetail}','1','${areaName}')">${areaName}</a>
											</li>` //2depth(소항목)
              }
            }
          }
          temps[i] += `${tr}</div><!-- //pkg_sec -->`
        } //end: for (let j = 0; j < menu.subs.length; j++) {
      } //end: for (let i = 0; i < menus.length; i++) {

      return temps.join('')
    }, //end: render: function (menus, datas) {
    snsMail: function () {
      let temps = []
      if (RERIGHT.params.prodType === 'etc') {
        temps = ''
      } else {
        temps =
          '<li><a href="javascript:WEBTOURFNC.sns_mail()" id="mailLink" class="sns_mail">메일공유</a></li>'
      }
      return temps
    }, //end: snsMail: function()
    //하단GNB
    gnb: function () {
      //console.log(':::: gnb > isCobrand : ',isCobrand)
      let temps = []
      if (isCobrand) { //코브랜드인 경우
        //코브랜드 footer
        let chnlDvCd = 'M'
        let dmnAdrs = currHostname
        
        //API 호출
        let xhr = new XMLHttpRequest()
        xhr.open('GET', `${apiUrl}/open/bboBcmApiCategory/getListBboBcmOpenApi?_siteId=${webtourSiteId}&chnlDvCd=${chnlDvCd}&dmnAdrs=${dmnAdrs}`, false)
        xhr.send()
        let data = JSON.parse(
          xhr.response
            .replace(/^document.write\(\'/, '')
            .replace(/\'\)\;/g, '')
            .split('null')
            .join('""')
        )
        if (data.resultMessage === 'SUCCESS') {
          var bboBcmInfoLstRes = data.getListBboBcmServiceConfig.bboBcmInfoLst[0]
        }
        temps = 
          `	<div class="quick_menu cobrand">
              <ul>
                <li onmouseover="javascript:WEBTOURFNC.onMouseOverMy()" onmouseleave="javascript:WEBTOURFNC.onMouseLeaveMy()">
                  ${ bboBcmInfoLstRes.afcnResTrgtDvCd === '02' ? `<a href="${webtourDomain}${URLS['예약조회']}">` : `<a href="${webtourDomain}${URLS['DCR마이페이지']}">`}
                    <div class="ico_lottie" id="ic_my"></div>
                    <span class="sr_name">마이페이지</span>
                  </a>
                </li>
                <li onmouseover="javascript:WEBTOURFNC.onMouseOverHome()" onmouseleave="javascript:WEBTOURFNC.onMouseLeaveHome()">
                  <a href="${webtourDomain}">
                    <div id="ic_home" class="ico_lottie"></div>
                    <span class="sr_name blind">홈</span>
                  </a>
                </li>
                <li onmouseover="javascript:WEBTOURFNC.onMouseOverLike()" onmouseleave="javascript:WEBTOURFNC.onMouseLeaveLike()">
                  <a href="${webtourDomain}${URLS['최근본']}">
                    <div class="ico_lottie" id="ic_like"></div>
                    <span class="sr_name">최근본/찜</span>
                  </a>
                </li>
              </ul>
            </div>`
      } else { //코브랜드가 아닌 경우
        temps = 
          `	<div class="quick_menu">
              <ul>
                <li onmouseover="javascript:WEBTOURFNC.onMouseOverLocation()" onmouseleave="javascript:WEBTOURFNC.onMouseLeaveLocation()" onclick="javascript:WEBTOURFNC.setCrmMainMenu('GNB','플레이스','1')">
                  <a href="${webtourDomain}${URLS['플레이스']}">
                    <div class="ico_lottie" id="ic_location"></div>
                    <span class="sr_name">플레이스</span>
                  </a>
                </li>
                <li id="schedule_li" onmouseover="javascript:WEBTOURFNC.onMouseOverSchedule()" onmouseleave="javascript:WEBTOURFNC.onMouseLeaveSchedule()" onclick="javascript:WEBTOURFNC.setCrmMainMenu('GNB','플래너','2')">
                  <a href="${URLS['플래너']}">
                    <div class="ico_lottie" id="ic_schedule"></div>
                    <span class="sr_name">플래너</span>
                  </a>
                </li>
                <li onmouseover="javascript:WEBTOURFNC.onMouseOverHome()" onmouseleave="javascript:WEBTOURFNC.onMouseLeaveHome()" onclick="javascript:WEBTOURFNC.setCrmMainMenu('GNB','홈','')">
                  <a href="${webtourDomain}">
                    <div id="ic_home" class="ico_lottie"></div>
                    <span class="sr_name blind">홈</span>
                  </a>
                </li>
                <li onmouseover="javascript:WEBTOURFNC.onMouseOverMy()" onmouseleave="javascript:WEBTOURFNC.onMouseLeaveMy()" onclick="javascript:WEBTOURFNC.setCrmMainMenu('GNB','마이페이지','3')">
                  ${location.href.indexOf('/dcr/') > -1 ? `<a href="${webtourDomain}${URLS['DCR마이페이지']}">` : `<a href="${webtourDomain}${URLS['마이페이지']}">`}
                    <div class="ico_lottie" id="ic_my"></div>
                    <span class="sr_name">마이페이지</span>
                  </a>
                </li>
                <li onmouseover="javascript:WEBTOURFNC.onMouseOverLike()" onmouseleave="javascript:WEBTOURFNC.onMouseLeaveLike()" onclick="javascript:WEBTOURFNC.setCrmMainMenu('GNB','최근본/찜','4')">
                  <a href="${webtourDomain}${URLS['최근본']}">
                    <div class="ico_lottie" id="ic_like"></div>
                    <span class="sr_name">최근본/찜</span>
                  </a>
                </li>
                <!--
                  <li>
                    <a href="javascript:(document.querySelector('body').classList.add('js_right_view'));" class="btn_like">전체메뉴</a>
                  </li>
                -->
                <!--
                  <li v-if="!coBrandNotMemOnlyCheck()">
                    <a href="${webtourDomain}${URLS['장바구니']}" class="btn_basket">
                    장바구니
                    <span class="alarm" v-show='this.$store.state.common.eventCnt != "0" && showShcrInfo'>{{this.$store.state.common.eventCnt}}</span>
                    </a>
                  </li>
                -->
                <!--
                  <li>
                    <a href="#recent_product" class="btn_recent" @click.prevent="dialogRecentGoods">최근 본 상품</a>
                  </li>
                -->
              </ul>
            </div>`
      }
      return temps
    }, //end: gnb: function ()
  }, //end: , ui: {
} //end: var RERIGHT = {

window.onload = function () {
  $(document).ready(function () {
    let isDCR = isDCRApp()
    if (isDCR) {
      //console.log(':::: 하단GNB - APP 호출')
      $('.quick_menu').addClass('quick_menu off')
    } else { //앱이 아닐 경우, 스크롤 up/down시 하단 GNB 노출/미노출 처리
      //console.log(':::: 하단GNB - WEBVIEW 호출')
      let lastScrollTop = 0
      $(window).on('scroll', function () {
        let st = $(this).scrollTop()
        //IOS bounce scroll 처리조건 추가
        if (st < lastScrollTop || st <= 0) {
          $('.quick_menu').removeClass('off')
        } else {
          $('.quick_menu').addClass('quick_menu off')
        }
        lastScrollTop = st
      })
    }
  })
  
  window.onpopstate = function (event) {
    console.log('%c ##### popState #####', 'background: #222; color: #bada55')
    setTimeout('WEBTOURFNC.headerLogo()',1000)
    document.querySelector('body').classList.remove('js_right_view')
  }

  //최초 진입시 quick_menu off처리
  if (
    location.href.indexOf('mwtdom.hanatour.com') > -1 ||
    location.href.indexOf('mfnd.hanatour.com/ko/product/') > -1 ||
    location.href.indexOf('dev-user-mobile.hanatour.com/ko/product/') > -1
  ) {
    $('.quick_menu').addClass('quick_menu off') //<div class="quick_menu off"> 처리
  }

  //스케줄러 홈 진입 시, 하단 GNB 스케줄러 애니메이션 활성화
  if (location.href.indexOf('mscheduler.hanatour.com') > -1) {
    animSchedule.setDirection(1)
    animSchedule.play()
    $('#schedule_li').addClass('on')
  }

  //페이지 전환 감지(주기 1초)
  let currLocation = location.href
  setInterval(function () {
    if (currLocation !== location.href) {
      if (location.href.indexOf('mscheduler') === -1) {
        //스케줄러는 페이지 전환 감지 제외처리
        wtjs.ui.headerTypeChange() //상단GNB 변경
      }
      let quickMenuOff = false
      quickMenuOff =
        location.href.indexOf('mwtdom.hanatour.com') > -1 ||
        location.href.indexOf('mfnd.hanatour.com/ko/product/') > -1 ||
        location.href.indexOf('dev-user-mobile.hanatour.com/ko/product/') > -1
      //GNB 미노출 처리(웹투어,fnd 별도 케이스)
      if (quickMenuOff) {
        $('.quick_menu').addClass('quick_menu off') //<div class="quick_menu off"> 처리
      } else {
        $('.quick_menu').removeClass('off')
      }
      //스케줄러 내부에서 history back으로 스케줄러 홈 재진입시, 헤더색상/애니메이션 활성화 처리
      if (location.href === schedulerDomain) {
          let isDCR = isDCRApp()
          if (isDCR) {
            $('.quick_menu').addClass('quick_menu off')
            return
          }
          //스케줄러 홈 스크롤 시, 헤더 색상 제어
          $(window).scroll(function () {
            $('.header_wrap').addClass('sched_home')
            var height = $(document).scrollTop()
            if (height > 0) {
              $('.header_wrap').addClass('fixed')
            } else if (height == 0) {
              $('.header_wrap').removeClass('fixed')
            }
          })
          //하단 GNB 스케줄러 애니메이션 활성화
          animSchedule.setDirection(1)
          animSchedule.play()
          $('#schedule_li').addClass('on')
      }
      //웹투어 예약 페이지 - 네이티브 하단GNB 미노출 임시처리
      if (location.pathname === '/domestic/da_reserve_check.asp'){
        let isApp = isHybridApp()
        let isIOS = isIOSApp()
        let isDCR = isDCRApp()
        let param = '{"scheme":"dcr","tag":"hide","params":{"label":"gnbTabBar","type":"animation"}}'
        if(isApp){
          if(isIOS !== 'Y' && isDCR) { //AOS
            //console.log(':::: 웹투어 예약 페이지 - AOS 호출')
            window.htmlEventHandler.hanatourapp(param)
          }
        }
      }
      currLocation = location.href
    }
  }, 1000)

  //통합검색 추천검색어,추천키워드 api 호출
  let getParams = '&srwrDvCd=SWD02&srwrExprDvCd=M&srwrNm=' //srwrExprDvCd : P(PC),M(모바일)

  wtjs.ajax(
    `${apiUrl}/open/comSrhApiCategory/getListSrhTourApi?_siteId=${webtourSiteId}${getParams}`,
    { credentials: true, method: 'GET' },
    function (data) {
      if (data.resultMessage === 'SUCCESS') {
        if (data.getListSrhConfig.srwrMgmtLst.length > 0) {
          let index = RERIGHT.getRandomInt(0, data.getListSrhConfig.srwrMgmtLst.length)
          document.querySelector('button.srch_find').value =
            data.getListSrhConfig.srwrMgmtLst[index].lnkSrwrNm //추천키워드 세팅
          document.querySelector('button.srch_find').innerHTML =
            data.getListSrhConfig.srwrMgmtLst[index].srwrNm //추천검색어 세팅
        }
      }
    }
  )
}

document.write(`

<div id="footer" class="footer">
	<a href="#" class="js_act btn_top"><span>Top으로 가기</span></a>
	<ul class="global_link" style="display:flex;">
		${logInOut(wtjs.isLoginFromHanatour)}
		<li style="flex:1 1 auto;"><a href="${webtourDomain}${URLS['공지사항']}">공지사항</a></li>
		<li style="flex:1 1 auto;"><a href="${webtourDomain}${URLS['고객센터']}">고객센터</a></li>
	</ul>
	<div class="office_info_wrap">
		<ul class="link_etc">
			<li><a href="${webtourDomain}${URLS['이용약관']}">이용약관</a></li>
			<li><a href="${webtourDomain}${URLS['개인정보처리방침']}"><strong>개인정보처리방침</strong></a></li>
			<li><a href="${webtourDomain}${URLS['여행약관']}">여행약관</a></li>
			<li><a href="${webtourDomain}${URLS['해외여행자보험']}">해외여행자보험</a></li>
			<li><a href="${webtourDomain}${URLS['마케팅제휴']}">마케팅제휴</a></li>
			<li><a href="${webtourDomain}${URLS['공식인증예약센터 검색']}">공식인증예약센터 검색</a></li>
		</ul>
	</div>
  ${wtjs.ui.cobrand('footer')}
  ${RERIGHT.ui.gnb()}
<!-- <script async src=\"https://googletagmanager.com/gtag/js?id=UA-23076506-21\" target=\"_blank\"><\/script> -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-23076506-21');
<\/script>
<script src="${webtourDomain}/fx/lib/kakao.min.js"></script>
</div>

<div class="lypop_wrap full slide fade" id="search_word_layer">
	<div class="inr" style="height: 100%;">
		<div class="lypop_container">
			<div class="lypop_cont">
				<div class="lypop_header">
					<a href="javascript:WEBTOURFNC.js_close()" class="btn_prev_none js_close"><span>이전페이지</span></a>
					<div class="searchform_com">
						<form onSubmit="return false;" role="search">
							<fieldset class="fld_search">
								<legend class="blind">통합 검색어 입력폼</legend>
								<div class="box_search">
									<input type="text" class="input_keyword" value="" name="" title="검색어" placeholder="검색어를 입력해주세요." id="wtjs_search" onkeydown="WEBTOURFNC.enterkey(event)">
									<!--
									ITS : 검색어를 입력해주세요.
									PKG : 국가나 도시명을 입력해주세요.
									-->
									<a href="#none" class="btn_search" onClick="WEBTOURFNC.btn_search()"><span>검색</span></a>
								</div>
							</fieldset>
						</form>
					</div>
				</div>
				<div class="lypop_body">
					<div class="hash_group linkList">
						<!--
						<a href="#none" class="hashtag tag_hash2">#가족추천여행</a>
						<a href="#none" class="hashtag tag_hash2">#효도여행</a>
						<a href="#none" class="hashtag tag_hash2">#다낭패키지</a>
						<a href="#none" class="hashtag tag_hash2">#힐링여행</a>
						<a href="#none" class="hashtag tag_hash2">#서유럽패키지</a>
						<a href="#none" class="hashtag tag_hash2">#럭셔리휴양지</a>
						-->
					</div>

					<div class="cont_unit type">
						<div class="js_tabs link mt40">
							<ul class="tabs">
								<li id="review01"><a href="javascript:WEBTOURFNC.js_tabs01()">최근 검색어</a></li>
								<li class="selected" id="review02"><a href="javascript:WEBTOURFNC.js_tabs02()">인기 검색어</a></li>
							</ul>
						</div>

						<div class="list_srchword_wrap" id="review01_list" style="display: none;">
							<ul class="list_srchword type linkList" id="list_srchword">
							</ul>
							<div class="option_wrap mt20">
								<span class="right_cont">
									<a href="#" class="btn txt line js_act_all" onclick="wtjs.removeKeyword()">전체삭제</a>
								</span>
							</div>
						</div>

						<div class="list_srchword_wrap" id="review02_list">
							<ol class="list_srchword type linkList" id="list_srchword">
							</ol>
						</div>
					</div>
				</div>
				<div class="lypop_footer">
					<div class="cancel_wrap bottom">
						<a href="javascript:WEBTOURFNC.js_close()" class="btn txt line js_close">취소</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="lypop_wrap bottom fade" id="share_list" style="display: none;" aria-hidden="false">
	<div class="inr">
		<div class="lypop_container" tabindex="0">
			<div class="lypop_cont">
				<div class="lypop_header">
					<strong class="tit" id="share_list01" onClick="WEBTOURFNC.share_list01()">공유하기</strong>
					<button type="button" class="btn_cls js_close" onClick="WEBTOURFNC.btn_cls()"><span>닫기</span></button>
				</div>
				<div class="lypop_body">
					<ul class="default_list sns_list mt5"> 
						<li><a href="javascript:WEBTOURFNC.sns_kakao()" class="sns_kakao">카카오톡</a></li>
						<li><a href="javascript:WEBTOURFNC.sns_kakaostory()" class="sns_kakaostory">카카오스토리</a></li>
						<li><a href="javascript:WEBTOURFNC.sns_facebook()" class="sns_facebook">페이스북</a></li>
						<li><a href="#" onClick="WEBTOURFNC.sns_mail()" id="mailLink" class="sns_mail">메일공유</a></li>
						<li><a href="#" onClick="WEBTOURFNC.sns_mms()" id="smsLink" class="sns_mms">문자보내기</a></li>
						<li><a href="javascript:WEBTOURFNC.sns_url()" class="sns_url">링크복사(URL복사)</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="lypop_fade01 fade"></div>

<div class="right_menu">
		<div class="allmenu_cont">
		
		<div id="m_search" class="mainType"> 
			<div class="srch_find_wrap"> 
				<button type="button" class="srch_find eps" value="" onClick="WEBTOURFNC.srch_find()">어디로 떠날까요?</button>
				<a href="javascript:WEBTOURFNC.rcm_find()" class="rcm_find"></a>
			</div>
		</div>
		<a href="javascript:(document.querySelector('body').classList.remove('js_right_view'));history.back()" class="js_act btn_right_menu_close">메뉴닫기</a>

			<div class="pkgtour_list">
				<!-- 전체메뉴 -->
				${RERIGHT.rebuild()}
			</div>
		</div>
		<!-- //allmenu_cont -->

		<!-- 고객센터 영역 -->
		<ul class="cus_center">
			<li><a href="${webtourDomain}/com/cuc/CHPC0CUC0100M100">고객센터</a></li>
			<li><a href="${webtourDomain}/com/cuc/CHPC0CUC0001M100">자주찾는질문</a></li>
			<li><a href="${webtourDomain}/com/cuc/CHPC0CUC0004M100">공지사항</a></li>
		</ul>		  
</div> 
<div class="lypop_fade02 fade"></div>
<!-- //right_menu -->
`)

$('#btn_aco').css({
  background:
    '#fff url(https://image.hanatour.com/usr/static/img2/mobile/com/ico_acc_down.png) no-repeat 100% 50%',
  'background-size': '1.3rem auto',
  display: 'inline-block',
  padding: '0 2rem 0 0',
})

/**
 * lottie 애니메이션(하단GNB)
 */
var animLocation = lottie.loadAnimation({
  //플레이스
  container: document.getElementById('ic_location'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: 'https://image.hanatour.com/usr/static/json/mobile/gnb/ic_location.json',
})

var animSchedule = lottie.loadAnimation({
  //플래너
  container: document.getElementById('ic_schedule'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: 'https://image.hanatour.com/usr/static/json/mobile/gnb/ic_schedule.json',
})

var animHome = lottie.loadAnimation({
  //홈
  container: document.getElementById('ic_home'),
  renderer: 'svg',
  loop: false,
  autoplay: true,
  path: 'https://image.hanatour.com/usr/static/json/mobile/gnb/ic_home.json',
})

var animMy = lottie.loadAnimation({
  //마이페이지
  container: document.getElementById('ic_my'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: 'https://image.hanatour.com/usr/static/json/mobile/gnb/ic_my.json',
})

var animLike = lottie.loadAnimation({
  //최근본/찜
  container: document.getElementById('ic_like'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: 'https://image.hanatour.com/usr/static/json/mobile/gnb/ic_like.json',
})

var animHeaderLogo = lottie.loadAnimation({
  //상단로고
  container: document.getElementById('ic_header_logo'),
  renderer: 'svg',
  loop: false,
  autoplay: true,
  path: 'https://image.hanatour.com/usr/static/json/mobile/com/logo_hana.json',
})

var WEBTOURFNC = {
  /**
   * 헤더 버튼 클릭 시, 앱 분기 처리
   * 전체메뉴/통검 돋보기/전체도시/홈
  */
  rightMenuClick: function(){ //전체메뉴
    // console.log(':::: rightMenuClick() call')
    let isIOS = isIOSApp()
    let isDCR = isDCRApp()
    $('.lypop_fade02').fadeIn(1000).addClass('fade') 
    $('.lypop_fade02').fadeOut(1000).removeClass('fade') 
    let param = '{"scheme":"dcr", "tag":"show", "params":{"label":"totalMenu","type":"animation"}}'
    if (isIOS === 'Y' && isDCR) { //IOS
      //console.log(':::: 전체메뉴 - IOS 호출')
      window.webkit.messageHandlers.hanatourapp.postMessage(param)
    } else if(isDCR) { //AOS
      //console.log(':::: 전체메뉴 - AOS 호출')
      window.htmlEventHandler.hanatourapp(param)
    } else {
      //console.log(':::: 전체메뉴 - WEBVIEW 호출')
      document.querySelector('body').classList.add('js_right_view')
      history.pushState('rightMenuOn', null, location.href + '#')
    }
    //CRM 태깅(헤더) - 전체메뉴
    this.setCrmHeaderMenu('ALL','전체메뉴')
  },
  btnSearchClick: function(){ //통검 돋보기
    // console.log(':::: btnSearchClick() call')
    let isIOS = isIOSApp()
    let isDCR = isDCRApp()
    let param = '{"scheme":"dcr", "tag":"show", "params":{"label":"search","type":"animation"}}'
    if (isIOS === 'Y' && isDCR) { //IOS
      //console.log(':::: 통합검색 - IOS 호출')
      window.webkit.messageHandlers.hanatourapp.postMessage(param)
    } else if(isDCR) { //AOS
      //console.log(':::: 통합검색 - AOS 호출')
      window.htmlEventHandler.hanatourapp(param)
    } else {
      //console.log(':::: 통합검색 - WEBVIEW 호출')
      this.js_act_btn_search()
    }
  },
  btnAllClick: function(){ //전체도시
    // console.log(':::: btnAllClick() call')
    let isIOS = isIOSApp()
    let isDCR = isDCRApp()
    let param = '{"scheme":"dcr", "tag":"show", "params":{"label":"totalCity","type":"animation"}}'
    if (isIOS === 'Y' && isDCR) { //IOS
      //console.log(':::: 전체도시 - IOS 호출')
      window.webkit.messageHandlers.hanatourapp.postMessage(param)
    } else if(isDCR) { //AOS
      //console.log(':::: 전체도시 - AOS 호출')
      window.htmlEventHandler.hanatourapp(param)
    } else {
      //console.log(':::: 전체도시 - WEBVIEW 호출')
      let moveUrl = webtourDomain + URLS['전체도시']
      location.href = moveUrl
    }
  },

  //화면 이동
  go: function (url, lnkTarget, menuName, menuId) {
    this.setCrmHeaderMenu('ALL',menuName,menuId) //CRM태깅
    //화면이동 없음 scrnLnkMthdDvCd: "0"
    //화면이동 scrnLnkMthdDvCd: "1"
    //새창 scrnLnkMthdDvCd: "2"
    if (lnkTarget === '2') {
      //새창:"2"
      document.querySelector('body').classList.remove('js_right_view')
      window.open(url)
    } else if (lnkTarget === '1') {
      //화면이동:"1"
      if (url) {
        document.querySelector('body').classList.remove('js_right_view')
        let moveUrl = url.indexOf('http') === -1 ? webtourDomain + url : url //일치하는 값이 없으면 -1을 반환
        location.href = moveUrl
      } else {
      }
    } else {
      //화면이동 없음:"0"
      return
    }
  },
  js_act_btn_search: function () {
    $('#search_word_layer.lypop_wrap.slide.fade').css('top', '0')
    $('body').css({ overflow: 'hidden', position: 'fixed', height: '100%', width: '100%' })
    $('.lypop_fade02').fadeIn(1000).addClass('fade') 
    $('.lypop_fade02').fadeOut(1000).removeClass('fade') 
    wtjs.clickSearch(
      document.querySelector('.input_keyword'),
      document.querySelector('div.js_tabs.link'),
      document.querySelector('div.list_srchword_wrap')
    )
  },
  //검색 버튼
  btn_search: function () {
    $('#search_word_layer').css({ display: 'block', top: '0' })
    this.search(document.querySelector('.input_keyword').value)
  },

  js_close: function () {
    $('#search_word_layer').css({ top: '100%' }).css({ display: 'block' })

    $('body').removeAttr('style')
    $('.js_tabs .tabs li').removeClass('selected')
    $('#review02').addClass('selected')

    $('.list_srchword_wrap').css('display', 'none')
    $('#review02_list').css('display', 'block')
  },

  //최근 검색어
  js_tabs01: function () {
    $('.js_tabs .tabs li').removeClass('selected')
    $('#review01').addClass('selected')

    $('.list_srchword_wrap').css('display', 'none')
    $('#review01_list').css('display', 'block')
  },

  //인기 검색어
  js_tabs02: function () {
    $('.js_tabs .tabs li').removeClass('selected')
    $('#review02').addClass('selected')

    $('.list_srchword_wrap').css('display', 'none')
    $('#review02_list').css('display', 'block')
  },

  btn_aco: function () {
    $('#footer_aco').slideToggle('slow', function (e) {
      if ($(this).css('display') === 'none') {
        $('#btn_aco').css({
          background:
            '#fff url(https://image.hanatour.com/usr/static/img2/mobile/com/ico_acc_down.png) no-repeat 100% 50%',
          'background-size': '1.3rem auto',
          display: 'inline-block',
          padding: '0 2rem 0 0',
        })
      } else {
        $('#btn_aco').css({
          background:
            '#fff url(https://image.hanatour.com/usr/static/img2/mobile/com/ico_acc_up.png) no-repeat 100% 50%',
          'background-size': '1.3rem auto',
          display: 'inline-block',
          padding: '0 2rem 0 0',
        })
      }
    })
  },

  //통검 입력필드
  srch_find: function () {
    document.querySelector('body').classList.remove('js_right_view') 
    $('#search_word_layer.lypop_wrap.slide.fade').css('top', '0')
    $('body').css({ overflow: 'hidden', position: 'fixed', height: '100%', width: '100%' })
    wtjs.clickSearch(
      document.querySelector('.input_keyword'),
      document.querySelector('div.js_tabs.link'),
      document.querySelector('div.list_srchword_wrap')
    )
  },
  //통검 결과페이지로 이동
  search: function (keyword) {
    let isIOS = isIOSApp()
    let isDCR = isDCRApp()
    let moveUrl = webtourDomain + '/com/its/CHPC0ITS0002M100?keyword=' + keyword + '&keywordCateg=DS'
    let param = '{"scheme":"dcr","tag":"moveURL","params":{"url":"'+moveUrl+'"}}'
    if (isIOS === 'Y' && isDCR) { //IOS
      //console.log(':::: 통합검색 결과페이지 - IOS 호출')
      window.webkit.messageHandlers.hanatourapp.postMessage(param)
    } else if(isDCR) { //AOS
      //console.log(':::: 통합검색 결과페이지 - AOS 호출')
      window.htmlEventHandler.hanatourapp(param)
    } else {
      //console.log(':::: 통합검색 결과페이지 - WEBVIEW 호출')
      location.href = moveUrl
    }
  },
  //추천키워드 검색 버튼
  rcm_find: function () {
    let isIOS = isIOSApp()
    let isDCR = isDCRApp()
    let recommendRealSearchKey = ''
    recommendRealSearchKey = document.querySelector('button.srch_find').value
    if (recommendRealSearchKey.indexOf('http') > -1) { //추천키워드가 URL 형식인 경우
        let param = '{"scheme":"dcr","tag":"moveURL","params":{"url":"'+recommendRealSearchKey+'"}}'
        if (isIOS === 'Y' && isDCR) { //IOS
          //console.log(':::: 추천키워드(URL형식) - IOS 호출')
          window.webkit.messageHandlers.hanatourapp.postMessage(param)
        } else if(isDCR) { //AOS
          //console.log(':::: 추천키워드(URL형식) - AOS 호출')
          window.htmlEventHandler.hanatourapp(param)
        } else {
          //console.log(':::: 추천키워드(URL형식) - WEBVIEW 호출')
          location.href = recommendRealSearchKey
        } 
    } else { //추천키워드가 키워드 형식인 경우
      let keyword = encodeURIComponent(recommendRealSearchKey)
      let keywordUrl = webtourDomain+'/com/its/CHPC0ITS0002M100?keyword='+keyword+'&keywordCateg=DS'
      let param = '{"scheme":"dcr","tag":"moveURL","params":{"url":"'+keywordUrl+'"}}'
        if (isIOS === 'Y' && isDCR) { //IOS
          //console.log(':::: 추천키워드(키워드형식) - IOS 호출')
          window.webkit.messageHandlers.hanatourapp.postMessage(param)
        } else if(isDCR) { //AOS
          //console.log(':::: 추천키워드(키워드형식) - AOS 호출')
          window.htmlEventHandler.hanatourapp(param)
        } else {
          //console.log(':::: 추천키워드(키워드형식) - WEBVIEW 호출')
          this.search(recommendRealSearchKey)
        } 
    }
  },

  //자동 검색시 엔터
  enterkey: function (e) {
    if (e.keyCode == 13) {
      let text = document.querySelector('#wtjs_search').value
      this.search(text)
    }
  },

  headerLogo: function() {
    lottie.loadAnimation({
      //상단로고
      container: document.getElementById('ic_header_logo'),
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'https://image.hanatour.com/usr/static/json/mobile/com/logo_hana.json',
    })
  },

  /* SNS 공유하기 */
  //레이어팝업 노출 처리
  js_act_btn_share: function () {
    //var $_item_index = $('.btn_share').index(this)
    $('#share_list').addClass('show')
    $('#share_list').css('display', 'block')
    $('.lypop_fade01').css('display', 'block')
    $("body").css("overflow", "hidden")
  },
  //레이어팝업 닫힘 처리
  btn_cls: function () {
    $('#share_list').removeClass('show')
    $('#share_list').css('display', 'none')
    $('.lypop_fade01').css('display', 'none')
    $("body").css("overflow", "auto")
  },

  //1. 카카오톡
  sns_kakao: function () {
    let host = location.host
    if (RERIGHT.kakao_init === false) {
      if ((host.indexOf('dev') || host.indexOf('local')) > -1) {
        Kakao.init('b59754592eb89eb291fdcece3083f29b') //개발
      } else if (host.indexOf('stg') > -1) {
        Kakao.init('c842aa88651171e40ad3360021d6e401') // 스테이징
      } else {
        Kakao.init('e47e8d1f39e8b7d3c5902720cc218599') // 운영
      }
      RERIGHT.kakao_init = true
    }
    if (RERIGHT.params.imgUrl === '') {
      // console.log(':::: kakao - objectType : text')
      Kakao.Link.sendDefault({
        objectType: 'text',
        text: RERIGHT.params.name,
        link: {
          mobileWebUrl: RERIGHT.params.buttonUrl,
          webUrl: RERIGHT.params.buttonUrl,
        },
      })
    } else {
      let imgHeight = 216
      if(location.href.indexOf('travel-style') > -1){ //MBTI의 경우, 이미지 1:1비율 적용(단위는 px)
        imgHeight = 414
      }
      if(RERIGHT.params.buttonTitle2 !== undefined && RERIGHT.params.buttonUrl2 !== undefined){
        Kakao.Link.sendDefault({
          objectType: 'feed',
          content: {
            title: RERIGHT.params.name,
            description: RERIGHT.params.description,
            imageUrl: RERIGHT.params.imgUrl,
            imageWidth: 414,
            imageHeight: imgHeight,
            link: {
              mobileWebUrl: RERIGHT.params.buttonUrl,
              webUrl: RERIGHT.params.buttonUrl,
            },
          },
          installTalk: true,
          buttons: [
            {
              title: RERIGHT.params.buttonTitle,
              link: {
                mobileWebUrl: RERIGHT.params.buttonUrl,
                webUrl: RERIGHT.params.buttonUrl,
              },
            },
            {
              title: RERIGHT.params.buttonTitle2,
              link: {
                mobileWebUrl: RERIGHT.params.buttonUrl2,
                webUrl: RERIGHT.params.buttonUrl2,
              },
            }
          ],
        })
      } else {
        Kakao.Link.sendDefault({
          objectType: 'feed',
          content: {
            title: RERIGHT.params.name,
            description: RERIGHT.params.description,
            imageUrl: RERIGHT.params.imgUrl,
            imageWidth: 414,
            imageHeight: imgHeight,
            link: {
              mobileWebUrl: RERIGHT.params.buttonUrl,
              webUrl: RERIGHT.params.buttonUrl,
            },
          },
          installTalk: true,
          buttons: [
            {
              title: RERIGHT.params.buttonTitle,
              link: {
                mobileWebUrl: RERIGHT.params.buttonUrl,
                webUrl: RERIGHT.params.buttonUrl,
              },
            },
          ],
        })
      }
    }
    //} //end if
    // } //end link()
  },

  //2. 카카오스토리
  sns_kakaostory: function () {
    //(닷컴)linkStory()
    // 모바일 앱 인 경우 웹페이지주소로 연결해야함.
    let url = RERIGHT.params.url
    let text = ''
    url = url.replace('appdevtour', 'mdevtour')

    if (RERIGHT.kakao_init === false) {
      Kakao.init('b59754592eb89eb291fdcece3083f29b')
      RERIGHT.kakao_init = true
    }
    Kakao.Story.share({
      url: url,
      text: RERIGHT.params.name,
    })
  },

  //3. 페이스북
  sns_facebook: function () {
    //(닷컴)link()
    let isApp = isHybridApp()
    let isIOS = isIOSApp()
    let device = RERIGHT.checkDevice()
    let url = `https://www.facebook.com/sharer.php?u=` + RERIGHT.params.url

    if (isApp) {
      var param = '{"scheme":"common", "tag":"movePage", "params":{"url":"' + url + '"}}'
      if (isIOS === 'Y') {
        window.webkit.messageHandlers.hanatourapp.postMessage(param)
      } else {
        window.open(url, '_blank')
      }
    } else {
      if (device === 'PC') {
        window.open(url, 'width=200,height=200,left=600', '_blank')
      } else {
        window.open(url, '_blank')
      }
    }
  },

  //4. 메일공유
  sns_mail: function () {
    // (닷컴) mailShare2()
    let url = RERIGHT.getShortUrl()
    let href = `mailto:?subject=${RERIGHT.params.name}&body=${RERIGHT.params.description}%0D%0A%0D%0A${url}`
    mailLink.setAttribute('href', href)
  },

  //5. 문자보내기
  sns_mms: function () {
    // (닷컴) (웹일때)smsSend() / (앱일때)DialogShareSNS
    // 문구 + 팝업주체화면 url 을 붙여서 문자메시지 바디로 보낸다
    let phoneNum = ''
    let url = RERIGHT.getShortUrl()
    let msg = ''
    let msgBody = ''
    msg = RERIGHT.params.name + RERIGHT.params.description
    msgBody = encodeURIComponent(msg + '\r\n' + url)
    let isApp = isHybridApp()
    if (isApp) {
      RERIGHT.doShareSMS(msg + '\\n\\n' + url)
    } else {
      var href = `sms:${phoneNum}?&body=${msgBody}`
      smsLink.setAttribute('href', href)
    }
  },

  //6. 링크복사(URL복사)
  sns_url: function () {
    // (닷컴) urlCopy()
    let url = RERIGHT.getShortUrl()
    let isIOS = isIOSApp()
    let res = false
    if(isIOS === 'Y'){
      navigator.clipboard.writeText(url)
        .then(() => {
          alert('클립보드 복사 성공하였습니다.')
        })
        .catch(err => {
          // console.log(':::: err : ',err)
          alert('클립보드 복사 실패하였습니다.')
        })
    } else {
      let tempItem = document.createElement('input')
      tempItem.setAttribute('type','text')
      tempItem.setAttribute('display','none')
      tempItem.setAttribute('value',url)
      document.body.appendChild(tempItem)
      tempItem.select()
      res = document.execCommand('Copy')
      tempItem.parentElement.removeChild(tempItem)
      if(res){
        alert('클립보드 복사 성공하였습니다')
      }else{
        alert('클립보드 복사 실패하였습니다')
      }
    }
  },

  /**
   * lottie 애니메이션(하단GNB)
   */
  /* onmouseover */
  onMouseOverLocation: function () {
    //플레이스
    animLocation.setDirection(1)
    animLocation.play()
  },
  onMouseOverSchedule: function () {
    //플래너
    animSchedule.setDirection(1)
    animSchedule.play()
  },
  onMouseOverHome: function () {
    //홈
    animHome.setDirection(1)
    animHome.play()
  },
  onMouseOverMy: function () {
    //마이페이지
    animMy.setDirection(1)
    animMy.play()
  },
  onMouseOverLike: function () {
    //최근본/찜
    animLike.setDirection(1)
    animLike.play()
  },

  /* onmouseleave */
  onMouseLeaveLocation: function () {
    //플레이스
    animLocation.setDirection(-1)
    animLocation.play()
  },
  onMouseLeaveSchedule: function () {
    //플래너
    animSchedule.setDirection(-1)
    animSchedule.play()
  },
  onMouseLeaveHome: function () {
    //홈
    animHome.setDirection(-1)
    animHome.play()
  },
  onMouseLeaveMy: function () {
    //마이페이지
    animMy.setDirection(-1)
    animMy.play()
  },
  onMouseLeaveLike: function () {
    //최근본/찜
    animLike.setDirection(-1)
    animLike.play()
  },

  //CRM 태깅(헤더)
  setCrmHeaderMenu(menuType,menuName,menuId){
    let isDCRMain = this.isDCRMain()
    if (!isDCRMain) {
      //console.log(':::: setCrmHeaderMenu() skip')
      return
    }
    try{
        let crmParams={}
        //메뉴타입
        crmParams.menuType = menuType
        //메뉴ID
        crmParams.menuId = menuId !== undefined ? menuId : ''
        //메뉴명
        crmParams.menuName = menuName
        this.setEvent('main_menu', crmParams)
      }catch(e){
        console.log(':::: setCrm header_menu e:::', e)
      }
  },

  //CRM 태깅(하단GNB)
  setCrmMainMenu(menuType, menuName, menuDepth){
    let isDCRMain = this.isDCRMain()
    if (!isDCRMain) {
      //console.log(':::: setCrmMainMenu() skip')
      return
    }
    try{
        let crmParams={}
        //메뉴타입
        crmParams.menuType = menuType
        //메뉴명
        crmParams.menuName = menuName.replace('지역여행','플레이스')
        //메뉴순번
        crmParams.menuDepth = menuDepth
        this.setEvent('main_menu', crmParams)
      }catch(e){
        console.log(':::: setCrm main_menu e : ', e)
      }
  },
  setEvent(eventKey, data) {
    //console.log(':::: setEvent > eventKey : ',eventKey,' / data : ',data)
    let isApp = isHybridApp()
    let isIOS = isIOSApp()
    //모바일 웹인 경우
    try {
      data.bSessionId = wtjs.getCookie('bSessionId')
      data.locationPathname = location.pathname
      data.prePage = location.pathname
      data.resPathCd = isApp ? 'MDA' : 'DCM'
      data.isLogin = getCookie('hnt_uid') !== null && getCookie('hnt_uid') !== '' ? true : false
      //console.log(':::: setEvent > isApp : ',isApp,' / isIOS : ',isIOS,' / checkAppBuildVersion() : ',this.checkAppBuildVersion())
      if (isApp) {
        //console.log(':::: setEvent > App')
        if (this.checkAppBuildVersion()) {
          const params = {}
          params[eventKey] = data
          this.callApp('Amplitude', 'AmplitudeEvent', params)
          this.callApp('Braze', 'BrazeEvent', params)
        }
      } else {
        //console.log(':::: setEvent > Mobile Web')
        amplitude.logEvent(eventKey, data)
        appboy.logCustomEvent(eventKey, data)
        appboy.requestImmediateDataFlush()
        //console.log(':::: setEvent > success')
      }
    } catch (e) {
      console.log(':::: CRM setEvent function call error >>>>> ', e)
    }
  },
  checkAppBuildVersion() {
    let isIOS = isIOSApp()
    try {
      let appBuildVersion = Number(navigator.userAgent.split('+')[1])
      if (this.checkHanaApp() && isIOS === 'Y' && appBuildVersion >= 188) { //IOS
        return true
      } else if (this.checkHanaApp() && isIOS === 'N' && appBuildVersion >= 817) { //AOS
        return true
      }
      return false
    } catch (e) {
      console.log(':::: version error >>>>> ', e)
      return false
    }
  },
  checkHanaApp() {
    return /hanatourApp/.test(navigator.userAgent)
  },
  callApp(scheme, tag, data) {
    //console.log(':::: callApp() call')
    let isIOS = isIOSApp()
    let appParam = {
      scheme: scheme,
      tag: tag,
      params: data,
    }
    //console.log(':::: appParam : ',appParam)
    if (isIOS === 'Y') {
      //console.log(':::: ios bridge call - start')
      window.webkit.messageHandlers.hanatourapp.postMessage(appParam)
      //console.log(':::: ios bridge call - finish')
    } else {
      //console.log(':::: aos bridge call - start')
      window.marketingEventHandler.hanatourapp(JSON.stringify(appParam))
      //console.log(':::: aos bridge call - finish')
    }
  },
  isDCRMain() {
    return location.pathname === '/dcr/'
  },
}
