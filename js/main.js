(function(){
    var datepicker = window.datepicker;
    var MonthData;
    var $wraper;
    datepicker.buildUI = function(year,month){
         MonthData = datepicker.getMonthData(year,month);  //返回的数据对象
        console.log(year,month);
        console.log('getMonthData',MonthData.year,MonthData.month);
        var template_html = '<div class="ui-datepicker-header">'+
            '<a href="#" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a>'+
            '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>'+
            '<span class="ui-datepicker-curr-month">'+MonthData.year+'-'+MonthData.month+'</span>'+
            '</div>'+
 
            '<div class="ui-datepicker-body">'+
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

                    for(var i = 0;i < MonthData.days.length;i++){
                        if(i%7 === 0){
                            template_html+='<tr>';
                        }
                           template_html+='<td>'+ MonthData.days[i].thisDate +'</td>'; 
                        if(i%7 === 6){  //6%7余6，除不够的直接余
                            template_html+='</tr>';
                        }
                    }

            template_html+='</tbody></table></div>';
            console.log('getMonthData',MonthData.year,MonthData.month);
            return template_html;
    };
    datepicker.render = function(direction){
        var year,month;
        if(MonthData){
            year = MonthData.year;
            month = MonthData.month;
        }
        if(direction === 'prev'){
            month--;
            if(month === 0){
                month = 12;
                year--;
            }
        } 
        if(direction === 'next'){
            month++;
        }
        console.log(month);
        var html = datepicker.buildUI(year,month);
        console.log(html);
        //<div class="ui-datepicker-wraper">
        $wraper = document.querySelector(".ui-datepicker-wraper");
        if(!$wraper){
        $wraper = document.createElement('div');
        $wraper.className = "ui-datepicker-wraper";
        
    }
        $wraper.innerHTML = html;
        document.body.appendChild($wraper);
    }

    datepicker.init = function(input){
        datepicker.render(); 
        var isOpen = false;
        var $input = document.querySelector(input);
        $input.addEventListener('click',function(){
            if(isOpen){
                $wraper.classList.remove('show-datepicker');
                isOpen = false;
            }else{
                $wraper.classList.add('show-datepicker');
                isOpen = true;
                var top = $input.offsetTop;
                var left = $input.offsetLeft;
                var height = $input.offsetHeight;
                $wraper.style.left = left + "px";  //将组件定位到input的下面
                $wraper.style.top = top + height + 2 + "px";
            }
        });

        $wraper.addEventListener('click',function(e){
            var $target = e.target;
            //console.log($target);
            if(!$target.classList.contains("ui-datepicker-btn"))
                return;
            

            if($target.classList.contains("ui-datepicker-prev-btn")){
                console.log('prev');
                datepicker.render('prev');
            }
            if($target.classList.contains("ui-datepicker-next-btn")){
                datepicker.render('next');
            }
        },false);
    }
})();