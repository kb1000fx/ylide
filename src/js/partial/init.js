function initItemPanel(){
    $.ajax({
        method: 'GET',
        url: '/api/itemList',
        success: function (response) {
            var res = JSON.parse(response); 
            var list = [];

            for (let eTab of res) {
                let tabStr = '<a href="#tab-' + eTab.tab + '" class="mdui-ripple mdui-ripple-white">' + eTab.tab + '</a>';
                let tabContent= '<div id="tab-' + eTab.tab + '" class="mdui-panel mdui-shadow-0 mdui-panel-gapless" mdui-panel="{accordion:true}">'+
                                    '<div class="mdui-panel-item">'+
                                        '<div class="mdui-panel-item-header">'+
                                            '<label class="mdui-radio"></label>'+
                                            '<div class="mdui-panel-item-summary head-font">设备</div>'+
                                            '<div class="mdui-panel-item-summary head-font">状态</div>'+
                                            '<div class="mdui-panel-item-summary head-font">使用者</div>'+
                                            ((eTab.header)?(
                                                eTab.header.map(e => {
                                                    return '<div class="mdui-panel-item-summary panel-attach head-font">' + e + '</div>'
                                                }).join('')
                                            ):'')+
                                            ((eTab.showTimeInfo)?(
                                                '<div class="mdui-panel-item-summary panel-rented head-font">预约开始时间</div><div class="mdui-panel-item-summary panel-expired head-font">预约结束时间</div>'
                                            ):'')+
                                            '<i class="mdui-panel-item-arrow mdui-icon material-icons" style="visibility: hidden;">keyboard_arrow_down</i>'+
                                        '</div>'+
                                    '</div>';   
                let inputStr =  '<div id="input-row-' + eTab.tab + '" class="input-row mdui-row">'+    
                                ((eTab.showTimeInfo)?(
                                    '<div class="mdui-col-xs-' + Math.floor(12/(((eTab.header)?(eTab.header.length):0) + ((eTab.showTimeInfo)?1:0))) + '">'+
                                        '<div class="mdui-textfield  mdui-textfield-floating-label">'+
                                            '<label class="mdui-textfield-label">预约日期</label>'+
                                            '<input id="datepicker-'+eTab.tab+'" autocomplete="off" class="datepicker mdui-textfield-input" type="text" required/>'+
                                            '<div class="mdui-textfield-error">请选择预约日期</div>'+
                                        '</div>'+
                                    '</div>'
                                ):(''))+          
                                ((eTab.header)?(
                                    eTab.header.map(e => {
                                        return  '<div class="mdui-col-xs-' + Math.floor(12/(((eTab.header)?(eTab.header.length):0) + ((eTab.showTimeInfo)?1:0))) + '">'+
                                                    '<div class="mdui-textfield mdui-textfield-floating-label">'+
                                                        '<label class="mdui-textfield-label">' + e + '</label>'+
                                                        '<input class="' + e + '-input mdui-textfield-input" type="text" required/>'+
                                                        '<div class="mdui-textfield-error">请输入' + e + '</div>'+
                                                    '</div>'+
                                                '</div>'
                                    }).join('')
                                ):'')+
                                '</div>';
                for (let obj of eTab.list) {
                    obj.Attach = JSON.parse(obj.Attach);
                    list.push({id: obj.ItemID, header: eTab.header, showTimeInfo: eTab.showTimeInfo});
                    let status, statusClass;
                    let expiredDate = new Date(obj.Expired);

                    if(!eTab.showTimeInfo){
                        status = "可预约";
                        statusClass = "status-idle";
                        if (!obj.UserName) {
                            obj.UserName = "无";
                        }
                        if(eTab.header){
                            eTab.header.forEach(e => {
                                if(!obj.Attach[e]){
                                    obj.Attach[e] = '无';
                                }
                            });
                        }
                    }else if (expiredDate<new Date()) {
                        status = "可预约";
                        statusClass = "status-idle";
                        obj.UserName = "无"; 
                        obj.Rented = "无"; 
                        obj.Expired = "无"; 
                        if(eTab.header){
                            eTab.header.forEach(e => {
                                obj.Attach[e] = '无';
                            });
                        }
                    } else {
                        status = "已预约";
                        statusClass = "status-busy";
                    }

                    tabContent += 
                        '<div id="panel-item-' + obj.ItemID + '" class="mdui-panel-item">'+
                            '<div class="mdui-panel-item-header">'+
                                '<label class="mdui-radio">'+
                                    '<input id="selector-' + obj.ItemID + '" type="radio" name="panel-selector"/>'+
                                    '<i class="mdui-radio-icon"></i>'+
                                '</label>'+
                                '<div class="mdui-panel-item-summary">'+ 
                                    ((obj.Description)?('<div class="panel-item">'+obj.Item+'</div>'+'<div class="panel-description">'+obj.Description+'</div>'):('<div class="panel-item">'+obj.Item+'</div>')) +
                                '</div>'+
                                '<div class="mdui-panel-item-summary ' + statusClass + '">'+ status + '</div>'+
                                '<div class="mdui-panel-item-summary">' + obj.UserName + '</div>'+
                                ((eTab.header)?(
                                    eTab.header.map(e => {
                                        return '<div class="mdui-panel-item-summary panel-attach">' + obj.Attach[e] + '</div>'
                                    }).join('')
                                ):'')+
                                ((eTab.showTimeInfo)?(
                                    '<div class="mdui-panel-item-summary panel-rented">' + obj.Rented + '</div>'+
                                    '<div class="mdui-panel-item-summary panel-expired">' + obj.Expired + '</div>'
                                ):(''))+
                                '<i class="mdui-panel-item-arrow mdui-icon material-icons">keyboard_arrow_down</i>'+
                            '</div>'+
                            '<div class="mdui-panel-item-body">'+
                                '<div class="mdui-spinner mdui-center"></div>'+
                            '</div>'+
                        '</div>';   
                }                          
                tabContent = tabContent + '<div class="mdui-divider"></div>' + inputStr + '</div>';
                $('header .mdui-tab').append(tabStr);
                $('#main-card').prepend(tabContent); 
                laydate.render({
                    elem: '#datepicker-' + eTab.tab, 
                    theme: '#3F51B5',
                    calendar: true,
                    type: 'datetime',
                    range: true,
                    min: 0,
                    trigger: 'click',
                    done: ()=>{
                        setTimeout(()=>{ 
                            $('.datepicker').trigger('blur') 
                        }, 20);
                    },
                });
            }

            $('header .mdui-tab').attr('mdui-tab','')
            mdui.mutation();
            for (let item of list) {
                $('#panel-item-' + item.id).on('opened.mdui.panel', ()=>{
                    initHistory(item);
                });  
            }
        }
    });
};

