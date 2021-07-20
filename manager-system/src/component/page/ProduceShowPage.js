// 语音播报页面
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import config from '../config';



class ProduceShowPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      per: 0,
      stopSpeak: 0,
      data: [

      ],
      style:{
        table:{
          width: '99%',padding:'0 1.2rem',
          textAlign: 'left',
          background:'white'
        }
      },
      btnVisible: true,
      pstatus: false
    };
  }


  componentDidMount() {
    // 更新消息数据
    this.queryDataTimer();
    // this.handleClickFull();
    this.initBaiduAPI(); //获取百度语音tokenID
    setTimeout(()=>{
      document.getElementById('fullScr').click();//默认全屏
        this.startLoop();//开始滚动
        this.startSpeak();// 语音播报
    }, 1500);
    this.dataTimer = setInterval(this.queryDataTimer, 10000); //十秒数据刷新

  }

  componentWillUnmount() {

    if(this.loopTimer){
      clearInterval(this.loopTimer);
    }

    if(this.dataTimer){
      clearInterval(this.dataTimer);
    }

    if(this.speakTimer){
      clearInterval(this.speakTimer);
    }
    this.stopSpeakInfo();

  }

  initBaiduAPI = () => {
    // 获取百度语音的tokenID
    var { baiduTokenid } = this.state;
    if(!baiduTokenid){
      var id = config.baiduAudioAPI.id;
      var secret = config.baiduAudioAPI.secret;
      var tokenidURL = 'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id='+id+'&client_secret='+secret;
      fetch(config.server.queryAudioTokenID).then(data=>data.json()).then(res=>{
        if(res.code !== 200){
          this.tips('语音功能开启失败，请稍后重试');
          setTimeout(()=>this.initBaiduAPI(), 4000);
          return;
        }
        var tokenid = JSON.parse(res.results);
        this.setState({baiduTokenid: tokenid.access_token});
        this.tips('正在开启语音功能...');
      }).catch(e=>{
        this.tips('语音功能开启失败，正在重试');console.log(e);
        setTimeout(()=>this.initBaiduAPI(), 4000);
      })
    }

  }

  queryDataTimer = () => {

      fetch(config.server.listShowPageData).then(res=>res.json()).then(data=>{
        // console.log(data);
        if(data.code !== 200){
          this.tips(data.msg);return;
        }
        if(this.state.pstatus){
          this.setState({data: data.results.filter((index)=>{return index.pstatus === 1} ) || []});
        }else{
          this.setState({data: data.results || []});
        }

      }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});

  }

  startSpeak = () => {
    // 语音播报
    var {data} = this.state;

    var dataCopy = JSON.parse(JSON.stringify(data));
    if(!dataCopy.length){
      console.log('暂无播报信息');
      this.tips('暂无进行中的加急订单与新品订单');
      // return;
    }

    if(this.speakTimer){
      clearInterval(this.speakTimer);
    }

    dataCopy = dataCopy.filter((index)=>{
      // return index.status || index.priority || index.ifNew;
      return index.priority || index.ifNew;
    });
    // console.log(dataCopy);

    let j = 0, len = dataCopy.length;
    this.speakCount = this.speakCount?(++this.speakCount):1;
    console.log(this.speakCount+'轮语音已开始');

    var startS = () => {
      dataCopy = JSON.parse(JSON.stringify(this.state.data));
      dataCopy = dataCopy.filter((index)=>{
        return index.priority || index.ifNew;
      });
      len = dataCopy.length;

      if(j < len){
        let i = dataCopy[j];
        // if(i.status==2 || i.priority || i.ifNew){
        if(i.priority || i.ifNew){
          var str;
            // var other = "请下一流程准备";
          var other = "";
          if(i.ifNew && i.priority){
            str = ('编号为' + i.erp +'的新品加急订单的'+ i.name + '流程' + ((i.status === 2)?'已完成'+other:(i.status === 1?'已开始':'正在准备中')));
          }else if(i.ifNew){
            str = ('编号为' + i.erp +'的新品订单的'+ i.name + '流程' + ((i.status === 2)?'已完成'+other:(i.status === 1?'已开始':'正在准备中')));
          }else if(i.priority){
            str = ('编号为' + i.erp +'的加急订单的'+ i.name + '流程' + ((i.status === 2)?'已完成'+other:(i.status === 1?'已开始':'正在准备中')));
          }else{
            str = ('编号为' + i.erp +'的订单的'+ i.name + '流程' + ((i.status === 2)?'已完成'+other:(i.status === 1?'已开始':'正在准备中')));
          }
           console.log(str);
           this.speakInfo(str);
        }
        j++;
      }else{
        clearInterval(this.speakTimer);
        setTimeout(()=>{this.startSpeak()}, 5000);//一轮播放完毕，开始下一轮
      }
    }

    startS();
    this.speakTimer = setInterval(startS, 10000);

  }

  // 页面语音播报
  speakInfo = (text) => {
      var { audio, stopSpeak, baiduTokenid, per } = this.state;
      if(stopSpeak){
        return;
      }

      if(baiduTokenid){
        var url = "https://tsn.baidu.com/text2audio?lan=zh&cuid=32jbj3454n6k5475475&spd=4&ctp=1&per="+per+"&tex=" + encodeURI(text)+'&tok='+this.state.baiduTokenid;        // baidu
         // var url = "http://developer.baidu.com/vcast/getVcastInfo?type=tns&lan=zh&spd=4&sex=4&ie=UTF-8&title=0&method=TRADIONAL&content=" + encodeURI(text);        // baidu
         //url = "http://translate.google.cn/translate_tts?ie=UTF-8&tl=zh-CN&total=1&idx=0&textlen=19&prev=input&q=" + encodeURI(str); // google
         // application/json
    　　 var n = audio || new Audio();
         n.src = url;
    　　 n.play();
        window.PageAudio = n;
        this.setState({audio: n});
      }
       // var url = "http://tts.baidu.com/text2audio?lan=zh&spd=4&per=0&ie=UTF-8&text=" + encodeURI(text);        // baidu

  }

  stopSpeakInfo =() => {
    var { stopSpeak } = this.state;
    if(this.state.audio) this.state.audio.pause();
    this.setState({stopSpeak: !stopSpeak});
  }

  // 页面滚动
  startLoop = () => {
    if(!document.getElementById('produceShowTable'))return;


    this.loopTimer = setInterval(()=>{
      var dom = document.getElementById('produceShowTable').parentNode;
      // windo
      var p_height = dom.clientHeight;
      var c_height = document.getElementById('produceShowTable').clientHeight;

      // 如果表格高度小于屏幕显示，不滚动
      // console.log(p_height, c_height)
      if(p_height >= c_height){
        if(document.getElementById('produceShowTable').parentNode.childNodes.length>1){
          dom.removeChild(dom.lastChild);
        }
        return;
      }

      if(document.getElementById('produceShowTable').parentNode.childNodes.length<=1){
        var tableClone = document.getElementById('produceShowTable').cloneNode(true);
        dom.appendChild(tableClone);
      }
        // console.log(dom.scrollTop, c_height);
      if(dom.scrollTop >= c_height){
        dom.scrollTop = 0;
      }else{
        dom.scrollTop += 1;
        //console.log( dom.scrollTop);
      }
    }, 50 );
  }

  toogleLoop = () =>{
    if(this.loopTimer){
      clearInterval(this.loopTimer);
      this.loopTimer = '';
    }else{
      this.startLoop();
    }
  }


  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  // 全屏
  handleClickFull=()=>{
    var data = this.state.style;
    data.table = {position: 'fixed',
          top: 0,
          left: 0,padding:'0rem',
          width: '100vw',
          height: '100vh',
          background: 'white',zIndex:10};
    this.setState({ style: data, marginBottom: '-3.5rem'});
    this.setState({ btnVisible: !this.state.btnVisible});
    document.documentElement.requestFullscreen(); //F11
  }

  handleClickFullCancel=()=>{
    var data = this.state.style;
    data.table = {position: 'relative',
                  top: 0,
                  left: 0,padding:'0rem',
                  width: '100%',
                  height: '(100vh-138px)',
                  background: 'white',zIndex:0};
    this.setState({ style: data, marginBottom: '0rem'});
    this.setState({ btnVisible: !this.state.btnVisible});
    document.exitFullscreen(); //取消全屏
  }


  tips = (msg) => {
    if(msg){
      this.setState({tipInfo:msg});
    }
    this.setState({tipsOpen: true});

    setTimeout(()=>{
      this.setState({tipsOpen: false});
    },4000);
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    var style1 = {
      textAlign: 'left',margin: '1.5rem .5rem 1rem'
    };
    var { data, per, stopSpeak } = this.state;
    return (
      <div  style = {this.state.style.table} className = "showPage">
        <div style={style1}>
          <Button variant="outlined"
                id="fullScr"
                style={{display:this.state.btnVisible?'block':'none',marginBottom: this.state.marginBottom}}
                variant = 'contained'
                color="primary"
                onClick={this.handleClickFull}
          >
            全屏
          </Button>
          <Button variant="outlined"
              style={{display:this.state.btnVisible?'none':'block',opacity: 0.0,marginBottom: this.state.marginBottom}}
              variant = 'contained'
              color="secondary"
              onMouseEnter = {(e)=>{return;e.persist();e.target.style.opacity = 1}}
              onMouseLeave = {(e)=>{return;e.persist();e.target.style.opacity = 1.0}}
              onClick={this.handleClickFullCancel}
          >
            退出全屏
          </Button>
          <span className="btn bg-primary inline-block hide"
                style={{marginLeft:'160px',marginBottom:'-2.5rem',position:'relative',zIndex:77}}
                onClick={()=>this.setState({per: per?0:1})}>
            {per === 1?'男声':'女声'}
          </span>
          {/*<span onClick={()=>this.setState({stopSpeak: !stopSpeak})}>{stopSpeak?'播放':'暂停'}</span>*/}
          <span className="inline-block hide"
                style={{left:'14vw',top:'.7rem',position:'absolute',zIndex:77}}>
             <Switch
              checked={this.state.pstatus}
              color="primary"
              onChange={()=>this.setState({pstatus: !this.state.pstatus})}
            />
              <small className="small">订单进行中</small>
          </span>

          <Grid container>

            <Grid item xs = {3} align="left">
              <span className="blod">共{data.length}条订单数据</span>
            </Grid>
            <Grid item xs = {9}>
              <div align="right" style={{paddingRight:'2rem'}}>
                <span className="rect border bg-success"></span><span className="inline-block">已完成</span>
                <span className="rect border bg-notice"></span><span className="inline-block">新品</span>
                <span className="rect border bg-red"></span>
                <span className="inline-block">加急</span>
              </div>
            </Grid>

          </Grid>
        </div>
        <table id="produceShowTableHead"
              className="produceShowTable pointer"
              style={{width:'100%',textAlign: 'center'}}
        >
        <thead onDoubleClick={this.toogleLoop}><tr>
            <th>序号</th>
            <th>ERP号</th>
            <th>货号</th>
            <th>货物名称</th>
            <th>计划生产数量</th>
            <th>实际开工</th>
            <th>计划完工</th>
            <th>生产状态</th>
            <th>备注</th>
            </tr></thead>
          </table>
          <div style={{overflowY: 'scroll',height: 'calc(100vh - 138px)'}}>
        <table id="produceShowTable"
          className="produceShowTable"
          style={{width:'100%',textAlign: 'center'}}
        >
        <tbody>

        {data.map((single, index)=>(
          <tr key={'tr'+index} className={single.priority?'bg-red':(single.ifNew?'bg-notice':(single.status === 2?'bg-success':''))}>
            <td style={{padding: '12px 0'}}>{index+1}</td>
            <td title={single.erp} style={{padding: '12px 0'}}>{single.erp}</td>
            <td title={single.materialCode}>{single.materialCode}</td>
            <td title={single.materialName}>{single.materialName}</td>
            <td>{single.planNum}</td>
            <td>{single.actualStart}</td>
            <td>{single.planFinishDate?(new Date(single.planFinishDate).format('yyyy-MM-dd')):''}</td>
            <td>{single.name}<small className="small">{single.status === 1?'进行中':(single.status === 2?'已完成':'准备中')}</small></td>
            {/*<td>{single.status?'完成':'进行中'}</td>*/}
            <td title={single.myRemark?single.myRemark:'    '}>{single.myRemark?single.myRemark:''}</td>
          </tr>
        ))}</tbody></table></div>
        <Snackbar style={{marginTop:'70px'}}
          anchorOrigin={{horizontal:"center",vertical:"top"}}
          open={this.state.tipsOpen}
          onClose={()=>this.setState({tipsOpen: false})}
          ContentProps={{
            'className':'info'
          }}
          message={this.state.tipInfo}  />
      </div>
    );
  }
}

export default ProduceShowPage;
