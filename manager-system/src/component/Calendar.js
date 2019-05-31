import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {Prompt} from 'react-router-dom';

import esLocale from '@fullcalendar/core/locales/es';
import zhcnLocale from '@fullcalendar/core/locales/zh-cn';

import { Calendar } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


import Confirm from './Confirm';
import config from './config';


let counter = 0;



class WorkCalendar extends React.Component {
  state = {
    workDate: {},
    workArr: []
  }

  constructor(props){
    super(props);
    this.tips = this.props.tips;
  }

  componentWillMount() {
    // 组件初次加载数据申请

  }




  componentDidMount(){
    console.log(this);
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

  initLabelClick = () =>{
    // 点击修改工作小时
    this.clickEvent = document.addEventListener('click', (e)=>{
      var { workDate, workArr } = this.state;
      e.stopPropagation();
      e.preventDefault();
      // console.log(workDate);
      if(e.target.className!='fc-content') return;

      var date = e.target.parentNode.className.split('dateClass')[1].split(' ')[0];
      var pro_node = e.target.children[0];
      var date_value = parseInt(pro_node.innerText.split(' ')[1]);

      // console.log(e.target.offsetHeight/2 - 5 < e.layerY <  e.target.offsetHeight/2 + 5);
      if(e.layerY <  e.target.offsetHeight/2 - 5){
        date_value>=10?this.tips('已超过最长工作时间'):date_value++;
      }else if(e.layerY >  e.target.offsetHeight/2 + 5){
        // date_value<=0?this.tips('工作时间最短为0'):date_value--;
        if(date_value<=0){
        }else{
          date_value--;
        }
        // date_value--;
      }else if(e.target.offsetHeight/2 - 5 < e.layerY <  e.target.offsetHeight/2 + 5){
        this.tips('后续支持输入');
      }
      // 重新生成显示数据
      // console.log(date_value);
      if(date_value>0){
        workDate[date] = date_value;
      }else{
        // delete workDate[date];
        workDate[date] = 8;
      }
      // workDate[date] = date_value;//else{delete workDate[date]}
      // e.target.children[0].innerText = pro_node.innerText.split(' ')[0]+' '+date_value;

      // console.log(pro_node, pro_node.innerText);

      workArr = [];
      for(var i in workDate){
         workArr.push({title:'上班 '+workDate[i], date:i, className: 'dateClass'+i});
      }
      this.setState({workDate: workDate, workArr: workArr});
      // localStorage.workDate = JSON.stringify(workDate);
    })
  }

  componentWillUnmount(){
    /*var mm = window.confirm('ffffff');
    if(mm){
      window.ReactHistory.goBack();
    }*/
    document.removeEventListener(this.clickEvent,()=>{});
  }


  uploadWorkCalendar = () => {

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
      }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试');});
  }


  handleDateClick = (arg) => { // bind with an arrow function
     var { workDate, workArr } = this.state;
     // console.log(arg.dateStr);
     /*if(arg.dayEl.className.indexOf('bg-primary') ==-1 ){
        arg.dayEl.className += " bg-primary";
     }else{
        arg.dayEl.className = arg.dayEl.className.replace("bg-primary",'');
     }*/
     // console.log(workDate);

     // var index = workDate.indexOf(arg.dateStr);

     if(workDate[arg.dateStr]){
        // workDate.splice(index, 1);
        delete workDate[arg.dateStr];
     }else{
        // workDate.push(arg.dateStr);
        workDate[arg.dateStr] = 8;
     }

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
    e.persist();
    var dom = document.querySelectorAll('.work-calendar table')[0];
    // console.log(e);
    if(e.deltaY>0){
      // 向下滑
      if(document.querySelectorAll('.work-calendar .fc-button-group .fc-next-button')[0]){
        document.querySelectorAll('.work-calendar .fc-button-group .fc-next-button')[0].click();
       /* var domCopy = dom.cloneNode(true);
        dom.parentNode.appendChild(domCopy);*/
        dom.className += ' translateRight';
        // domCopy.className += ' translateRight';
        setTimeout(()=>{
          // dom.parentNode.removeChild(domCopy);
          dom.className = dom.className.replace('translateRight', '');
        }, 1000);

      }
    }else{
      // 向上滑
      if(document.querySelectorAll('.work-calendar .fc-button-group .fc-next-button')[0]){

        document.querySelectorAll('.work-calendar .fc-button-group .fc-prev-button')[0].click();
         dom.className += ' translateLeft';
        // domCopy.className += ' translateLeft';
        setTimeout(()=>{
          // dom.parentNode.removeChild(domCopy);
          dom.className = dom.className.replace('translateLeft', '');
        }, 1000);

      }
    }
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
        <div style={{textAlign: 'right',paddingRight:'.5rem'}}><span style={{display: 'inline-block',marginBottom:'-55px',position:'relative',zIndex: 3}} className="btn text-blue" onClick = {this.uploadWorkCalendar} >保存</span></div>
        <FullCalendar defaultView="dayGridMonth"  weekends={true}
          events={ workArr }
          today= {["今天"]}
          buttonText={{//设置日历头部各按钮的显示文本信息
                        today:    '今天/本周',
                        month:    '月',
                        week:     '周',
                        day:      '日'
                    }}
        locale={zhcnLocale}
        dateClick={this.handleDateClick}
        timeZone = 'UTC'
        eventLimit = {true}
        plugins={[ dayGridPlugin, interactionPlugin ]} />
        <Prompt
            when={true}
            message={location => '请确定工作日历是否保存完毕？'}
          />
    </div>)

  }
}


export default WorkCalendar;
