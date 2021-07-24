//使侧边栏与内容栏div高度相同,同时利用传入参数判断是否进行拦截postId解析动作，解析id优先级高于页面调整
function setHeight(mode,Arg1,Arg2,idOne,idTwo) {//mode 0 以id为根据调整 mode 1 以绝对高度指定，后两参数必填 mode 2 单方调整，与sidebar高度做比
    console.log('<----高度调整模块动作---->')
    switch(mode){
        case 0:{
            console.log('自动根据id调整高度')
            console.log('调整高度的两个div id分别为'+Arg1+' '+Arg2)
            let objContent = document.getElementById(Arg1);
            let objSide = document.getElementById(Arg2);
            console.log('idOne高度:'+objContent.offsetHeight+'  idTwo高度:'+objSide.offsetHeight);
            
            if (objContent.offsetHeight> objSide.offsetHeight) {
                objSide.style.height = objContent.offsetHeight + "px";
                console.log('设置容器高度:'+objContent.offsetHeight);
                }
            else {
                objContent.style.height = objSide.offsetHeight + "px";
                console.log('应设置高度:'+objSide.offsetHeight + "px");
                console.log('设置容器高度:'+objContent.offsetHeight);
                }
                // apppost.contentShow = false;
                console.log("页面高度已调整");
                return;
    }
        case 1:{
            console.log('手动调整id高度')
            console.log('调整高度的两个div id分别为'+idOne+' '+idTwo)
            let objContent = document.getElementById(idOne);
            let objSide = document.getElementById(idTwo);
            console.log('idOne高度:'+objContent.offsetHeight+'  idTwo高度:'+objSide.offsetHeight);
            objContent.style.height = Arg1 + "px";
            objSide.style.height = Arg2 + "px";
            console.log('两个div高度已经手动调整')
            return;
        }
        case 2:{
            console.log('自动根据id调整与sidebar的高度')
            console.log('调整高度的两个div id分别为'+Arg1+' '+'sidebarh')
            let objContent = document.getElementById(Arg1);
            let objSide = document.getElementById('sidebarh');
            console.log('idOne高度:'+objContent.offsetHeight+'  idTwo高度:'+objSide.offsetHeight);
            console.log('手动指定的高度:'+idOne)
            objContent.style.height= idOne;
            if (objContent.offsetHeight>= objSide.offsetHeight) {
                objSide.style.height = objContent.offsetHeight + "px";
                console.log('设置容器高度:'+objContent.offsetHeight);
                console.log('objside高度设置为：'+objSide.style.height)
                console.log('objContent高度设置为：'+objContent.offsetHeight)
                objContent.style.height = objContent.offsetHeight + "px";
                console.log('objContent style为:'+objContent.style.height)
                console.log("页面高度已调整");
                return;
                }
            else {
                objContent.style.height = objSide.offsetHeight + "px";
                console.log('应设置高度:'+objSide.offsetHeight + "px");
                console.log('设置容器高度:'+objContent.offsetHeight);
                }
                console.log("页面高度已调整");
                return;
        }
        }
        return;
    }

function realtime(){
    console.log('<----控件实时显示状态(仅加载时):---->')
    console.log('apppost(文章列表):'+apppost.listShow)
    console.log('postControl(文章详情):'+postControl.show)
    console.log('pageControl(页面打开):'+pageControl.show)
    console.log('暗黑模式状态:'+darkmode.isActivated())
}

function dynamicChangeHeight(){
    console.log('页面大小变化，自动调整元素');
    let objContent = 'contenth';
    let objSide = 'sidebarh';
    
    if (postControl.show == true){
        objContent = 'postArea';
    }
    else if (pageControl.show==true){
        objContent = 'pageDisplay'
    }
    console.log('此次调整来自于自动动态调整')
    setHeight(0,objSide,objContent,'','');
    realtime();
    return;
}

function intercept(){
    if (get('pageId')!==null){
        console.log('拦截到的pageId:'+get('pageId'));
        pageControl.openPage(get('pageId'));
        return;
    }
}


