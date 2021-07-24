var gallery = new Vue({
    el : '#content',
    data:{
        show : false,
        imgList:[],
    },
    watch:{
        imgList: function(){
            console.log('<-----监控v-for----->')
            
        }
    },
    created(){
        console.log('<----相册程序动作---->')
        new Promise(function(resolve,reject){
            fetch('http://dev.lzxweb.com/data/galleryList.json')
            .then(Response => Response.json())
            .then(json => {
                this.imgList = json
                resolve()
            })
        })
        .then(function(){
            console.log('相册显示内容真')
            console.log(this.imgList)
            this.show = true;
            console.log(this.show)
            // this.exRender();
        })
    },
    methods: {
        exRender(){
            this.$nextTick(()=>{
                $(document).ready(function() {
                    console.log('<----页面脚本执行---->')
                    var tn1 = $('.mygallery').tn3({
                        skinDir:"skins",
                        imageClick:"fullscreen",
                        image:{
                        maxZoom:1.5,
                        crop:true,
                        clickEvent:"dblclick",
                        transitions:[{
                        type:"blinds"
                        },{
                        type:"grid"
                        },{
                        type:"grid",
                        duration:460,
                        easing:"easeInQuad",
                        gridX:1,
                        gridY:8,
                        // flat, diagonal, circle, random
                        sort:"random",
                        sortReverse:false,
                        diagonalStart:"bl",
                        // fade, scale
                        method:"scale",
                        partDuration:360,
                        partEasing:"easeOutSine",
                        partDirection:"left"
                        }]
                        }
                    });
                });
            })
        }
    },
})