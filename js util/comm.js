/**
 * 打印对象的属性
 * hujiapeng
 * @param Obj
 */
function ShowObjProperty(Obj) {

	var PropertyList = '';

	for (i in Obj) {

		if (Obj.i != null)

			PropertyList = PropertyList + i + '属性：' + Obj.i + '\r\n';

		else

			PropertyList = PropertyList + i + '方法\r\n';

	}

	alert(PropertyList);

}

/**
 * 读取请求参数
 * hujiapeng
 * @param name
 * @returns
 */
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
/**
 * 读取后台数据并返回
 * hujiapeng
 */
function queryInfo(linkurl, param) {
	var obj = new Object();
	$.Ajax({
		url : linkurl,
		data : param,
		dataType : 'json',
		async : false,
		type : 'POST',
		success : function(data) {
			obj = data;
		}
	});
	return obj;
}
/**
 * 异步查询对象
 * 
 * @param linkurl
 * @param param
 * @param func
 * hujiapeng
 */
function queryObj(linkurl,param,func){
	$.Ajax({
		url : linkurl,
		data : param,
		dataType : 'json',
		async : true,
		type : 'POST',
		success : function(data) {
			func(data);
		}
	});
}
/**
 * 删除后台数据并回调
 * hujiapeng
 */
function deleteInfo(linkurl,param,callback){
	 $('#delete_inform').modal('show');
	 $('#delete-btn').unbind('click').click(function(){
	 		$.Ajax({
	 			url : linkurl,
	 			data : param,
	 			type : 'POST',
	 			dataType : 'json',
	 			async : false,
	 			success : function(response) {
	 				$('#delete_inform').modal('hide');
	 				// 实现回调函数
	 				callback(response);
	 			}
 			 });
 	});
}

/**
 * 共用异步列表查询
 * 
 * @param linkurl
 *            请求controller地址
 * @param pdata
 *            请求参数{}
 * @param tplId
 *            模板Id
 * @param divId
 *            模板位置html节点Id
 * hujiapeng
 */
function publicAjaxQuery(linkurl, pdata, tplId, divId,type,title) {
	$.Ajax({
		url : linkurl,
		data : pdata,
		dataType : 'json',
		async : true,
		type : 'POST',
		success : function(data) {
			var userobj = function() {
				this.jsonstr = '';
				this.uobj = new Object();
			};
			var len = data.length;
			var userarr = new Array();
			for ( var i = 0; i < data.length; i++) {
				var obj = new userobj();
				obj.jsonstr = JSON.stringify(data[i]);
				obj.uobj = data[i];
				userarr[i] = obj;
			}
			var $html = $(template.render(tplId, {
				'templist' : userarr,
				'len' : len,
				'type' : type,
				'title' : title
			}));
			$("#" + divId).empty().append($html);
		}
	});
}
/**
 * 分页加载后台数据
 * 
 * @param linkurl
 *            请求controller地址
 * @param pdata
 *            请求参数{}
 * @param tplId
 *            模板Id
 * @param divId
 *            模板位置html节点Id
 * hujiapeng
 */
function loadPageInfo(linkurl, pdata, listplId, lisdivId,pagedivId,isAdmin) {
	var tpage=pdata.targPage;
	if(tpage==undefined||(trim(tpage+'')=='')){
		return false;
	}
	var totalPage=$("#totalPage").val();
	if(totalPage!=undefined){
		if(parseInt(tpage)>parseInt(totalPage)){
			pdata.targPage=totalPage;
		}
	}
	//pdata.currPage=$("#currPage").val();
	var first=pdata.first>0?pdata.first:1;
	var last=pdata.last;
	//alert(166+",targPage:"+pdata.targPage+",totalPage:"+totalPage+",currpage:"+pdata.currPage);
	delete pdata.first;
	delete pdata.last;
	$.Ajax({
		url : linkurl,
		data : pdata,
		dataType : 'json',
		async : true,
		type : 'POST',
		success : function(data) {
			initlistInfo(data, listplId, lisdivId,isAdmin);
			data.first=first;
			data.last=last;
			data.currPage=data.targPage;
			if(data.currPage==-1){
				data.currPage=totalPage;
			}
			initpageInfo(data,pagedivId);
			adaptTableHgt();
			$('.xw-load-gif').css('display','none');
		}
	});
}


/**
 * 加载列表数据
 * hujiapeng
 */
