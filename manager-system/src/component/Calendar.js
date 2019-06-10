import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {Prompt} from 'react-router-dom';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

import esLocale from '@fullcalendar/core/locales/es';
import zhcnLocale from '@fullcalendar/core/locales/zh-cn';

import { Calendar } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import Button from '@material-ui/core/Button';

import Confirm from './Confirm';
import config from './config';


let counter = 0;



class WorkCalendar extends React.Component {
  state = {
    workDate: {},
    workArr: [],
    modalClose: true
  }

  constructor(props){
    super(props);
    this.tips = this.props.tips;
  }

  componentWillMount() {
    // 组件初次加载数据申请

  }




  componentDidMount(){
    // console.log(this);
    var { workDate, workArr } = this.state;
    /*if(localStorage.workDate){
      workDate = JSON.parse(localStorage.workDate);
      // console.log(workDate);
      workArr = [];
      for(var i in workDate){
         workArr.push({title:'上班 '+workDate[i], date:i, className: 'dateClass'+i});
      }
      this.setState({workDate: workDate, workArr: workArr});
    }*/
    // this.initCalendar();
    fetch(config.server.queryWorkCalendar).then(res=>res.json()).then(data=>{
      if(data.code!==200){
        this.tips('获取工作日历数据失败，请稍后重试');return;
      }
      // workDate = data.result;
      // console.log(workDate);
      workArr = [];
      for(var i of data.results){
        i.date = new Date(i.date).format('yyyy-MM-dd');
        workDate[i.date] = i.hour;
         workArr.push({title:'上班 '+i.hour, date:i.date, className: 'dateClass'+i.date});
      }

      this.setState({workDate: workDate, workArr: workArr});

    }).catch(e=>this.tips('网络出错了，请稍候再试'));

    this.initLabelClick();
  }

  componentWillUnmount(){
    /*var mm = window.confirm('ffffff');
    if(mm){
      window.ReactHistory.goBack();
    }*/
    document.removeEventListener(this.clickEvent,()=>{});
  }

  initLabelClick = () =>{
    // 通过监听页面点击事件， 修改工作小时
    this.clickEvent = document.addEventListener('click', (e)=>{
      var { workDate, workArr } = this.state;
      e.stopPropagation();
      e.preventDefault();
      // console.log(workDate);
      if(e.target.className!='fc-content') return;

      var date = e.target.parentNode.className.split('dateClass')[1].split(' ')[0];

      if(date < new Date().format('yyyy-MM-dd')){
       this.tips('无法修改过去时期的工时');return;
      }

      var pro_node = e.target.children[0];
      var date_value = parseInt(pro_node.innerText.split(' ')[1]);

      console.log(e.target.offsetWidth , e.layerY);
      if(e.layerY <  e.target.offsetHeight/2 - 5){
        date_value>=18?this.tips('已超过最长工作时间'):date_value++;
      }else if(e.layerY >  e.target.offsetHeight/2 + 5){
        // date_value<=0?this.tips('工作时间最短为0'):date_value--;
        if(date_value<=0){
        }else{
          date_value--;
        }
        // date_value--;
      }else if(e.target.offsetHeight/2 - 5 < e.layerY <  e.target.offsetHeight/2 + 5){
        // this.tips('后续支持输入');
        // 弹窗修改工时
        this.setState({modalClose: false, dayWork: date_value, dayDate: date});

        if(document.querySelector('#getWorkData')){
          document.querySelector('#getWorkData').onclick=(e)=>{
            // console.log(this.state.dayWork);
            var ifNum = new RegExp(/^\d+$/).test(this.state.dayWork);
            if(!ifNum){
                this.tips('工作小时数不能为非数字');return;
            }
            if(this.state.dayWork){
              if(this.state.dayWork>18){
                this.tips('工作小时数最多不超过18');
              }else if(this.state.dayWork<0){
                this.tips('工作小时数最小为1');
              }else{
                date_value = this.state.dayWork;
                this.setState({modalClose: true});
                if(date_value>0){
                  workDate[date] = date_value;
                }else{
                  // delete workDate[date];
                  workDate[date] = 8;
                }
                // localStorage.workDate = JSON.stringify(workDate);
                this.updatwDataView();
              }
            }else{
              this.tips('请输入工作小时数');
            }
          }
        }

      }
      // 重新生成显示数据
      // console.log(date_value);
      if(date_value>0){
        workDate[date] = date_value;
      }else{
        // delete workDate[date];
        workDate[date] = 18;
      }
      // localStorage.workDate = JSON.stringify(workDate);
      this.updatwDataView();

    })
  }


  updatwDataView = () => {
    var { workDate, workArr } = this.state;

    workArr = [];
    for(var i in workDate){
       workArr.push({title:'上班 '+workDate[i], date:i, className: 'dateClass'+i});
    }
    this.setState({workDate: workDate, workArr: workArr});
    this.setState({ifEdit: true}); //页面发生变化
  }


