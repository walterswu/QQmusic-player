

//定义全局可用的函数
(function(window){
    //每一个函数对应一个prototype
    function Progress($progressBar,$progressLine,$progressDot){
        //返回初始化函数
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        constructor: Progress,
        init:function($progressBar,$progressLine,$progressDot){
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;    
        },
        //用来监听进度条的改变
        isMove:false,
        //进度条可拖动和点击
        //点击进度条方法(通过callback返回进度条比例)
        progressClick:function(callBack){
            var $this = this;//此时此刻的this是progress
            //监听背景的点击
            this.$progressBar.click(function(event){
                //获取距离左边窗口默认的位置
                var normalLeft = $(this).offset().left;
                //获取点击的位置距离左边窗口的位置
                var eventLeft = event.pageX
                //设置前景的宽度
                $this.$progressLine.css("width",eventLeft-normalLeft)
                $this.$progressDot.css("left",eventLeft-normalLeft)
                //计算正在播放时进度条的比例
                var value = (eventLeft-normalLeft) / $(this).width();
                callBack(value)
            })
        },
        //拖拽进度条方法
        progressMove:function(callBack){
            var $this = this;
            //获取背景距离窗口默认的位置
            var normalLeft = this.$progressBar.offset().left;
            var eventLeft;
            var barWidth = this.$progressBar.width()
            //1.监听鼠标的按下事件
            this.$progressBar.mousedown(function(){
                $this.isMove = true;
               
                 //2.监听鼠标的移动事件(保持在整个页面都可以移动，所以用document)
                 $(document).mousemove(function(event){
                    eventLeft = event.pageX
                    var offset = eventLeft-normalLeft;
                    //在bar的宽度下才设置进度条的显示
                    if(offset >= 0 && offset <=barWidth){
                          //设置前景的宽度
                    $this.$progressLine.css("width",eventLeft-normalLeft)
                    $this.$progressDot.css("left",eventLeft-normalLeft)
                    }
                  
                    
                 })

            })
            //3.监听鼠标的抬起事件
            $(document).mouseup(function(){
                $(document).off("mousemove");
                $this.isMove=false;
                var value = (eventLeft-normalLeft) / $this.$progressBar.width();
                callBack(value) 
            })

           
            

        },
        setProgress:function(value){
            if(this.isMove) return;
            if(value < 0 || value > 100) return;
            this.$progressLine.css({
                width:value+"%"
            })
            this.$progressDot.css({
                left:value+"%"
            })
        }
       
    }
    //使两个protiotype相等，方便new函数对象后方便调用Play函数中的方法
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window)