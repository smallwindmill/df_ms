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

  componentWillMount() {
    // 组件初次加载数据申请
    fetch(config.server.listAllIndentByDate).then(res=>res.json()).then(data=>{
      console.log(data);
      if(data.code!=200){
        this.tips(data.msg);return;
      }
      this.setState({data: data.results || []});
      setTimeout(this.startLoop, 1000);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));


  }

  componentWillUnmount() {
    if(this.loopTimer){
      clearInterval(this.loopTimer)
    }
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

    var tableClone = document.getElementById('produceShowTable').cloneNode(true);
    dom.appendChild(tableClone);

    this.loopTimer = setInterval(()=>{
        // console.log(dom.scrollTop, c_height)
      if(dom.scrollTop >= c_height){
        // var tableClone = document.getElementById('produceShowTable').cloneNode(true);
        // dom.appendChild(tableClone);
        // dom.removeChild(dom.childNodes[0]);console.log(dom.childNodes)
        dom.scrollTop = 0;
      }else{
        dom.scrollTop += 1;
      }
    }, 30 );
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
          left: 0,padding:'0 1rem',
          width: '99vw',
          height: '100vh',
          background: 'white',zIndex:10};
    this.setState({ style: data});
    this.setState({ btnVisible: !this.state.btnVisible});
  }

  handleClickFullCancel=()=>{
    var data = this.state.style;
    data.table = {position: 'relative',
                  top: 0,
                  left: 0,padding:'0 1rem',
                  width: '99%',
                  height: '(100vh-194px)',
                  background: 'white',zIndex:0};
    this.setState({ style: data});
    this.setState({ btnVisible: !this.state.btnVisible});
  }

  tips = (msg) => {
    if(msg){
      this.setState({tipInfo:msg});
    }
    this.setState({tipsOpen: true});

    setTimeout(()=>{
      this.setState({tipsOpen: false});
    },2000);
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    var style1 = {
      textAlign: 'left',margin: '1rem .5rem 1rem'
    };
    return (
      <div  style = {this.state.style.table}>
        <div style={style1}>
          <Button variant="outlined" style={{display:this.state.btnVisible?'block':'none'}} variant = 'contained' color="primary" onClick={this.handleClickFull}>
            全屏
          </Button>
          <Button variant="outlined" style={{display:this.state.btnVisible?'none':'block',opacity: 0.0}} variant = 'contained' color="secondary" onMouseEnter = {(e)=>{e.persist();e.target.style.opacity = 1}}  onMouseLeave = {(e)=>{e.persist();e.target.style.opacity = 0.0}} onClick={this.handleClickFullCancel}>
            退出全屏
          </Button>
          <Grid container>

            <Grid item xs = {3} align="left">
              <span className="blod">共{this.state.data.length}条数据</span>
            </Grid>
            <Grid item xs = {9}>
              <div align="right" style={{paddingRight:'2rem'}}>
                <span className="rect bg-success"></span><span className="inline-block">已完成</span>
                <span className="rect bg-notice"></span><span className="inline-block">新品</span>
                <span className="rect bg-red"></span><span className="inline-block">加急</span>
              </div>
            </Grid>

          </Grid>
        </div>
        <table id="produceShowTableHead" className="produceShowTable" style={{width:'100%'}}>
        <thead><tr>
            <th>ERP号</th>
            <th>物料长代码</th>
            <th>物料名称</th>
            <th>计划生产数量</th>
            <th>实际开工日期</th>
            <th>计划完工日期</th>
            <th>生产状态</th>
            <th>备注</th>
            </tr></thead>
          </table>
          <div style={{overflowY: 'scroll',height: 'calc(100vh - 230px)'}}>
        <table id="produceShowTable" className="produceShowTable" style={{width:'100%'}}><tbody>
        {this.state.data.map((single, index)=>(
          <tr key={'tr'+index}  className={single.status==0?(single.priority==0?(single.ifNew==1?'bg-notice':''):'bg-red'):'bg-success'}>
            <td style={{padding: '12px 0'}}>{single.erp}</td>
            <td>{single.materialCode}</td>
            <td>{single.materialName}</td>
            <td>{single.planNum}</td>
            <td>{single.actualStart}</td>
            <td>{single.planFinishDate}</td>
            <td>{single.status?'完成':'进行中'}</td>
            <td title={single.remark?single.remark:'    '}>{single.one7}</td>
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
