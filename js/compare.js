;(function (){

    var date={},monthRander,$wrap,lastDay,lastDayDate;

    //获取数据
    date.getMonthDate=function(year,month){
        //定义获取的月份数据
        var dateDate=[];

        //定义未传日期时的默认日期为本月（月份需要+1）
        if(!year || !month){
            var today=new Date();
            year=today.getFullYear();
            month=today.getMonth()+1;
        }

        //获取当月第一天的星期，7表示周日
        var firstDay=new Date(year,month-1,1);
        var firstDayWeek=firstDay.getDay();
        if(firstDayWeek===0){
            firstDayWeek=7;
        }

        year=firstDay.getFullYear();
        month=firstDay.getMonth()+1;

        //小于10的月份前加0
        if(month<=9){
            month="0"+month;
        }

        //获取上月最后一天的日期
        var lastMonthDay=new Date(year,month-1,0);
        var lastMonthDate=lastMonthDay.getDate();

        //需要显示的上月的天数
        var lastMonthShow=firstDayWeek-1;

        //获取本月最后一天的日期
        lastDay=new Date(year,month,0);
        lastDayDate=lastDay.getDate();

        //获取本月数据，月份包含的星期可能为4,5,6,所以需要获取最大星期数6星期的数据。
        for(var i=0;i<7*6;i++){
            var dateDay = i - lastMonthShow + 1 ; //本月的第一天的日期，为负值即表示上月的日期
            var showDay = dateDay; //因为dateDay计算可能会有负值，showDay用来将其转化为实际显示的日期，默认为dateDay
            var thisMonth =month; //同样显示的月份需要因为dateDay为负值时变为上一月，thisMonth将其转化为实际显示的月份

            //当日期为上月和下月的日期时
            if(dateDay<=0){
                //上月
                thisMonth=month-1;
                showDay=lastMonthDate + dateDay; //本条数据的日期为上月的最后一天减去已经显示的天数，得到此日为上月的多少号
            }else if(dateDay>lastDayDate){
                //下一月
                thisMonth=month+1;
                showDay=showDay-lastDayDate; //本条数据的日期为超出本月的天数减去本月的最后一天日期，得到此日为下月的多少号
            }

            //小于10的日期前加0
            if(showDay<=9){
                showDay="0"+showDay;
            }

            //月份范围限制
            if(thisMonth===0){
                thisMonth=12;
            }
            if(thisMonth===13){
                thisMonth=1;
            }

            //将每条数据转为对象传入月份数据数组
            dateDate.push({
                month:thisMonth,
                date:dateDay,
                show:showDay
            });
        }

        //返回年月和当月日期数据数组
        return {
            year:year,
            month:month,
            days:dateDate
        };
    };


    //渲染数据
    date.randerDate=function(year,month){
        //获取数据
        monthRander=date.getMonthDate(year,month);

        //定义模板
        var html='<div class="date-header">'+
        '<a href="#" class="date-btn date-btn-prev"><</a>'+
            '<span class="date-cur-month">'+monthRander.year+'-'+monthRander.month+'</span>'+
            '<a href="#" class="date-btn date-btn-next">></a>'+
            '</div>'+
            '<div class="date-body">'+
            '<table>'+
            '<thead>'+
            '<tr>'+
            '<th>一</th>'+
            '<th>二</th>'+
            '<th>三</th>'+
            '<th>四</th>'+
            '<th>五</th>'+
            '<th>六</th>'+
            '<th>日</th>'+
            '</tr>'+
            '</thead>'+
            '<tbody>';
        //循环定义模板中的日期
        for(var i=0;i<monthRander.days.length;i++){
            var dateThisDay=monthRander.days[i];
            if(i%7===0){
                html+='<tr>';
            }
            if(monthRander.days[i].date<=0||monthRander.days[i].date>lastDayDate){
                html +='<td class="not" data-date="'+ dateThisDay.date +'">'+dateThisDay.show+'</td>';
            }else{
                html +='<td data-date="'+ dateThisDay.date +'">'+dateThisDay.show+'</td>';
            }
            if(i%7===6){
                html+='</tr>';
            }
        }
        //模板结尾
        html += '</tbody>'+
            '</table>'+
            '</div>';

        return html;
    };

    //渲染模板
    date.rander=function(monthChange){

        //获取需要渲染的年月
        var year,month;
        //初次绑定组件时monthRander不存在，year和month将为当前日期
        if(monthRander){
            year=monthRander.year;
            month=monthRander.month;
        }
        //当点击切换时判断渲染上月还是下月
        if(monthChange==="prev"){
            month--;
            if(month===0){
                month=12;
                year--;
            }
        }
        if(monthChange==="next"){
            month++;
        }

        //渲染月份的数据
        var randerHtml=date.randerDate(year,month);


        $wrap=document.querySelector('.date-wrap');
        //只有当主容器不存在时才需要重新渲染主容器，即只有首次绑定组件时渲染主容器，之后渲染只需刷新数据
        if(!$wrap){
            $wrap=document.createElement("div");
            $wrap.className='date-wrap';
            document.body.appendChild($wrap);
        }
        $wrap.innerHTML=randerHtml;
    };


    //使用组件
    date.init=function(input){

        //渲染内容
        date.rander();

        var $input=document.querySelector(input);
        var isOpen=false;

        //绑定输入框，当点击输入框时展开日历
        $input.addEventListener("click",function(){
            if(isOpen){
                $wrap.classList.remove("active");
                isOpen=false;
            }else{
                //展开日历时根据输入框位置对日历定位
                $wrap.classList.add("active");
                var left=$input.offsetLeft;
                var top=$input.offsetTop+$input.offsetHeight;
                $wrap.style.top=top+2+"px";
                $wrap.style.left=left+"px";
                isOpen=true;
            }
        });

        //绑定切换月份的按钮事件，将事件绑定在容器元素上，利用冒泡原理接收时间，通过target属性判断实际点击的元素
        $wrap.addEventListener("click",function(e){
            var $target= e.target;
            //选择日期
            if($target.tagName.toLowerCase()==="td"){
                var inputDate=new Date(monthRander.year,monthRander.month-1,$target.dataset.date);
                $input.value = date.translateDate(inputDate);
                $wrap.classList.remove("active");
                isOpen=false;
            }
            //月份切换
            if(!$target.classList.contains("date-btn")){
                return; //这个返回使得日期选择绑定要在月份切换绑定之前，否则无法绑定日期切换
            }
            if($target.classList.contains("date-btn-prev")){
                date.rander("prev");
            }else if($target.classList.contains("date-btn-next")){
                date.rander("next");
            }


        });
    };

    //点击后显示日期在input中
    date.translateDate=function(date){
        var htmlDate="";
        var change=function(num){
            if(num<=9){
                return "0"+num;
            }
            return num;
        };
        htmlDate += date.getFullYear() + "-";
        htmlDate += change(date.getMonth()+1)+ "-";
        htmlDate += change(date.getDate());
        return htmlDate;
    };

    window.date=date;
})();

date.init(".datepicker");