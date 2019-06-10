import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import config from './config';



class ProduceShowPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      data: [

      ],
      style:{
        table:{
          width: '99%',padding:'0 1.2rem',
          textAlign: 'left',
          background:'white'
        }
      },
      btnVisible: true
    };
  }


  componentDidMount() {
    // 更新消息数据
    this.queryDataTimer();
    this.handleClickFull();
    setTimeout(()=>{
      this.startLoop();//开始滚动
      this.startSpeak();// 语音播报
    }, 1000);
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

  queryDataTimer = () => {

      fetch(config.server.listShowPageData).then(res=>res.json()).then(data=>{
        // console.log(data);
        if(data.code!=200){
          this.tips(data.msg);return;
        }
        this.setState({data: data.results || []});
      }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});

  }

  startSpeak = () => {
    // 语音播报
    var {data} = this.state;

    var dataCopy = JSON.parse(JSON.stringify(data));
    dataCopy = dataCopy.filter((index)=>{
      return index.status || index.priority || index.ifNew;
    });
    // console.log(dataCopy);

    let j = 0, len = dataCopy.length;
    this.speakCount = this.speakCount?(++this.speakCount):1;
    console.log(this.speakCount+'轮语音已开始');

    var startS = () => {
      if(j < len){
        let i = dataCopy[j];
        if(i.status==2 || i.priority || i.ifNew){
          var str;
          if(i.ifNew && i.priority){
            str = ('编号为' + i.erp +'的新品加急订单的'+ i.name + '流程' + ((i.status==2)?'已完成，请下一环节准备':('已开始')));
          }else if(i.ifNew){
            str = ('编号为' + i.erp +'的新品订单的'+ i.name + '流程' + ((i.status==2)?'已完成，请下一环节准备':('已开始')));
          }else if(i.priority){
            str = ('编号为' + i.erp +'的加急订单的'+ i.name + '流程' + ((i.status==2)?'已完成，请下一环节准备':('已开始')));
          }else{
            str = ('编号为' + i.erp +'的订单的'+ i.name + '流程' + ((i.status==2)?'已完成，请下一环节准备':('已开始')));
          }
           console.log(str);
           this.speakInfo(str);
        }
        j++;
      }else{
        clearInterval(this.speakTimer);
        this.startSpeak();//一轮播放完毕，开始下一轮
      }
    }

    startS();

    this.speakTimer = setInterval(startS, 10000);

  }

  startLoop = () => {
    // 页面滚动
    if(!document.getElementById('produceShowTable'))return;

    var dom = document.getElementById('produceShowTable').parentNode;
    // windo
    var p_height = dom.clientHeight;
    var c_height = document.getElementById('produceShowTable').clientHeight;

    // 如果表格高度小于屏幕显示，不滚动
    // console.log(p_height, c_height)
    if(p_height >= c_height)return;

    if(document.getElementById('produceShowTable').parentNode.childNodes.length<=1){
      var tableClone = document.getElementById('produceShowTable').cloneNode(true);
      dom.appendChild(tableClone);
    }

    this.loopTimer = setInterval(()=>{
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
    this.setState({ style: data});
    this.setState({ btnVisible: !this.state.btnVisible});
  }

  handleClickFullCancel=()=>{
    var data = this.state.style;
    data.table = {position: 'relative',
                  top: 0,
                  left: 0,padding:'0rem',
                  width: '100%',
                  height: '(100vh-194px)',
                  background: 'white',zIndex:0};
    this.setState({ style: data});
    this.setState({ btnVisible: !this.state.btnVisible});
  }

  // 页面语音播报
  speakInfo = (text) => {
      var { audio, stopSpeak } = this.state;

      if(stopSpeak){
        return;
      }
       var url = "http://tts.baidu.com/text2audio?lan=zh&spd=4&ie=UTF-8&text=" + encodeURI(text);        // baidu
       //url = "http://translate.google.cn/translate_tts?ie=UTF-8&tl=zh-CN&total=1&idx=0&textlen=19&prev=input&q=" + encodeURI(str); // google

      　　  //request.url = encodeURI(url);
       // request.contentType = "audio/mp3"; // for baidu
       //request.contentType = "audio/mpeg"; // for google
  　　 var n = audio || new Audio(url);
  　　 n.src = url;
  　　 n.play();
      this.setState({audio: n});
  }

  stopSpeakInfo =() => {
    var { stopSpeak } = this.state;
    this.state.audio.pause();
    this.setState({stopSpeak: !stopSpeak});
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
      textAlign: 'left',margin: '1rem .5rem 1rem'
    };
    var { data } = this.state;
    return (
      <div  style = {this.state.style.table} className = "showPage">
        <div style={style1}>
          <Button variant="outlined" style={{display:this.state.btnVisible?'block':'none'}} variant = 'contained' color="primary" onClick={this.handleClickFull}>
            全屏
          </Button>
          <Button variant="outlined" style={{display:this.state.btnVisible?'none':'block',opacity: 0.0}} variant = 'contained' color="secondary" onMouseEnter = {(e)=>{return;e.persist();e.target.style.opacity = 1}}  onMouseLeave = {(e)=>{return;e.persist();e.target.style.opacity = 1.0}} onClick={this.handleClickFullCancel}>
            退出全屏
          </Button>
          <Grid container>

            <Grid item xs = {3} align="left">
              <span className="blod">共{data.length}条订单数据</span>
            </Grid>
            <Grid item xs = {9}>
              <div align="right" style={{paddingRight:'2rem'}}>
                <span className="rect border bg-success"></span><span className="inline-block">已完成</span>
                <span className="rect border bg-notice"></span><span className="inline-block">新品</span>
                <span className="rect border bg-red"></span><span className="inline-block">加急</span>
              </div>
            </Grid>

          </Grid>
        </div>
        <table id="produceShowTableHead" className="produceShowTable pointer" style={{width:'100%',textAlign: 'center'}}>
        <thead onDoubleClick={this.toogleLoop}><tr>
            <th>序号</th>
            <th>ERP号</th>
            <th>物料长代码</th>
            <th>物料名称</th>
            <th>计划生产数量</th>
            <th>实际开工</th>
            <th>计划完工</th>
            <th>生产状态</th>
            <th>备注</th>
            </tr></thead>
          </table>
          <div style={{overflowY: 'scroll',height: 'calc(100vh - 230px)'}}>
        <table id="produceShowTable" className="produceShowTable" style={{width:'100%',textAlign: 'center'}}><tbody>

        {data.map((single, index)=>(
          <tr key={'tr'+index}  className={single.status==2?'bg-success':(single.priority?'bg-red':(single.ifNew==1?'bg-notice':''))}>
            <td style={{padding: '12px 0'}}>{index+1}</td>
            <td style={{padding: '12px 0'}}>{single.erp}</td>
            <td>{single.materialCode}</td>
            <td>{single.materialName}</td>
            <td>{single.planNum}</td>
            <td>{single.actualStart}</td>
            <td>{single.planFinishDate}</td>
            {/*<td>{single.status?'完成':'进行中'}</td>*/}
            <td>{single.name}</td>
            <td title={single.remark?single.remark:'    '}>{single.remark}</td>
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
