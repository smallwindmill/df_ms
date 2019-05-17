import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import config from './config';



class ProduceShowPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      data: [
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)},
        {one:'000',one1:111,one2:222,one3:333,one4:444,one5:555,one6:666,one7:777,status: Math.round(Math.random()*10)}
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
    fetch(config.server.listAllIndent).then(res=>res.json()).then(data=>{
      console.log(data);
      if(data.code!=200){
        this.tips(data.msg);return;
      }
      // this.changeTemplateData(data.results || []);
      this.setState({data: data.results || []});
    }).catch(e=>{
      // this.tips('网络出错了，请稍候再试');
      console.log(e);
    });
    setTimeout(this.startLoop, 2000)

  }

  componentWillUnmount() {
    if(this.loopTimer)clearInterval(this.loopTimer)
  }




  startLoop = () => {
    console.log(document.getElementById('produceShowTable'));
    var dom = document.getElementById('produceShowTable').parentNode;
    // windo
    var p_height = dom.clientHeight;
    var c_height = document.getElementById('produceShowTable').clientHeight;

    var tableClone = document.getElementById('produceShowTable').cloneNode(true);
    dom.appendChild(tableClone);

    this.loopTimer = setInterval(()=>{
      // if(dom.scrollTop >= c_height-p_height){
      if(dom.scrollTop >= c_height){
        // var tableClone = document.getElementById('produceShowTable').cloneNode(true);
        // dom.appendChild(tableClone);
        // dom.removeChild(dom.childNodes[0]);console.log(dom.childNodes)
        dom.scrollTop = 0;
      }else{
        dom.scrollTop += 1;
      }
    }, 20 );
  }


  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

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
          <Button variant="outlined" style={{display:this.state.btnVisible?'none':'block'}} variant = 'contained' color="secondary"  onClick={this.handleClickFullCancel}>
            退出全屏
          </Button>
          <div align="right" style={{paddingRight:'2rem'}}>
            <span className="rect bg-success"></span><span className="inline-block">已完成</span>
            <span className="rect bg-primary"></span><span className="inline-block">新品</span>
          </div>
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
          <tr key={'tr'+index} className={single.status>5?(single.status>7?'bg-success':'bg-primary'):''}>
            <td>{single.one}</td>
            <td>{single.one1}</td>
            <td>{single.one2}</td>
            <td>{single.one3}</td>
            <td>{single.one4}</td>
            <td>{single.one5}</td>
            <td>{single.one6}</td>
            <td title={single.one7}>{single.one7}</td>
          </tr>
        ))}</tbody></table></div>
      </div>
    );
  }
}

export default ProduceShowPage;