  uploadWorkCalendar = () => {
    // 保存修改
    var { workDate } = this.state;

    fetch(config.server.updateWorkCalendar,{method:"POST",
      headers:{
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({workDate: workDate})
    }).then(res=>res.json()).then(data=>{
      if(data.code != 200){
        this.tips('保存工作日历失败');
        return;
      }
      this.tips('保存工作日历成功');
      this.setState({ifEdit: false}); //页面修改已保存
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试');});
  }


  handleDateClick = (arg) => { // bind with an arrow function
     var { workDate, workArr } = this.state;

     // console.log(arg.dateStr);
     if(arg.dateStr < new Date().format('yyyy-MM-dd')){
      this.tips('无法修改过去时期的工时');return;
     }

     if(workDate[arg.dateStr]){
        // workDate.splice(index, 1);
        delete workDate[arg.dateStr];
     }else{
        // workDate.push(arg.dateStr);
        workDate[arg.dateStr] = 8;
     }
     this.setState({ifEdit: true}); //页面发生变化

     workArr = [];
     /*workDate.map(data=>{
      workArr.push({title:'上班', date:data, rendering: 'bg-primary'})
      // workArr.push({title:'上班', start:data, end:data, rendering: 'bg-primary'})
     })*/
     for(var i in workDate){/*
        workArr.push({title:'< ', date:i, rendering: 'bg-primary'});
        workArr.push({title:'> ', date:i, rendering: 'bg-primary'});*/
        workArr.push({title:'上班 '+workDate[i], date:i, className: 'dateClass'+i});
     }

     this.setState({workDate: workDate,workArr: workArr});
     localStorage.workDate = JSON.stringify(workDate);
  }


  changePage=(e)=>{
    // 鼠标滚动翻页
    e.persist();
    var dom = document.querySelectorAll('.work-calendar table')[0];
    // console.log(e);
    if(e.deltaY>0){
      // 向下滑
      if(document.querySelectorAll('.work-calendar .fc-button-group .fc-next-button')[0]){
        // 触发下翻按钮点击事件
        document.querySelectorAll('.work-calendar .fc-button-group .fc-next-button')[0].click();return;
        var domCopy = dom.cloneNode(true);
        domCopy.className += ' abs-left';
        dom.parentNode.appendChild(domCopy);
        domCopy.className += ' translateRight';
        dom.className += ' translateRight';
        // domCopy.className += ' translateRight';
        setTimeout(()=>{
          // dom.parentNode.removeChild(domCopy);
          dom.className = dom.className.replace('translateRight', '');
          // dom.parentNode.removeChild(domCopy);
        }, 10000);

      }
    }else{
      // 向上滑
      if(document.querySelectorAll('.work-calendar .fc-button-group .fc-next-button')[0]){
        // 触发回翻按钮点击事件
        document.querySelectorAll('.work-calendar .fc-button-group .fc-prev-button')[0].click();return;
        // domCopy.className += ' translateLeft';
        var domCopy = dom.cloneNode(true);
        domCopy.className += ' abs-right';
        dom.parentNode.appendChild(domCopy);
        domCopy.className += ' translateLeft';
        dom.className += ' translateLeft';
        setTimeout(()=>{
          // dom.parentNode.removeChild(domCopy);
          dom.className = dom.className.replace('translateLeft', '');
          // dom.parentNode.removeChild(domCopy);
        }, 10000);

      }
    }
  }



   addDataModal = ()=>{

     return (<Dialog
       aria-labelledby="customized-dialog-title"
       open={this.state.modalClose?false:true} style={{marginTop:'-10rem'}} onClose={()=>this.setState({modalClose: true})}
     >
       <div id="customized-dialog-title" style={{padding: '1rem 2rem', fontWeight: 'bold'}}>
         添加工作日历
       </div>
       <form noValidate autoComplete="off" style={{padding:"2rem 6rem 3rem"}}>
          <label style={{height:'25px',padding:'2px 1rem'}} for="">{this.state.dayDate}</label>
          <input type="text" autofocus='true' style={{height:'25px',border:'1px solid rgb(102, 102, 102)',borderRadius:'3px',overflow:'hidden',padding:'2px 8px'}} placeholder="请输入工作小时数" value={this.state.dayWork} onChange={(e)=>this.setState({dayWork: e.target.value})} />
         </form>
         <div style={{textAlign: 'center',padding: '2rem'}}>
            <Button id="getWorkData" variant="outlined" style={{marginRight: 1+"rem"}} color="primary">确定</Button>
         </div>
     </Dialog>)
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


  render() {

    // this.state.date_in =[new Date(), new Date()];
    var { workArr } = this.state;

    return (
      <div className="work-calendar" onWheel={e=>this.changePage(e)}>
        <div style={{textAlign: 'right',paddingRight:'.5rem'}}><span style={{display: 'inline-block',marginBottom:'-55px',position:'relative',zIndex: 3}} className="btn bg-primary-fill text-white" onClick = {this.uploadWorkCalendar} >保存</span></div>
        <FullCalendar defaultView="dayGridMonth"  weekends={true}
          events={ workArr }
          today= {["今天"]}
          buttonText={{//设置日历头部各按钮的显示文本信息
                        today: '今天/本周',
                        month: '月',
                        week: '周',
                        day: '日'
                    }}
        locale={zhcnLocale}
        dateClick={this.handleDateClick}
        timeZone = 'UTC'
        eventLimit = {true}
        plugins={[ dayGridPlugin, interactionPlugin ]} />
        <Prompt
            when={this.state.ifEdit?true:false}
            message={location => '刚刚的操作未保存，确定离开当前页面吗？'}
          />
        { this.addDataModal() }
    </div>)

  }
}


export default WorkCalendar;