function initlistInfo(data, tplId, divId,isAdmin){
	var userobj = function() {
		this.jsonstr = '';
		this.uobj = new Object();
	};
	var list=data.result.resultList;
	var len = data.result.resultList.length;
	var userarr = new Array();
	for ( var i = 0; i < len; i++) {
		var obj = new userobj();
		// 转义双引号
		obj.jsonstr = JSON.stringify(list[i]).replaceAll("&quot;", "\\\"");
		obj.uobj =list[i];
		userarr[i] = obj;
	}
	var html = template.render(tplId, {
		'templist' : userarr,
		'len' : len,
		'isAdmin' : isAdmin
	});
	$("#" + divId).html("").html(html);
}
/**
 * 加载分页控件
 * 
 * @param data
 * @param divId
 * hujiapeng
 */
function initpageInfo(pageInfo,divId){
	pageInfo.total=pageInfo.result.resultCount;
	var pages = pageInfo.totalPage;
	var first = pageInfo.first<=0?1:pageInfo.first;
	var last = pageInfo.last;
	var targPage = pageInfo.pageTarget=="LAST"?pageInfo.currPage:pageInfo.targPage;
	if(targPage==0)targPage=pageInfo.targPage;
	if(targPage==-1){
		targPage=last;
	}
	if (last > pages) {
		last = pages;
	}
	if (targPage > pages) {
		targPage = pages;
	}
	if (targPage > last) {
		first = targPage - 1;
		last = first + 4 < pages ? (first + 4) : pages;
	} else if (targPage < first) {
		last = targPage==0?last:targPage + 1;
		first = last - 4 > 0 ? (last - 4) : 1;
	}
	
	pageInfo.currPage=pageInfo.currPage>0?pageInfo.currPage:pageInfo.targPage;
	pageInfo.first=first;
	pageInfo.last=last;
	var html=template.render("pageview",{
		"page" : pageInfo
	});
	$("#" + divId).html("").html(html);
}

/**
 * 去掉字符串头尾空格
 * hujiapeng
 */ 
function trim(str) {   
    return str.replace(/(^\s*)|(\s*$)/g, "");   
}

/**
 * 捕获输入的键盘是否是数字
 * 
 * @param evt
 * @param code
 * @param amount
 * @returns {Boolean}
 * hujiapeng
 */
function checkevt(evt,code,amount){
	if (amount.length == 0) {
		if (!((parseInt(code) >= parseInt(49) && parseInt(code) <= parseInt(57))
				|| (parseInt(code) >= parseInt(97) && parseInt(code) <= parseInt(105))
				|| code == 8 || code == 16)) {
			evt.returnValue = false;
			return false;
		} else {
			return true;
		}
	} else {
		if (!((parseInt(code) >= parseInt(48) && parseInt(code) <= parseInt(57))
				|| (parseInt(code) >= parseInt(96) && parseInt(code) <= parseInt(105))
				|| code == 8 || code == 16)) {
			evt.returnValue = false;
			return false;
		} else {
			return true;
		}
	}
	return true;
}
/**
 * 只允许输入正整数
 * 
 * @param event
 * hujiapeng
 */
function checkpageinput(e) {
	var amount = document.getElementById("tzpage").value;
	// alert(amount);
	var evt = window.event || e;
	var code = evt.keyCode || evt.which;
	if(checkevt(evt,code,amount)){
		return true;
	}else{
		evt.returnValue = false;
		evt.which=0;
		evt.preventDefault();
		return false;
	}
}
/**
 * 是否为正整数
 * hujiapeng
 */ 
function isPositiveInteger(n){
	if( n == 0 )
	{
	    return false;
	}
	return n == Math.abs(parseInt(n));
}

/**
 * 日期格式转化
 * 
 * @param dateString
 */
function date(dateString){
	var date=new Date(dateString);
	Y = date.getFullYear() + '-';
	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	D =(date.getDate()< 10 ? '0'+(date.getDate()) : date.getDate())+' ';
	h=(date.getHours()< 10 ? '0'+(date.getHours()) : date.getHours())+':';
	m=(date.getMinutes()< 10 ? '0'+(date.getMinutes()) : date.getMinutes());
// s=(date.getSeconds()< 10 ? '0'+(date.getSeconds()) : date.getSeconds());
	return Y+M+D+h+m;
}


