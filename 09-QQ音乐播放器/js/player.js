//定义全局可用的函数
(function(window){
    //每一个函数对应一个prototype
    function Player($audio){
        //返回初始化函数
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,
        musicList:[],
        //init为初始化函数 
        init:function($audio){
            this.$audio = $audio;
            //初始化当前的音乐
            this.audio = $audio.get(0);
        },
        currentIndex:-1,
        playMusic: function(index,music){
            //判断是否同一首音乐，是则暂停播放，否则加入音乐链接
            if(this.currentIndex == index){
                //同一首 音乐是暂停的就调用播放
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    //音乐是播放的就调用暂停
                    this.audio.pause();
                }
                
            }else{
                this.$audio.attr("src",music.link_url);
                this.audio.play();
                this.currentIndex=index
            }
        },
        //处理上一首的点击
        preIndex:function(){
            var index = this.currentIndex -1;
            if(index<0){
                index=this.musicList.length -1
            }
            return index;
        },
        //处理下一首的点击
        nextIndex:function(){
            var index = this.currentIndex +1;
            if(index>this.musicList.length-1){
                index=0
            }
            return index;
        },
        //删除对应的数据    
        changeMusic:function(index){
            this.musicList.splice(index,1)
            //判断当前删除的是否是正在播放音乐的前面的音乐
            if(index < this.currentIndex){
                this.currentIndex = this.currentIndex-1;
            }
        },
        
    getMusicDuration:function(){
        //返回总时长
        return this.audio.duration;
    },
    getMusicCurrentTime:function(){
        //返回当前时长
        return this.audio.currentTime;
    },
    //callbake回调函数返回值
    musicTimeUpdate: function(callBack){
        var $this = this;
          //8.监听播放的进度(调用audio属性中的一个自带方法监听进度)
          this.$audio.on("timeupdate",function(){
            // console.log(player.getMusicDuration(),player.getMusicCurrentTime());
            //总时长
            var duration = $this.audio.duration;
            //当前时长
            var currrentTime = $this.audio.currentTime;
            // 赋值一个格式化时间的方法
            var timeStr =  $this.formatDate(currrentTime,duration);
            callBack(duration,currrentTime,timeStr);
        })
    },
    formatDate:function(currrentTime,duration){
        //四舍五入
       var endMin = parseInt(duration / 60);
       var endSec = parseInt(duration % 60);
       //可能取到整数，需要在前面加0
       if(endMin < 10){
           endMin = "0" + endMin
       }
       if(endSec < 10){  
        endSec = "0" + endSec
    }

    var startMin = parseInt(currrentTime / 60);
    var startSec = parseInt(currrentTime % 60);
    //可能取到整数，需要在前面加0
    if(startMin < 10){
        startMin = "0" + startMin
    }
    if(startSec < 10){  
        startSec = "0" + startSec
 }
 return startMin+":"+startSec+"/"+endMin+":"+endSec
    },
    musicSeekTo:function(value){
        if(isNaN(value)) return;
        this.audio.currentTime = this.audio.duration * value;
    },
    musicVoiceSeekTo:function(value){
        if(isNaN(value)) return;
        if(value<0 && value >1) return;
        //0~1
        this.audio.volume = value;
    }

    }
    //使两个protiotype相等，方便new函数对象后方便调用Play函数中的方法
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window)