var apppost = new Vue({
    el: '#contenth',
    data:{
        contentShow : false,
        listShow : true,
        showId : '1',
        posts: [{
            id : "err",
            title : "请在线使用本网站！",
            briefcon : "由于跨域限制，请在dev.lzxweb.com访问本站，谢谢！"
        }]
     },
     created(){
        let myHeaders = new Headers({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain'
        });
        fetch('http://dev.lzxweb.com/ZCMS/articles/posts/postlist.json',{
            headers:myHeaders})//设置跨域请求，本地调试用，若部署到服务端建议删除本行代码
            .then( Response=> Response.json())
            .then(json => {
                this.posts = json
            })
            .then(function(){
                console.log('推送列表内容获取完成')
                console.log('解析到的推送id:'+get('postId'));
                if (get('postId')!== null) {
                    console.log('拦截请求，打开文章')
                    apppost.openPost();
                    return;
                }
                if (get('pageId')!==null){
                    console.log('检测到有页面打开，停止操作')
                    return;
                }
                console.log('此次调整来源于推送列表自动调整')
                setHeight(0,'contenth','sidebarh','','');
                realtime();
            })
    },
     methods: {
         openPost: function(){
             this.showId = get('postId'),
             console.log('解析到的id:'+this.showId),
             this.contentShow = true,
             this.listShow = false,
             console.log('加载的页面'+this.showId),
             //console.log(this.contentShow),
             postControl.Openpost(this.showId)
         },
     },
})

var postControl = new Vue({
     el : '#postArea',
     data:{
        show : false,
        showId : '1',
        showTitle : '此文章不存在',
        showContent : '此文章不存在，请返回首页！',
        posts:[],
        pageContent : 'null'
    },
    updated:() =>{
        console.log('本次调整来源于postControl的更新事件')
        setHeight(0,'postArea','sidebarh','','');
        realtime();
    },
    methods: {
        Openpost: function(id){
            fetch('http://dev.lzxweb.com/ZCMS/articles/posts/posts.json')
                .then( Response=> Response.json())
                .then(json => {
                this.posts = json
                console.log('已获取文章详情内容')
                console.log(this.posts)
                this.showPost(id)
        })
        },
        showPost: function(id){
            this.showId = id,
            this.show = true,
            console.log('<----推送控制器动作---->')
            this.showTitle = this.posts[id-1].title;
            this.showContent = this.posts[id-1].content;
            document.title = '刘祚先的个人博客-'+this.posts[id-1].title;
            console.log('页面Js部分渲染完成') 
        },
        
    },
})

var pageControl = new Vue({
    el:'#pageDisplay',
    data:{
        show : false,
    },
    updated:() =>{
        console.log('本次调整来源于pageControl更新事件')
        // setHeight(0,'pageDisplay','sidebarh','','');
        realtime();
    },
    methods:{
        openPage: function(id){
            // 利用JQuery调用外部网页，重新渲染文章列表作为外部用
            apppost.listShow = false;
            postControl.show = false;
            this.show = true;
            console.log('页面框架渲染完成')
            new Promise(function (resolve,reject){
                this.show = false;
                resolve();
            })
            .then(function(){
                this.show = true;
            })
            .then(function(){
               
                $('#pageDisplay').load('./articles/pages/'+id+'.html')
                console.log('get("cl"):'+get("cl")+'类型:'+typeof(get("cl")));
                // if (id==='weather'){
                //     document.getElementsByClassName('top-navbar').style.
                // }
                if ((get("cl")==='0')&&get("pageId")==='6'){
                    let urlCurrent = location.href;
                    let changedUrl = changeURLArg(urlCurrent,"cl",'1')
                    if (!!(window.history && history.pushState)) {
                        history.replaceState(null, "", changedUrl);
                    }
                    window.location.reload(true)
                }
                if ((get("cl")==='0')&&get("pageId")==='weather'){
                    let urlCurrent = location.href;
                    let changedUrl = changeURLArg(urlCurrent,"cl",'1')
                    if (!!(window.history && history.pushState)) {
                        history.replaceState(null, "", changedUrl);
                    }
                    
                }
            } )
            console.log('本次调整来源于打开页面自动调整')
            realtime();
        }
    }
})