function editTable(){
	$('.table_edit').on('click','.edit_btn,.view_btn',function(){
	 	var cover_box = $("<span class='cover_box'></span>");
        $('.sidebarright_tag').css('width','360px');
        $('.main-content-wrap').css('margin-right','360px');
        if(!$(".sidebarRight").hasClass("bounceInRight")){
    		$(".sidebarRight").addClass("sidebar-toggle-right animated bounceInRight");
    	}
        var $cur_tr=$(this).parents("tr");
        $cur_tr.siblings().children().removeClass('td_back_color');
        $cur_tr.siblings().find('.cover_box').remove();
        $cur_tr.find(".add_cover").append(cover_box);
        $cur_tr.children().addClass('td_back_color');
        $(window).width() < 660 && ($(".sidebar").removeClass("sidebar-toggle"), $(".main-content-wrap").removeClass("main-content-toggle-left main-content-toggle-right"));
	});
}

function tableAdd(){
	$('.sidebarright_tag').css('width','360px');
	$('.main-content-wrap').css('margin-right','360px');
	if(!$(".sidebarRight").hasClass("bounceInRight")){
		$(".sidebarRight").addClass("sidebar-toggle-right animated bounceInRight");
	}
	
	$('.table_edit').find("td").removeClass('td_back_color');
	$('.table_edit').find(".cover_box").remove();
	
    $(this).parent().parent().siblings().find('.cover_box').remove();
	$(window).width() < 660 && ($(".sidebar").removeClass("sidebar-toggle"), $(".main-content-wrap").removeClass("main-content-toggle-left main-content-toggle-right"));  
}

function tableCancel(){
	$(".sidebarRight").toggleClass("sidebar-toggle-right animated bounceInRight");
    $('.main-content-wrap').css('margin-right',0);
	$(window).width() < 660 && ($(".sidebar").removeClass("sidebar-toggle"), $(".main-content-wrap").removeClass("main-content-toggle-left main-content-toggle-right"));  
}
/**
 * 日期相加 得到新的日期字符串
 * @param d
 * @param days
 * @returns {String}
 * hujiapeng
 */
function addDate(d,days){ 
	var newdt=new Date();
	newdt.setTime(d.getTime());
	newdt.setDate(d.getDate()+days); 
    var m=newdt.getMonth()+1; 
    return newdt.getFullYear()+'-'+m+'-'+newdt.getDate(); 
} 


/**
 * 获取本周、本季度、本月、上月的开端日期、停止日期
 */ 
var now = new Date(); // 当前日期
var nowDayOfWeek = now.getDay(); // 今天本周的第几天
var nowDay = now.getDate(); // 当前日
var nowMonth = now.getMonth(); // 当前月
var nowYear = now.getYear(); // 当前年
nowYear += (nowYear < 2000) ? 1900 : 0; // 

var lastMonthDate = new Date(); // 上月日期
lastMonthDate.setDate(1); 
lastMonthDate.setMonth(lastMonthDate.getMonth()-1); 
var lastYear = lastMonthDate.getYear(); 
var lastMonth = lastMonthDate.getMonth(); 

/**
 * 初始化当前日期
 * 
 * @param indate
 */
function loadDate(indate){
	now=indate;
	nowDayOfWeek = now.getDay();
	nowDay = now.getDate(); 
	nowMonth = now.getMonth(); // 当前月
	nowYear = now.getYear(); // 当前年
	nowYear += (nowYear < 2000) ? 1900 : 0; // 
	lastMonthDate=indate;
	lastMonthDate.setDate(1); 
	lastMonthDate.setMonth(lastMonthDate.getMonth()-1); 
	lastYear = lastMonthDate.getYear(); 
	lastMonth = lastMonthDate.getMonth(); 
}

// 格局化日期：yyyy-MM-dd
function formatDate(date) { 
var myyear = date.getFullYear(); 
var mymonth = date.getMonth()+1; 
var myweekday = date.getDate(); 

if(mymonth < 10){ 
mymonth = "0" + mymonth; 
} 
if(myweekday < 10){ 
myweekday = "0" + myweekday; 
} 
return (myyear+"-"+mymonth + "-" + myweekday); 
} 
// 读取当前日期
function getNowDay(){
	var nowdaydate=new Date(nowYear, nowMonth, nowDay); 
	return nowdaydate;
}

