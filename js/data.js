(function(){
    var datepicker = {};

    datepicker.getMonthData = function(year,month){
        var ret = [];

        if(!year && !month){   //没有传入年月的情况
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth() + 1;    //月份返回0到11，这里需要加1来表示{真实}月份
        }
            var firstDay = new Date(year,month-1,1);  //获取当前月份的第一天的时间总信息，用减1来匹配系统月份
            
            //var cur_year = firstDay.getFullYear();
            //var cur_month = firstDay.getMonth()+1;
            year = firstDay.getFullYear();
            month = firstDay.getMonth()+1;

            var firstDayisWhichWeekday = firstDay.getDay(); //获取当月第一天是星期几

            if(firstDayisWhichWeekday === 0){//对星期日进行处理
                firstDayisWhichWeekday = 7;  //因为系统星期天返回的是0
            }

            var lastOfLastMonth = new Date(year,month-1,0);  //返回上月最后一天的信息
            var lastDateOfLastMonth = lastOfLastMonth.getDate();  //上月最后一天的天数

            var preMonthDayShowInThis = firstDayisWhichWeekday -1;  //上个月在本月需要显示的天数

            var lastDay = new Date(year,month,0);
            var lastDate = lastDay.getDate();     //获取本月的最后一天

            for(var i = 0;i < 7 * 6;i++){   //这里是考虑一个月最多六周来循环的
                var date = i + 1 - preMonthDayShowInThis; //date是以相对本月第一天，也就是date=1来表示的，负数表示上月天数，超过本月最后一天为下月天数，因此需要进行判断
                var thisMonth = month;                
                var thisDate = date;
                if(date <= 0){
                    thisMonth = month -1;
                    thisDate = lastDateOfLastMonth + date;
                }else if(date > lastDate){
                    thisMonth = month + 1;
                    thisDate = thisDate -lastDate;
                }

                if(thisMonth === 0){
                    thisMonth = 12;
                }else if(thisMonth === 13){
                    thisMonth = 1;
                }
                ret.push({
                    date:date, //按顺序排列的42天
                    thisMonth:thisMonth,//月份
                    thisDate:thisDate  //当月的真实日期
                });
            }
        
        return {
            days:ret,
            year:year,
            month:month
        };
    };


    window.datepicker = datepicker;  //将对象暴露给全局
})();