function initHistory(item){
    $.ajax({
        method: 'GET',
        url: '/api/history',
        data: {
            id: item.id,
        },
        success: function (response) {
            var history = JSON.parse(response).history;
            var order = JSON.parse(response).order;
            var str = "";
            for (let obj of history) {
                let status, statusClass;
                if (new Date(obj.Expired) > new Date()) {
                    statusClass = "status-undone"
                    status = "待完成"
                } else {
                    statusClass = "status-done"
                    status = "已完成"
                }
                let appendStr = '<tr>'+
                                    '<td class="col-time">' + obj.Time + '</td>'+
                                    '<td class="' + statusClass + '">' + status + '</td>'+
                                    '<td>' + obj.UserName + '</td>'+
                                    ((item.header)?(
                                        item.header.map(e => {
                                            return '<td>' + JSON.parse(obj.Attach)[e] + '</td>'
                                        }).join('') 
                                    ):'')+
                                    ((item.showTimeInfo)?(
                                        '<td>' + obj.Rented + '</td><td>' + obj.Expired + '</td>'
                                    ):(''))+                
                                '</tr>';
                if (order=='asc') {
                    str = str + appendStr;
                } else if(order=='desc'){
                    str = appendStr + str;
                } else {
                    console.error("History Order Error!");
                    break; 
                }
            }
            str =   '<div class="mdui-table-fluid mdui-shadow-0 mdui-table-hoverable">'+
                        '<table class="mdui-table mdui-table-selectable">'+
                            '<thead><tr>'+
                                '<th>预约时间</th>'+
                                '<th>预约状态</th>'+
                                '<th>使用者</th>'+
                                ((item.header)?(
                                    item.header.map(e => {
                                        return '<th>' + e + '</th>'
                                    }).join('') 
                                ):'')+
                                ((item.showTimeInfo)?(
                                    '<th>开始时间</th><th>结束时间</th>'
                                ):(''))+                        
                            '</tr></thead>'+
                            '<tbody>'+
                                str+
                            "</tbody>"+
                        "</table>"+
                    "</div>";
            $('#panel-item-' + item.id + ' .mdui-panel-item-body').empty();
            $('#panel-item-' + item.id + ' .mdui-panel-item-body').append(str);          
            mdui.mutation();
        }
    });
};