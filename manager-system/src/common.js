// 16.消息通知,模态框
function tips(msg,delay){
  var tip_cont =  "<div class='tips'><span>";tip_cont += msg;tip_cont +='</span></div>';
  if (!$('.tips')[0]) {  $('body').append(tip_cont); }
  else
  {  $('.tips>span').html(msg); }
  var delay=(delay)?(delay):(2000);
  $('.tips').show().delay(delay).hide(0,    function(){      /*$(this).remove();*/    });
}

function tipsRoll(msg,delay){
  var tip_cont =  "<div class='tipsRoll'><span>";tip_cont += msg;tip_cont +='</span></div>';if (!$('.tipsRoll')[0]) {  $('body').append(tip_cont); }else{  $('.tipsRoll>span').html(msg); }
  var delay=(delay)?(delay):(2000);
  $('.tipsRoll span').css('left',-$('.tipsRoll span').width());
  var timeout='';
  // var y=8;
  var y=Math.ceil($('body').width()/700);
  // console.log(y);
  function tipsRoll(){
    var x=Math.ceil($('.tipsRoll span').css('left').split('px')[0]);
    if(x>$('body').width()){
      clearTimeout(timeout);
      return false;
    }else{
      x=Math.ceil($('.tipsRoll span').css('left').split('px')[0]);
      $('.tipsRoll span').css('left',(x+y+'px'));
      // console.log(x+y);
      // 定时函数的格式！
      timeout=setTimeout(function(){tipsRoll()},1);
    }
    // $('.tipsRoll').show().delay(delay).hide(0,function(){      /*$(this).remove();*/    });
  }
  // 触摸停止滚动
  /*$('.tipsRoll').on('mouseover',function(){
    // console.log('in');
    clearTimeout(timeout);
  })
   $('.tipsRoll').on('mouseout',function(){
    // console.log('out');
    tipsRoll();
  })*/
  tipsRoll();
}

function returnTop(){
  var getTopFunction='';
  var xx=$('#app').scrollTop()/20;
  // 按照百分比滚动
  // 先写定时函数，再清除，否则无效
  function getTop(){
    getTopFunction=setTimeout(getTop,5);
    if($('#app').scrollTop()>0){
      $('#app').scrollTop($('#app').scrollTop()-xx);
    }else{
      clearTimeout(getTopFunction);
    }
    // 函数不加括号，字符串加括号
  }
  getTop();
}

function myConfirm(msg,yes,no){
  /*
  * 消息通知
  * @param{string，number} msg 显示的信息  msg 显示时间
  */
  var that = this;
  var id = new Date().getTime();
  var title = (msg.title)?(msg.title):"提示";
  var confirms_fade = '<div class="confirms-layer-shade" id="fade'+id+'" times="3"></div>';
  var confirm_cont =  '<div class="confirms-layer confirms-layer-dialog layer-anim" id="confirms'+id+'" type="dialog" times="3" showtime="0" contype="string" ><div class="confirms-layer-title">'+title+'</div><div id="" class="confirms-layer-content confirms-layer-padding"><i class="confirms-layer-ico confirms-layer-ico3"></i>'+msg.info+'</div><span class="confirms-layer-setwin"><a class="confirms-layer-ico confirms-layer-close confirms-layer-close1" href="javascript:;"></a></span><div class="confirms-layer-btn confirms-layer-btn-"><a class="confirms-layer-sure">确定</a><a class="confirms-layer-cancel">取消</a></div><span class="confirms-layer-resize"></span></div>';
        // console.log(confirm_cont);
      $('body').append(confirms_fade);
      $('body').append(confirm_cont);
      var top = ($('body').height()-$('.confirms-layer-dialog').height())/2-$('body').height()/10;
      var left = ($('body').width()-$('.confirms-layer-dialog').width())/2;
      // console.log(top,left);
      $('.confirms-layer-dialog').css({'top':top+'px','left':left+'px'});
      var foundFadeTarget = '#fade'+id;
      var foundTarget = '#confirms'+id;
      $(foundTarget).find('.confirms-layer-close').eq(0).off('click').on('click',function(){
          $(foundFadeTarget).fadeOut();
          $(foundTarget).fadeOut();
      })
      $(foundTarget).find('.confirms-layer-sure').eq(0).off('click').on('click',function(){
          $(foundFadeTarget).fadeOut();
          $(foundTarget).fadeOut();
          (yes)?(yes()):(console.log(''));
      })

      $(foundTarget).find('.confirms-layer-cancel').eq(0).off('click').on('click',function(){
          console.log($(foundTarget));
          $(foundFadeTarget).fadeOut();
          $(foundTarget).fadeOut();
          (no)?(no()):(console.log(''));
      })
}


function copyUrl(copyValue){
      if(!copyValue){
        copyValue='you copy nothing~';
      }
      var oInput = document.createElement('input');
      oInput.value = copyValue;
      oInput.style.position='absolute';
      oInput.style.top='0';
      oInput.style.right='0';
      oInput.style.zIndex='-3';
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = 'oInput';
      document.body.removeChild(oInput);
      tips('复制成功');
}
