$(function(){
    //0.初始化自定义滚动条(定义被谁使用)
    $(".content_list").mCustomScrollbar();

    var $audio = $("audio")
    //创建播放器的对象并传入播放标签
    var player = new Player($audio)
    var lyricl;
    var $progressBar  = $(".music_progress_bar");
    var $progressLine  = $(".music_progress_line");
    var $progressDot  = $(".music_progress_dot");
    var  progress = Progress($progressBar,$progressLine,$progressDot);
    progress.progressClick(function(value){
        player.musicSeekTo(value)
    });
    progress.progressMove(function(value){
        player.musicSeekTo(value)
    });




    var $voiceBar  = $(".music_voice_bar");
    var $voiceLine  = $(".music_pvoice_line");
    var $voiceDot  = $(".music_voice_dot");
    var  voiceProgress = Progress($voiceBar,$voiceLine,$voiceDot);
    voiceProgress.progressClick(function(value){
       player.musicVoiceSeekTo(value)
    });
    voiceProgress.progressMove(function(value){
        player.musicVoiceSeekTo(value)
    });
//1.加载歌曲列表
getPlayerList()
function getPlayerList(){
    $.ajax({
        url:"./source/musiclist.json",
        dataType:"json",
        success:function(data){
            player.musicList = data;
            var $musicList = $(".content_list ul");
            //3.1遍历获取到的数据，，创建每一条音乐，并插入到歌曲列表之中ul
            $.each(data,function(index,ele){
                var $item = createMusicItem(index,ele);   
                $musicList.append($item);
            });
            initMusciInfo(data[0])
            initMusciLyric(data[0])
        },
        error:function(e){
            console.log(e);
        }
    });
}

//2.初始化歌曲信息 
function initMusciInfo(music){
    //获取对应的元素
    var $musicImage = $(".song_info_pic img");
    var $musicName = $(".song_info_name a");
    var $musicSinger = $(".song_info_singer a")
    var $musicAlbum = $(".song_info_album a")
    var $musicProgressName = $(".music_progress_name")
    var $musicProgressTime = $(".music_progress_time")
    var $musicBg = $(".mask_bg")
    
    //给获取到的元素赋值
    $musicImage.attr("src",music.cover);
    $musicName.text(music.name);
    $musicSinger.text(music.singer);
    $musicAlbum.text(music.album);
    $musicProgressName.text(music.name+" / "+music.singer);
    $musicProgressTime.text("00:00 /"+music.time);
    $musicBg.css("background","url('"+music.cover+"')"); 
}

//3.初始化歌词信息
function  initMusciLyric(music){
    lyric = new Lyric(music.link_lrc);
    var $lryicContainer = $(".song_lyric")
    //清空上一首音乐的歌词
    $lryicContainer.html("");
    lyric. loadLyric(function(){
         //创建歌词列表
            $.each(lyric.lyrics,function(index,ele){
                var $item = $("<li>"+ele+"</li>");
                $lryicContainer.append($item);
            })
    });
    
}


//2.调用事件监听
initEvents()
   function initEvents(){
        //1.监听歌曲列表的移入移出事件(因为歌曲列表是通过ajax动态创建，所以需要事件委托)
    $(".content_list").delegate(".list_music","mouseenter",function(){
        //移入
      //1.1显示菜单
      $(this).find(".list_menu").stop().fadeIn(100)
      //1.2显示删除按钮
      $(this).find(".list_time a").stop().fadeIn(100)
      //1.3隐藏音乐时长
      $(this).find(".list_time span").stop().fadeOut(50) 
  })
    $(".content_list").delegate(".list_music","mouseleave",function(){
       //移出
      //1.4隐藏菜单
      $(this).find(".list_menu").stop().fadeOut(100)
      //1.5隐藏删除按钮
      $(this).find(".list_time a").stop().fadeOut(100)
      //1.6显示音乐时长
      $(this).find(".list_time span").stop().fadeIn(50)
  })

  //2.勾选框的点击
  $(".content_list").delegate(".list_check","click",function(){
       //添加和删除list_checked
       $(this).toggleClass("list_checked")
 })

  //3.添加子菜单播放按钮的监听
  var $musicPlay = $(".music_play")
  $(".content_list").delegate(".list_menu_play","click",function(){
      var $item = $(this).parents(".list_music")
    //   console.log($item.get(0).index);
    //   console.log($item.get(0).music);
      //3.1点击后会切换加入或移除类(播放键和暂停键)
      $(this).toggleClass("list_menu_play2")
      //3.2移除其他音乐的播放按钮
      $item.siblings().find(".list_menu_play").removeClass("list_menu_play2")
      //3.3移除其他歌曲的高亮
      $item.siblings().find("div").css("color","rgba(255, 255, 255, 0.5)")
      
      
      //3.5同步底部播放按钮
      //判断当前包含的class属性中是否有暂停的属性
      if($(this).attr("class").indexOf("list_menu_play2") != -1){
          $musicPlay.addClass("music_play2")
          //有就让当前歌曲高亮(选择父元素中的整条歌曲中找到每个含有div的元素加入高亮)
          $item.find("div").css("color","#fff")
      }
      else{
          $musicPlay.removeClass("music_play2")
          //让当前歌曲不高亮
          $item.find("div").css("color","rgba(255, 255, 255, 0.5)")
      }
      //3.6切换歌曲的序号和音符
      $item.find(".list_number").toggleClass("list_number2")
      $item.siblings().find(".list_number").removeClass("list_number2")
      //3.7播放音乐
      player.playMusic($item.get(0).index,$item.get(0).music)


      //3.8切换歌曲专辑信息等
      initMusciInfo($item.get(0).music);

      //3.9切换歌词信息
      initMusciLyric($item.get(0).music);
      
      
  });

        //4.监听底部控制区播放按钮的点击
        $musicPlay.click(function(){
            //判断有没有播放过音乐
            if(player.currentIndex == -1){
                //没有播放过音乐则触发音乐列表中第一个的播放按钮
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            }else{
                //已经播放过音乐
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }

        })
        //5.监听底部控制区上一首按钮的点击
        $(".music_pre").click(function(){
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
        })
        //6.监听底部控制区下一首按钮的点击
        $(".music_next").click(function(){
            $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
        })
        //7.监听删除按钮的点击
        $(".content_list").delegate(".list_menu_del","click",function(){
          //找到被点击的音乐
            var $item = $(this).parents(".list_music");
            
        //判断当前删除的是否是正在播放
        if($item.get(0).index == player.currentIndex){
            $(".music_next").trigger("click")
        }
        $item.remove();  
        player.changeMusic($item.get(0).index);

        //对歌曲列表重新排序
        $(".list_music").each(function(index,ele){
            ele.index = index;
            $(ele).find(".list_number").text(index+1)
        })
        })

        //8.监听播放的进度(调用audio属性中的一个自带方法监听进度)
        player.musicTimeUpdate(function(duration,currrentTime,timeStr){
            $(".music_progress_time").text(timeStr);
            //同步进度条
            //计算播放比例
            var value = currrentTime / duration * 100;
            progress.setProgress(value)

            //实现歌词的同步
            var index = lyric.currentIndex(currrentTime)
            var $item = $(".song_lyric li").eq(index);
            $item.addClass("cur");
            $item.siblings().removeClass("cur");

            if(index <= 2) return;
            $(".song_lyric").css({
                marginTop:((-index + 2)* 30)
            })
        })
        
        //9.监听声音按钮的点击
        $(".music_voice_icon").click(function(){
            //图标切换
            $(this).toggleClass("music_voice_icon2")
            //声音切换(判断有无这个类)
            if($(this).attr("class").indexOf("music_voice_icon2") != -1){
                //变为静音
                player.musicVoiceSeekTo(0)
            }
            else{
                //变为有声
                player.musicVoiceSeekTo(1)
            }
        })
   
   }
    
 

    //定义一个方法创建一条音乐
    function createMusicItem(index,music){
        var $item = $("<li class=\"list_music\">\n"+
        "<div class=\"list_check\"><i></i></div>\n"+
        "<div class=\"list_number\">"+(index+1)+ "</div>\n"+
        "<div class=\"list_name\">"+music.name+"\n"+
            "<div class=\"list_menu\">\n"+
                "<a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n"+
                "<a href=\"javascript:;\" title=\"添加\"></a>\n"+
                "<a href=\"javascript:;\" title=\"下载\"></a>\n"+
                "<a href=\"javascript:;\" title=\"分享\"></a>\n"+
           "</div>\n"+
        "</div>\n"+
        "<div class=\"list_singer\">"+music.singer+"</div>\n"+
        "<div class=\"list_time\"><span>"+music.time+"</span>\n"+
        "<a href=\"javascript:;\" title=\"删除\" class='list_menu_del'></a>\n"+
        "</div>\n"+
    "</li>\n");
    //拿到原生li的序号
    $item.get(0).index = index;
    $item.get(0).music = music;
    return $item;
    }
})