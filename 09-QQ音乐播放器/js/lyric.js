//定义全局可用的函数
(function(window){
    function Lyric(path){
        //返回初始化函数
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        musicList:[],
        //init为初始化函数 
        init:function(path){
            this.path = path;
        },
        //保存时间
        times:[],
        //保存歌词
        lyrics:[],
        index:-1,
        loadLyric:function(callBack){
            var $this = this;
            $.ajax({
                url:$this.path,
                dataType:"text",
                success:function(data){
                    //剪切歌词字符串
                    $this.parseLyric(data);
                  callBack()
                },
                error:function(e){
                    console.log(e);
                }
            });
        },
        parseLyric:function(data){

            var $this = this;
            //清空以便下一首显示
            $this.times= [];
            $this.lyrics= [];
            var array = data.split("\n");
           //遍历取出每一条歌词
           //正则表达式取出时间
           var timeReg = /\[(\d*:\d*\.\d*)\]/
           $.each(array,function(index,ele){
            //处理歌词
            var lrc= ele.split("]")[1];
            if(lrc.length == 1) return true;
            $this.lyrics.push(lrc)

            var res =timeReg.exec(ele);
            // console.log(res);
            if( res == null) return true;
            var timeStr = res[1];
            var res2 = timeStr.split(":");
            var min = parseInt(res2[0]) * 60;
            var sec = parseFloat(res2[1]);
            var time =parseFloat(Number(min + sec).toFixed(2)); 
            $this.times.push(time);


          

           
           })

        },
        currentIndex:function(currentTime){
            if(currentTime >= this.times[0]){
                this.index++;
                this.times.shift();//删除数组最前一个元素
            }
            return this.index
        }

    }

    //使两个protiotype相等，方便new函数对象后方便调用Play函数中的方法
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window)