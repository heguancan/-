// 参数设置部分
var prizeRank= $('#prizeRank'); // 获取几等奖dom
var luckCount=$('#luck-count'); // 获取人数dom
var defaultRank= 1;
// var xinmLenght=parseInt(random()*xinm.length);

var ConstPeople= 3//设置单次抽奖人数
var isAssignation=true;//设置是否有内定的一个人
var assignationName='修睿';//内定人的姓名
var assignationImg='img/7.jpg';//内定人的头像
var assignationNum='13312345678'

var Lotterynumber = ConstPeople; //赋值给变量

var nametxt = $('.slot'); 
var phonetxt = $('.name');   //中间部分

var pcount = xinm.length-1;//参加人数为数组长度减一
var runing = true;
var trigger = true;

var inUser = (Math.floor(Math.random() * 10000)) % ConstPeople + 1;
var num = 0;
var allLuck=new Array();
function luckObj(luckName,img,rank,phone){ 
	this.luckName = luckName; 
	this.img = img; 
	this.rank=rank;
	this.phone = phone; 
   } 


   function tableToExcel(){
	//要导出的json数据
	const jsonData = allLuck;
	//列标题，逗号隔开，每一个逗号就是隔开一个单元格
	let str = `姓名,图片地址,奖项，电话号码\n`;
	//增加\t为了不让表格显示科学计数法或者其他格式
	for(let i = 0 ; i < jsonData.length ; i++ ){
	  for(let item in jsonData[i]){
		  str+=`${jsonData[i][item] + '\t'},`;     
	  }
	  str+='\n';
	}
	//encodeURIComponent解决中文乱码
	let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
	//通过创建a标签实现
	let link = document.createElement("a");
	link.href = uri;
	//对下载的文件命名
	link.download =  "中奖人名单.csv";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
  }


$(function () {
	prizeRank.text('一等奖'); //页面刷新重设抽奖为一等奖
	luckCount.text(1); //页面刷新重设抽奖人数为1

	console.log(nametxt[0]);
	// nametxt[0].baseURI
	nametxt.css('background-image','url('+xinm[0]+')');
	phonetxt.html(phone[0]);
});


function changMun(){
	
	defaultRank++;
	if(defaultRank>3){
		prizeRank.text('一等奖');
		$("#imageId").attr("src","img/prize1.jfif");
		defaultRank=1;
		
	}else{
	if(defaultRank==1){
		prizeRank.text('一等奖');
		$("#imageId").attr("src","img/prize1.jfif");
	}
	if(defaultRank==2){
		prizeRank.text('二等奖');
		$("#imageId").attr("src","img/prize2.jfif");
	}

	if(defaultRank==3){
		prizeRank.text('三等奖');
		$("#imageId").attr("src","img/prize3.jfif");
	}
	
  }
}


// 增加抽奖人数
 function add(){
	luckCount.text(parseInt(luckCount.text())+1);
 }

 // 减少抽奖人数
 function reduce(){
	 if(luckCount.text()==1){
		luckCount.text(1);
	 }else{
		luckCount.text(parseInt(luckCount.text())-1);
	 }	
 }

// 开始停止
function start() {

	Lotterynumber = luckCount.text();

	console.log(Lotterynumber)

	if (runing) {

		if ( pcount <= Lotterynumber ) {
			alert("抽奖人数不足"+Lotterynumber+"人");
		}else{
			runing = false;
			$('#start').text('停止');
			startNum();
		}

	} else {
		$('#start').text('自动抽取中('+ Lotterynumber+')');
		zd();
	}
	
}

// 开始抽奖

function startLuck() {
	runing = false;
	$('#btntxt').removeClass('start').addClass('stop');
	startNum();
}

// 循环参加名单
function startNum() {
	num = Math.floor(Math.random() * pcount); 


	nametxt.css('background-image','url('+xinm[num]+')'); //中间抽奖图片和名字变换
	phonetxt.html(phone[num]);


	t = setTimeout(startNum, 0);
}

// 停止跳动
function stop() {
	pcount = xinm.length-1;
	clearInterval(t);
	t = 0;
}

// 打印中奖人

function zd() {
	if (trigger) {

		trigger = false;
		var i = 0;

		if ( pcount >= Lotterynumber ) {
			stopTime = window.setInterval(function () {
				
				if (runing) {
					runing = false;
					$('#btntxt').removeClass('start').addClass('stop');
					startNum();
				} else {
					runing = true;
					$('#btntxt').removeClass('stop').addClass('start');
					stop();

					i++;
					Lotterynumber--;

					$('#start').text('自动抽取中('+ Lotterynumber+')');

					ConstPeople=luckCount.text();  //抽奖人数

					if ( i == ConstPeople ) {
						console.log("抽奖结束");
						console.log(allLuck);
						localStorage.setItem('draw',JSON.stringify(allLuck));
						window.clearInterval(stopTime);
						$('#start').text("开始");
						Lotterynumber = ConstPeople;
						trigger = true;
					};

					if (isAssignation && Lotterynumber == inUser) {
						// 指定中奖人
						nametxt.css('background-image','url(img/7.jpg)');
						phonetxt.html(assignationName);
						$('.luck-user-list').prepend("<li><div class='portrait' style='background-image:url("+assignationImg+")'></div><div class='luckuserName'>"+assignationName+"</div> <span class='luckuserName1'>"+ prizeRank.text() +"</span><span class='luckuserName2'>"+ assignationNum.substr(0,4)+"****"+ assignationNum.substr(8,3) +"</span></li>");
						$('.modality-list ul').append("<li> <div class='luck-img' style='background-image:url("+assignationImg+")'></div><p>"+assignationName+"</p></li>");
						inUser = 9999;
						var allLuckObj=new luckObj(assignationName,assignationImg,prizeRank.text(),assignationNum);
						allLuck.push(allLuckObj);
					}else{
						//打印中奖者名单
						$('.luck-user-list').prepend("<li><div class='portrait' style='background-image:url("+xinm[num]+")'></div><div class='luckuserName'>"+phone[num]+"</div> <span class='luckuserName1'>"+ prizeRank.text() +"</span> <span class='luckuserName2'>"+ luckNum[num].substr(0,4)+"****"+ luckNum[num].substr(8,3)+"</span> </li>");
						$('.modality-list ul').append("<li><div class='luck-img' style='background-image:url("+xinm[num]+")'></div><p>"+phone[num]+"</p></li>");

						var allLuckObj1=new luckObj(phone[num],xinm[num],prizeRank.text(),luckNum[num]);
						allLuck.push(allLuckObj1);

						//将已中奖者从数组中"删除",防止二次中奖
						xinm.splice($.inArray(xinm[num], xinm), 1);
						phone.splice($.inArray(phone[num], phone), 1);
					};
				}
			},1000);
		};
	}
}

