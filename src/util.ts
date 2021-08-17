const SHOW_FIRST_WEEK_DAY=1;// 修改日历展示的第一天时修改这个数值(0-6 周日到周六)
const WEEK_NUM=['日','一','二','三','四','五','六'];
export const createWeeksday=()=>{
  let left=WEEK_NUM.slice(SHOW_FIRST_WEEK_DAY-7);
  const right =WEEK_NUM.slice(0,SHOW_FIRST_WEEK_DAY);
  left=left.concat(right);
  return left;
};
// 现在--日期字符串
export const getCurrentDateStr=()=>{
  const now=new Date();
  const m=now.getMonth() + 1;
  const d=now.getDate();
  return `${now.getFullYear()}-${m<10?`0${m}`:m}-${d<10?`0${d}`:d}`;
};
export const fillDateWithZero=(d:number | string)=>{
    return Number(d)>9?`${d}`:`0${Number(d)}`;
};
// 根据字符串获取年月日，补0版本和单纯版本
export const getYearMonthDay=(date:string)=>{
    const dateArr=date&&date.split('-') ||[];
    const year=dateArr[0];
    const month=dateArr[1];
    const day=dateArr[2];
    return {year,month,y:Number(year),m:Number(month),day,d:Number(day)};
};
  // 每个月的datelist
export const getDateListByMonth=(year:string |number,month:string |number)=>{
    const _year=Number(year);
    const _month=Number(month);
    const date=_month<12?new Date(_year,_month,0):new Date(_year+1,0,0);
    const currentMonthLength:number=date.getDate();
    const list=Array.from({length:currentMonthLength}
      ,(_,index)=>{
        const d:string=fillDateWithZero(index+1);
        const _date=`${_year}-${fillDateWithZero(_month)}-${d}`;
        const _weekday=new Date(_date).getDay();
        return {date:_date,weekday:_weekday,week:WEEK_NUM[_weekday],year,month:fillDateWithZero(_month),day:index+1};
      });
    return list;
};
  // 日历视图的datelist
  // date:YYYY-MM-DD格式, YYYY不能缺省
  export const getDateListOfCurrentMonth=(date:string)=>{
    let result:any=[];
    if(!date||!date.split ||!date.split('-') ||!date.split('-').length) return result;
    const arr=date.split('-');
    const _year:string =arr[0];
    const _month :string =arr[1];
    if(_year&&_month){
      const currentList:any= getDateListByMonth(_year,_month);
      let preList:any=[];
      let nextList:any=[];
      const firstdayweekday=new Date(`${_year}-${_month}-01`).getDay();
      const prefixlenth=(firstdayweekday-SHOW_FIRST_WEEK_DAY)>=0?firstdayweekday-SHOW_FIRST_WEEK_DAY:7-(SHOW_FIRST_WEEK_DAY-firstdayweekday);// 以周几作为日历的第一位就减几
      if(prefixlenth>0){
        preList=Number(_month)===1?getDateListByMonth(Number(_year)-1,12):getDateListByMonth(_year,Number(_month)-1);
        preList=preList.splice(-prefixlenth);
        preList=preList.map((item:any)=>{
          item.isPrevMonth=true;
          item.disabled=true;
          return item;
        }) ||[];
      }
      const lastdayweekday=currentList[currentList.length-1].weekday;
      const subfixlength=7-lastdayweekday + SHOW_FIRST_WEEK_DAY-1;
      if(subfixlength){
          nextList=Number(_month)===12?getDateListByMonth(Number(_year)+1,1):getDateListByMonth(_year,Number(_month)+1);
          nextList=nextList.splice(0,subfixlength);
          nextList=nextList.map((item:any)=>{
            item.isNextMonth=true;
            item.disabled=true;
            return item;
          }) ||[];
      }
      result=result.concat(preList,currentList,nextList);
      return result;
    }else{
      return [];
    }
  };
  export const isDateInRange=(start,end)=>{
    const {y:startY,m:startM}=getYearMonthDay(start);
    const {y:endY,m:endM}=getYearMonthDay(end);
    if(startY>endY || (startY===endY&&startM>=endM)) return false;
    return true;

  };



  export const IMAGE_SRC_MAP={
    // 空白占位图
    'blankServiceImage':'http://image1.ljcdn.com/rent-front-image/e85157cb229559a393c605d6f4a82af9.png',
    // 当前日期
    'calendarTitleIcon':'http://image1.ljcdn.com/rent-front-image/a6e79a9f95379d51c8166da66b58475a.png',
    // 回到今天button
    'backTodayIcon':'http://image1.ljcdn.com/rent-front-image/13f6f791a54044beebdbfdbb7a0f1aee.png',
    'todayIcon':'http://image1.ljcdn.com/rent-front-image/a02b20f85fd62175ea7a35b59b382217.png',// 今-彩色
    'todayBglightIcon':'',// 选中某天(非今天)-浅色大圆圈
    // 左三角形箭头
    'leftTriIcon':'http://image1.ljcdn.com/rent-front-image/281d4e8c3b38dd18cb188fa5487d97a6.png',
    // 同上置灰
    'leftTriGrayIcon':'http://image1.ljcdn.com/rent-front-image/fe2a61f872fd10c7bfe5bcb9b245585d.png',
    // 右三角形箭头
    'rightTriIcon':'http://image1.ljcdn.com/rent-front-image/2c17f428c8b6df77b8f1e33bcf31a45c.png',
    // 同上置灰
    'rightTriGrayIcon':'http://image1.ljcdn.com/rent-front-image/3688662a497e8852d148f44108518ae3.png',
    // 列表页title icon的背景灰色
    'titleIcon':'http://image1.ljcdn.com/rent-front-image/59a4714c549c5f48443336fa46bb89d3.png',
    'titleColorfulIcon':'',// 同上彩色
    'cleanIcon':'http://image1.ljcdn.com/rent-front-image/407afe2d156a6cc0531eff5bbefc9dda.png',// 保洁icon
    // 右箭头灰色
    'rightArrowGrayIcon':'http://image1.ljcdn.com/rent-front-image/5f3de05abdbc370666d9e73401728b20.png',
    // 右箭头彩色
    'rightArrowColorfulIcon':'http://image1.ljcdn.com/rent-front-image/0fe1d45d920e4fe7002b60d6f5136970.png',
};


