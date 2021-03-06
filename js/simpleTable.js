/**
 * simpleTable
 *
 * @version
 * 0.4.5 (2015-04-04)
 * 
 * @copyright
 * Copyright (C) 2015 Yuhang.Liu.
 *
 * @license
 * MIT licenses.
 *
 */
var simpleTable = {
    quickDraw: function(id) {
        var table = {};
        table.thead = '';
        table.columns = [];
        table.tfoot = '';
        table.tbody = '';
        table.cursor = 1;
        table.count = 0;
        table.total = 0;
        table.size = 20;
        table.curEnd = 0;
        table.curBegin = 0;
        table.id = id;
        table.obj = document.getElementById(id);
        table.drawThead = function(head) {
            var r = document.createElement('tr');
            for (var i in head){
                var h = document.createElement('th');
                h.appendChild(document.createTextNode(head[i]));
                r.appendChild(h);
            }
            var t = document.createElement('thead');
            t.appendChild(r);
            return t;
        };
        table.drawTbody = function(json) {
            
            function _td(key,value){
                var d =document.createElement('td');
                d.id=key;
                d.appendChild(document.createTextNode(value))
                return d;
            }
            var t = table.obj.getElementsByTagName('tbody')[0]||'';
            if(t!= '' && t.childNodes.length > 0){
                return t;
            } else if (t!= '' && t.childNodes.length == 0 && json != ''){
                for(var v in json['data']){
                    var r = document.createElement('tr');
                    if(table.columns.length > 0){
                        for(key in table.columns){
                            var _key = table.columns[key];
                            r.appendChild(_td(_key,json['data'][v][_key]))
                        }
                    } else {
                        for (var key in json['data'][v])
                            r.appendChild(_td(key,json['data'][v][key]))
                    }
                    t.appendChild(r)
                }
            }else{
                t = document.createElement('tbody');
            }
            return t;
        };
        table.drawTfoot = function(foo) {
            var r = document.createElement('tr');
            for (var i in head){
                var h = document.createElement('th');
                h.appendChild(document.createTextNode(head[i]));
                r.appendChild(h);
            }
            var t = document.createElement('tfoot');
            return t.appendChild(r);
        };
        table.refresh = function(obj){
            table = obj;
            var tbody = table.obj.getElementsByTagName('tbody')[0]||'';
            if(tbody!=''){
                tbody.parentNode.replaceChild(table.tbody,tbody);
            }else{
                if(table.thead)
                    table.obj.appendChild(table.thead);
                table.obj.appendChild(table.tbody);
                if(table.tfoot)
                    table.obj.appendChild(table.tfoot);
            }
        };
        table.tbody = table.drawTbody(table.tbody);
        if(table.thead){
            table.thead = table.drawThead(table.columns);
        }else{
            if(table.columns.length==0){
                var t = table.obj.getElementsByTagName('thead')[0]||'';
                if(t!=''){
                    t = t.getElementsByTagName('th');
                    for(var i=0;i < t.length;i++){
                        if(t[i].id)
                            table.columns[i]=t[i].id;
                        else
                            break;
                    }
                    if (t.length != table.columns.length){table.columns=[]}
                }
            }
        }
        if(table.tfoot) 
            table.tfoot = table.drawTfoot(table.tfoot);

        /* -- Begin Draw -- */
        table.refresh(table)
        /* add .simpleTable_wrapper */
        var wapper = document.createElement('div');
        wapper.className = 'simpleTable_wrapper';
        wapper.appendChild(table.obj.cloneNode(true));
        table.obj.parentNode.replaceChild(wapper, table.obj);
        table.obj = wapper;
        /* add .simpleTable_loading */
        table.load = document.createElement('div');
        table.load.className = 'simpleTable_loading';
        table.load.appendChild(document.createTextNode('Loading...'));
        table.obj.appendChild(table.load);
        /* add .simpleTable_paginate */
        table.paginate = document.createElement('ul');
        table.paginate.className = 'simpleTable_paginate';
        table.obj.parentNode.insertBefore(table.paginate, table.obj.nextSibling);
        /* add .simpleTable_info */
        table.info = document.createElement('div');
        table.info.className = 'simpleTable_info';
        table.paginate.parentNode.insertBefore(table.info, table.paginate.nextSibling);
        /* draw simpleTable_info */
        simpleTable.drawInfo(table);
        /* draw simpleTable_paginate */
        simpleTable.drawPageBar(table);
        /* -- End Draw -- */
        return table;
    },
    reDraw: function(obj, url, sendData) {
        if (typeof obj == 'object') {
            var table = obj;
        } else {
            alert('reDraw() need one simpleTable');
            return false;
        }
        var _url = url || '';
        var _data = sendData || '';
        if(_url != ''){
            if (table.tbody.getElementsByTagName('tr').length > 0)
                table.load.style.display='none';
            else
                table.load.style.display='block';
            ajax('get', _url, _data,
            function(data) {
                table.tbody = table.drawTbody(JSON.parse(data));
                table.load.style.display='none';
                table.refresh(table);
                simpleTable.drawInfo(tab);
                simpleTable.drawPageBar(tab);
            },
            function(error) {
                table.load.style.display='none';
                alert(error);
            });
        }
    },
    drawPageBar: function(obj) {
        /* model: previous,1,2,3,4,5,...,7,8,next */
        if (typeof obj == 'object') {
            var table = obj;
        } else {
            alert('drawPageBar() need one simpleTable');
        }
        var li = table.paginate.getElementsByTagName('li');
        var num = li.length;
        // delete old dom
        for (var i = 0; i < num; i++) {
            table.paginate.removeChild(li[0]);
        }
        // set tr show
        var tb = table.obj.getElementsByTagName('tbody')[0];
        var tr = tb.getElementsByTagName('tr');
        for (var i = 1; i <= tr.length; i++) {
            if (i >= table.curBegin && i <= table.curEnd) {
                tr[i - 1].style.display = '';
            } else tr[i - 1].style.display = 'none';
        }
        var a = document.createElement('a');
        a.setAttribute('href', '#');
        // pervious button
        var pervious = document.createElement('li');
        pervious.id = 'pervious';
        pervious.appendChild(a.cloneNode(true));
        pervious.getElementsByTagName('a')[0].appendChild(document.createTextNode('<'));
        // next button
        var next = document.createElement('li');
        next.id = 'next';
        next.appendChild(a.cloneNode(true));
        next.getElementsByTagName('a')[0].appendChild(document.createTextNode('>'));
        // first
        var first = document.createElement('li');
        first.id = 'first';
        first.appendChild(a.cloneNode(true));
        first.getElementsByTagName('a')[0].appendChild(document.createTextNode('<<'));
        // last
        var last = document.createElement('li');
        last.id = 'last';
        last.appendChild(a.cloneNode(true));
        last.getElementsByTagName('a')[0].appendChild(document.createTextNode('>>'));
        
        var suffix = 2; // length for pagebar suffix.
        var length = 7; // the maximum length for pagebar.
        var prefix = 2; // length for pagebar prefix. min values is 2
        function drawBasePageBar(table, begin, prefix, suffix, length) {
            function _draw(table, begin, end) {
                for (var i = begin; i <= end; i++) {
                    var li = document.createElement('li');
                    li.appendChild(a.cloneNode(true));
                    var tmp = li.getElementsByTagName('a')[0];
                    tmp.appendChild(document.createTextNode(i));
                    if (table.cursor == i) tmp.className = 'active';
                    table.paginate.appendChild(li)
                }
                return table.paginate;
            }
            if ((table.total - begin) >= length) {
                table.paginate = _draw(table, begin, begin + prefix + 1);
                var span = document.createElement('span');
                span.appendChild(document.createTextNode('...'));
                var sign = document.createElement('li');
                sign.className = 'off';
                sign.appendChild(span);
                table.paginate.appendChild(sign);
                table.paginate = _draw(table, table.total - suffix + 1, table.total);
            } else if (begin == table.cursor && table.cursor == table.total && table.cursor == 1) {
                table.paginate = _draw(table, begin, 1);
            } else {
                table.paginate = _draw(table, begin, table.total);
            }
            return table.paginate;
        }
        var begin = 0;
        if (table.cursor <= 1 + suffix && table.total <= length) begin = 1;
        else if (table.cursor <= table.total && table.cursor > table.total - length + 1) begin = table.total - length < 0 ? 1 : table.total - length + 1;
        else begin = table.cursor - suffix < 1 ? 1 : table.cursor - suffix;
        if (table.total <= 1 && table.cursor <= 1) {
            pervious.className = 'off';
            next.className = 'off';
            first.className = 'off';
            last.className = 'off';
        } else if (table.cursor == 1) {
            pervious.className = 'off';
            first.className = 'off';
        } else if (table.cursor == table.total) {;
            next.className = 'off';
            last.className = 'off';
        } else {}
        table.paginate.appendChild(first);
        table.paginate.appendChild(pervious);
        table.paginate = drawBasePageBar(table, begin, prefix, suffix, length);
        table.paginate.appendChild(next);
        table.paginate.appendChild(last);
        /* add event */
        var _event = table.paginate.getElementsByTagName('li');
        for (var i = 0; i < _event.length; i++) {
            _event[i].onclick = function() {
                if (this.className != 'off') {
                    if (this.id == 'next') {
                        if (table.cursor < table.total) table.cursor += 1;
                    } else if (this.id == 'pervious') {
                        if (table.cursor > 1) table.cursor -= 1;
                    } else if (this.id == 'first'){
                        table.cursor = 1;
                    } else if (this.id == 'last'){
                        table.cursor = table.total;
                    } else {
                        var a = this.getElementsByTagName('a')[0];
                        table.cursor = parseInt(a.innerHTML);
                    }
                    simpleTable.drawInfo(table);
                    simpleTable.drawPageBar(table); 
                }
                return false;
            }
        }
    },
    drawInfo: function(obj) {
        if (typeof obj == 'object') {
            var table = obj;
        } else {
            alert('drawInfo() need one simpleTable');
        }
        table.info.innerHTML = ''; // delete old dom
        var tbody = table.obj.getElementsByTagName('tbody')[0];
        table.count = tbody.getElementsByTagName('tr').length;
        table.total = table.count % table.size == 0 ? table.count / table.size: Math.ceil(table.count / table.size);
        if (table.cursor > 0) {
            table.curEnd = table.cursor * table.size > table.count ? table.count: table.cursor * table.size;
            if(table.curEnd==0)
                table.curBegin=0;
            else
                table.curBegin = table.size > table.curEnd ? 1 : table.curEnd - table.size + 1;
        }
        var _info = 'Showing ' + table.curBegin + ' to ' + table.curEnd + ' of ' + table.count + ' entries';
        table.info.appendChild(document.createTextNode(_info));
    }
}
/*--------------------------*/
function ajax(type, url, data, success, failed, waiting) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
    }
    var type = type.toUpperCase();
    var random = Math.random();
    if (typeof data == 'object') {
        var str = '';
        for (var key in data) {
            str += key + '=' + data[key] + '&';
        }
        data = str.replace(/&$/, '');
    }
    if (type == 'GET') {
        if (data) {
            xmlhttp.open('GET', url + '?' + data, true);
        } else {
            xmlhttp.open('GET', url + '?t=' + random, true);
        }
        xmlhttp.setRequestHeader("Content-type", "text/plain; charset=utf-8");
        xmlhttp.send();
    } else if (type == 'POST') {
        xmlhttp.open('POST', url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(data);
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                success(xmlhttp.responseText);
            } else {
                if (failed) {
                    failed(xmlhttp.status);
                }
            }
        }
    }
}