// 获得某月的天数
function getMonthDays(myMonth){ 
var monthStartDate = new Date(nowYear, myMonth, 1); 
var monthEndDate = new Date(nowYear, myMonth + 1, 1); 
var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24); 
return days; 
} 

// 获得本季度的开端月份
function getQuarterStartMonth(){ 
var quarterStartMonth = 0; 
if(nowMonth<3){ 
quarterStartMonth = 0; 
} 
if(2<nowMonth && nowMonth<6){ 
quarterStartMonth = 3; 
} 
if(5<nowMonth && nowMonth<9){ 
quarterStartMonth = 6; 
} 
if(nowMonth>8){ 
quarterStartMonth = 9; 
} 
return quarterStartMonth; 
} 

// 获得本周的开端日期
function getWeekStartDate() { 
var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek); 
// return formatDate(weekStartDate);
return weekStartDate;
} 

// 获得本周的停止日期
function getWeekEndDate() { 
var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)); 
// return formatDate(weekEndDate);
return weekEndDate;
} 

// 获得本月的开端日期
function getMonthStartDate(){ 
var monthStartDate = new Date(nowYear, nowMonth, 1); 
// return formatDate(monthStartDate);
return monthStartDate;
} 

// 获得本月的停止日期
function getMonthEndDate(){ 
var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth)); 
// return formatDate(monthEndDate);
return monthEndDate;
} 

// 获得上月开端时候
function getLastMonthStartDate(){ 
var lastMonthStartDate = new Date(nowYear, lastMonth, 1); 
return formatDate(lastMonthStartDate); 
} 

// 获得上月停止时候
function getLastMonthEndDate(){ 
var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth)); 
return formatDate(lastMonthEndDate); 
} 

// 获得本季度的开端日期
function getQuarterStartDate(){ 

var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1); 
return formatDate(quarterStartDate); 
} 

// 或的本季度的停止日期
function getQuarterEndDate(){ 
var quarterEndMonth = getQuarterStartMonth() + 2; 
var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth)); 
return formatDate(quarterStartDate); 
} 

// table块高度控制
function adaptTableHgt(){
   var m_hei = $(window).height() - 80;
    var tr_hei = (m_hei - 120) / 11;
    if (tr_hei >= 80) {
        $('.table_edit td').css('height', '80px');
    } else if (tr_hei >= 22) {
        $('.table_edit td').css('height', tr_hei + 'px');
    }
}

/**
 * 模拟java的map集合
 * 
 * @returns
 * hujiapeng
 */
function HashMap(){  
    // 定义长度
    var length = 0;  
    // 创建一个对象
    var obj = new Object();  
  
    /**
	 * 判断Map是否为空
	 */  
    this.isEmpty = function(){  
        return length == 0;  
    };  
  
    /**
	 * 判断对象中是否包含给定Key
	 */  
    this.containsKey=function(key){  
        return (key in obj);  
    };  
  
    /**
	 * 判断对象中是否包含给定的Value
	 */  
    this.containsValue=function(value){  
        for(var key in obj){  
            if(obj[key] == value){  
                return true;  
            }  
        }  
        return false;  
    };  
  
    /**
	 * 向map中添加数据
	 */  
    this.put=function(key,value){  
        if(!this.containsKey(key)){  
            length++;  
        }  
        obj[key] = value;  
    };  
  
    /**
	 * 根据给定的Key获得Value
	 */  
    this.get=function(key){  
        return this.containsKey(key)?obj[key]:null;  
    };  
  
    /**
	 * 根据给定的Key删除一个值
	 */  
    this.remove=function(key){  
        if(this.containsKey(key)&&(delete obj[key])){  
            length--;  
        }  
    };  
  
    /**
	 * 获得Map中的所有Value
	 */  
    this.values=function(){  
        var _values= new Array();  
        for(var key in obj){  
            _values.push(obj[key]);  
        }  
        return _values;  
    };  
  
    /**
	 * 获得Map中的所有Key
	 */  
    this.keySet=function(){  
        var _keys = new Array();  
        for(var key in obj){  
            _keys.push(key);  
        }  
        return _keys;  
    };  
  
    /**
	 * 获得Map的长度
	 */  
    this.size = function(){  
        return length;  
    };  
  
    /**
	 * 清空Map
	 */  
    this.clear = function(){  
        length = 0;  
        obj = new Object();  
    };  
}  
