function externalSetHeight(){
    var browser = detect.parse(navigator.userAgent);
    console.log('原始检测结果:'+browser.browser.family)
    console.log(typeof(browser.browser.family))
    console.log(document.getElementById('external'))
    let pageraw = document.getElementById('external')
    let pageElements = document.defaultView.getComputedStyle(pageraw,null);
    let pageHeight = pageElements.height;
    if (browser.browser.family === 'Chrome'){
        console.log('检测到Chorme浏览器')
            console.log('此次调整来源于外部网页调整')
            console.log('获取到的本页高度'+pageHeight)
            setHeight(2,'pageDisplay','',pageHeight + "px",'')
            return;
    }
    else if (browser.browser.family === 'Firefox'){
        console.log('检测到Firefox浏览器')
            console.log('此次调整来源于外部网页调整')
            console.log('获取到的本页高度'+pageHeight)
            setHeight(2,'pageDisplay','',pageHeight-50+ "px",'')
            return;
}
    else{
        console.log('未匹配到特异性浏览器，采取通用配置')
            console.log('此次调整来源于外部网页调整')
            console.log('获取到的本页高度'+pageHeight)
            setHeight(2,'pageDisplay','',pageHeight+ "px",'')
            return;
    }
}

function getStyle(element, attr) {
    if(element.currentStyle) {
           return element.currentStyle[attr];
   } else {
            return getComputedStyle(element, false)[attr];
    }
}