//url参数解析,参考自CSDN:https://blog.csdn.net/qq_19484091/article/details/105989977
function get(keyword) {
	var reg = new RegExp("(^|&)"+keyword+"=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;   //注意此处参数是中文，解码使用的方法是unescape ，那么在传值的时候如果是中文，需要使用escape('曲浩')方法来编码。
}

//变更地址栏变量函数
function changeURLArg(url, arg, arg_val) {
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + arg_val;
    if (url.match(pattern)) {
        var tmp = '/(' + arg + '=)([^&]*)/gi';
        tmp = url.replace(eval(tmp), replaceText);
        return tmp;
    } else {
        if (url.match('[\?]')) {
            return url + '&' + replaceText;
        } else {
            return url + '?' + replaceText;
        }
    }
}


//侧边栏时间显示
function clock(){
    var time=new Date();
    var week;
    switch (time.getDay()){   
      case 1: week="星期一"; break;
      case 2: week="星期二"; break;
      case 3: week="星期三"; break;
      case 4: week="星期四"; break;
      case 5: week="星期五"; break;
      case 6: week="星期六"; break;
      default: week="星期天";
    }
    var year=time.getFullYear();
    var month=time.getMonth();
    var date=time.getDate();
    var hour=time.getHours();
    var sec=time.getSeconds()
    var minute=time.getMinutes();
    if (minute<10){
        minute = "0"+time.getMinutes().toString()
    }
    if (sec<10){
        sec = "0"+time.getSeconds().toString()
    }
    // console.log('hour:'+hour)
    if (hour>=0&&hour<=6){
        var timeRange = "凌晨好,"
    }
    else if (hour > 6 && hour <=11){
        var timeRange = "上午好,"
    }
    else if (hour > 11 && hour <= 13){
        var timeRange = "中午好," 
    }
    else if (hour > 13 && hour <= 16){
        var timeRange = "下午好," 
    }
    else if (hour > 16 && hour <= 22){
        var timeRange = "晚上好," 
    }
    else if (hour > 22 && hour < 24){
        var timeRange = "深夜好," 
    }
    document.getElementById('clockDate').innerHTML = timeRange+"现在是:"+year+"年"+(month+1)+"月"+date+"日 "+week+"<br>北京时间:"+hour+":"+minute+":"+sec;
}

//状态栏跑马灯功能，参考自CSDN:https://blog.csdn.net/zhaoxiaoyang5156/article/details/1691646
var msg="欢迎光临我的博客!";//声明一个变量。
var interval = 300;//声明一个变量，设置一个时间间隔为300毫秒。
seq = 0;//赋给seq初值为0。
function Scroll() {//定义一个函数。
    len = msg.length;
    document.getElementById('Pmd').innerHTML = msg.substring(0, seq+1);
    seq++;
/*len的值为字符串msg的长度，在状态栏上显示msg的第一到第seq+个字符，seq每次递加。*/
if ( seq >= len ) { seq = 0 };/*当seq的长度大于等于msg的字符长度时，seq=0。*/
//每300毫秒调用一次Scroll函数，即每300毫秒出一个字。
}


//功能预留
function toggleTheme() {
    // Obtains an array of all <link>
    // elements.
    // Select your element using indexing.
    var theme = document.getElementsByTagName('link')[0];

    // Change the value of href attribute 
    // to change the css sheet.
    if (theme.getAttribute('href') == './css/index.css') {
        theme.setAttribute('href', './css/indexDarkTheme.css');
    } else {
        theme.setAttribute('href', './css/index.css');
    }
}
//baidu页面分析代码
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?dea5c7d1ba45cab78e5346b76d027c15";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();