import swal from 'sweetalert';
// import adderss from '../tools/adderss'
var erc20Abi=require('../abi/coinAbi.json');
import { ethers } from 'ethers';
const provider = new ethers.providers.Web3Provider(window.ethereum)
const usdt='0x55d398326f99059fF775485246999027B3197955';
// 实例化 USDT
function getUsdt(){
	return new ethers.Contract(usdt, erc20Abi, provider.getSigner());
}
// 授信
async function usdtApprove(address,type){
	let res= await getUsdt().approve(address,"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").catch(err=>{
		let errJson = JSON.parse(JSON.stringify(err));
		swal({
			title: "失败",
			text: errJson.reason,
			icon: "error",
		})
	})
	return res;
}
// 是否授权
async function allowance(adderss,adderss1){
	let res=await getUsdt().allowance(adderss,adderss1).catch(err=>{
		let errJson = JSON.parse(JSON.stringify(err));
		swal({
			title:"fail",
			text: errJson.reason,
			icon: "error",
		})
	})
	return res
}
// usdts钱包余额
async function usdtMoney(address){
	let res = await this.getUsdt().balanceOf(address);
	let num=mobileFilter(res);
	return num
}
//转换
function mobileFilter(val){
	let inNumber = val.toString();
	let num=ethers.utils.formatUnits(inNumber);
	return num
}
function filter(val){
	let inNumber = val.toString();
	return inNumber
}
function filter1(val){
	let inNumber = val.toString();
	let num=ethers.utils.formatUnits(inNumber);
	return num.toFixed(4)
}
// 小数判断
function number(data){
	var rep=/[.]/;
	let res=data;
	if(rep.test(data)){
		res=data.toFixed(4)
	}
	return res
}
function formatDate(datetime) {
	if(datetime==undefined){
		return
	}
	var dateTimeStamp = datetime * 1000;
	var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
	var hour = minute * 60; 
	var day = hour * 24;
	var week = day * 7;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime(); //获取当前时间毫秒
	var diffValue = dateTimeStamp - now; //时间差
	var datetime = new Date();
	datetime.setTime(dateTimeStamp);
	var Nyear = datetime.getFullYear(); {}
	var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
	var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
	var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
	var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
	var result = Nyear + "-" + Nmonth + "-" + Ndate+" "+Nhour+":"+Nminute+":"+Nsecond
	return result;
}
export{
	usdtApprove,mobileFilter,allowance,filter,formatDate
}