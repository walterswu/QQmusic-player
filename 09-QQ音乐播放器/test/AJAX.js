$(function(){
    $('.btn').on('click',function(){
        var _data1;
        var _data2;
        $.ajax({
            url:"../source/api-a.jsonp",
            dataType:"jsonp",
            async:true,
            success:function(data){     
                _data1=data;    
                console.log(JSON.stringify(_data1));            
            },
            error:function(err){
                console.log(err);
            }
        }),
        $.ajax({
                    url:"../source/api-b.jsonp",
                    dataType:"json",
                    success:function(data){  
                       _data2=data;
                console.log(_data2);            
                       
                    },
                    error:function(err){
                        console.log(err);
                    }
        })
        setTimeout(function(){
            for(let i=0;i<_data1.length;i++){
            $(".imgs").append("<img src="+_data1[i].img+">")
            $(".imgs").append("<img src="+_data2[i].img+">")
            }
           
        },500);
       
        $('.btn').off("click")
    });
    
})
