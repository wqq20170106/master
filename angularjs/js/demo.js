//直操作dom
angular.element(document).ready(function(){
	setInterval(function(){
		var d = new Date();
		var tp1 = document.querySelector("#clock");
		angular.element(tp1).text(d.toString());
	},1000);
});

//利用模板、指令来实现小时钟视图(自定义模板1-ezstuff)
angular.module("ezstuff",[])//创建ezstuff
.directive("ezClock",function(){//在模块上注册指令ezClock的类工厂
	return{
		restrict:"E",
		replace:true,
		template:"<div class='clock'></div>",
		link:function(scope,element,attrs){
			setInterval(function(){
				var d = new Date();
				element.text(d.toString());
			});
		}
	}
});
/**
 * 在声明式模板中显示数据,将数据传递给指令(自定义模板2-data)
 */

//sb变量建立在window对象上,后期可能会出现重复（不推荐）
var sb = {
	name : "somebody",
	gender : "male",
	age : 28
};
angular.module("data",[])
.directive("ezNamecard",function(){
	return {
		restrict : "E",
		template : "<div class='namecard'>",
		replace : true,
		link : function(scope,element,attrs){
			//读取data属性值，获得变量名，通过eval得到其值
			var sb = eval(attrs.data);
			//填充DOM元素内容
			element.append("<div>name : " + sb.name + "</div>")
				.append("<div>gender : " + sb.gender + "</div>")
				.append("<div>age : " + sb.age + "</div>")
		}
	};
});

/**
 * 作用域/Scope<scope.html>，(上边的sb对象建立在window上不做推荐)AngularJS引入了一个自用的命名空间，也就是$rootScope对象
 */
angular.module("ezstuff",[])
.directive("ezNamecard",function(){
	return {
		restrict : "E",
		template : "<div class='namecard'>",
		replace : true,
		link : function(scope,element,attrs){
			var sb = scope.$eval(attrs.data);
			element.append("<div>name : " + sb.name + "</div>")
				.append("<div>gender : " + sb.gender + "</div>")
				.append("<div>age : " + sb.age + "</div>")
		}
	};
});
/**
 * $watch方法,监听数据的变化(watch.html)
 */
angular.module("ezstuff",[])
.directive("ezNamecard",function($rootScope){
	return{
		restrict:"E",
		template:"<div class='namecard'>",
		replace:true,
		link:function(scope,element,attrs){
			element.append("<div>name : <span class='name'></span></div>")
			.append("<div>gender : <span class='gender'></span></div>")
			.append("<div>age : <span class='age'></span></div>")
			scope.$watch(attrs.data,function(newV,oldV){
				var fields = element.find("span");
				fields[0].textContent = newV.name;
				fields[1].textContent = newV.gender;
				fields[2].textContent = newV.age;
			},true);
			setInterval(function(){
				scope.$apply("sb.age = sb.age + 1");
			},1000);
		}
	}
});

/**
 * 如何修改数据(update.html)
 */
angular.module("ezstuff",[])
.directive("ezNamecardEditor",function(){
	return{
		restrict:"E",
		template:"<ul class='nceditor'></ul>",
		replace:true,
		link:function(scope,element,attrs){
			//获取变量名称
			var model = attrs.data;
			//展开HTML模板，使用field属性标记对应字段
			element.append("<li>name : <input type='text' field='name'></li>")
				.append("<li>gender : <input type='text' field='gender'></li>")
				.append("<li>age : <input type='text' field='age'></li>");
			//监听DOM事件，变化时修改变量值
			element.find("input").on("keyup",function(ev){
				var field = ev.target.getAttribute("field");
				scope[model][field] = ev.target.value;
				//将对scope的修改进行传播
				scope.$apply("");
			});
		}
	}
})
.directive("ezLogger",function(){
	return{
		restrict:"A",
		link:function(scope,element,attrs){
			var model = attrs.data;
			scope.$watch(model,function(newV){
				var cnt = JSON.stringify(newV,null," ");
				element.html("<pre>"+ cnt +"</pre>");
			},true);
		}
	};
});

/**
 * (D&I.html)
 * 有些api找不到，需要通过依赖注入的方式来获取，
 * AngularJS把所有的功能组件都以依赖注入的方式组织起来，
 * 例如$http组件
 */
angular.element(document).ready(function(){
	angular.injector(["ng"]).invoke(function($http){
		//将$http对象转成字符串显示
		var e = document.querySelector("#logger");
		angular.element(e).text($http.toString());
	});
	angular.injector(["ng"]).invoke(function($compile){
		var a = document.querySelector("#com");
		angular.element(a).text($compile.toString());
	});
});

/**
 * 通过angular的bootstrap方法启动框架
 * (bootstrap.html)
 */
angular.element(document).ready(function(){
	var e = document.querySelector("#bootstrap");
	angular.element(e).on("click",function(){
		angular.bootstrap(document,["ezstuff"]);
	});
});
angular.module("ezstuff",[])
.directive("ezDuang",function(){
	return{
		restrict:"E",
		template:"<img src='http://ww4.sinaimg.cn/bmiddle/757eb2ffjw1eptcr4qobjg209205dthh.gif'>"
	};
});
/*
 ****************模拟引导启动过程和上边一样****************
 */
//模拟引导启动过程
/*
angular.element(document).ready(function(){
	//第一步：创建注入器并保存到根对象的data中
	var injector = angular.injector(["ng","ezstuff"]);
	angular.element(document).data("$injector",injector);
	//第二步：创建根作用域并保存到根对象的data中
	var rootScope = injector.get("$rootScope");
	angular.element(document).data("$rootScope",rootScope);
	//第三步：编译DOM树
	var compile = injector.get("$compile")
	compile(document)(rootScope);
});
*/
/*
 *****************模拟引导启动过程结束*********************
 */

/**
 * 控制器-controller的运用
 * (controller.html)
 */

var ezControllerClass = function($scope){
	//view model
	$scope.vm = {
		sb:{
			name:"Jason Stantham",
			gender:"male",
			age:48,
			career:"actor",
			photo:"http://b.hiphotos.baidu.com/baike/w%3D268/sign=a03742145bee3d6d22c680cd7b176d41/359b033b5bb5c9eae4c45250d739b6003af3b34a.jpg",
		},	
		shuffle:function(){
				var repo = [
					{name:"Jason Stantham",gender:"male",age:48,career:"actor",photo:"http://b.hiphotos.baidu.com/baike/w%3D268/sign=a03742145bee3d6d22c680cd7b176d41/359b033b5bb5c9eae4c45250d739b6003af3b34a.jpg"},
					{name:"Jessica Alba",gender:"female",age:32,career:"actress",photo:"http://h.hiphotos.baidu.com/baike/w%3D268/sign=ce8cdcb43bdbb6fd255be2203125aba6/b219ebc4b74543a91d7092831c178a82b9011411.jpg"},
					{name:"Nicolas Cage",gender:"male",age:53,career:"actor",photo:"http://f.hiphotos.baidu.com/baike/w%3D268/sign=e97412d2359b033b2c88fbdc2dcf3620/4a36acaf2edda3cc4187b7f600e93901203f9280.jpg"},
					{name:"崔永元",gender:"male",age:48,career:"independent journalist",photo:"http://e.hiphotos.baidu.com/baike/w%3D268/sign=856e3aab34d3d539c13d08c50286e927/8c1001e93901213ff48a548956e736d12f2e952d.jpg"},
					{name:"Sheetal Sheth",gender:"female",age:36,career:"actress",photo:"http://h.hiphotos.baidu.com/baike/c0%3Dbaike80%2C5%2C5%2C80%2C26/sign=f3627d0333fa828bc52e95b19c762a51/060828381f30e924f7c565374c086e061d95f757.jpg"},
					{name:"Barack Obama",gender:"male",age:58,career:"president",photo:"http://a.hiphotos.baidu.com/baike/w%3D268/sign=2a0045f7f1d3572c66e29bdab2126352/f7246b600c338744cb293d62520fd9f9d72aa03b.jpg"},
					{name:"Владимир Владимирович Путин",gender:"male",age:63,career:"president",photo:"http://h.hiphotos.baidu.com/baike/w%3D268/sign=657e210bb17eca8012053ee1a9239712/8435e5dde71190efa1a915f7cf1b9d16fdfa604c.jpg"}
				];
				var idx = Math.floor(Math.random()*repo.length);
				$scope.vm.sb = repo[idx];
		}
	};
};
angular.module("ezstuff",[])
.controller("ezController",ezControllerClass);

/**
 * 创建服务组件
 * config可以配置服务
 * (service.html)
 */
function doCalc(){
	var injector = angular.injector(["ezstuff"]),
	 	mycalculator = injector.get("ezCalculator"),
	 	ret = mycalculator.add(3,4);
	document.querySelector("#result").textContent = ret;
}
angular.module("ezstuff",[])
.provider("ezCalculator",function(){
	var currency = "$";
	this.setLocal = function(l){
		var repo = {
			"CN":"¥",
			"US":"$",
			"JP":"¥",
			"EN":"€"
		};
		if(repo[l]) currency = repo[l];
	};
	this.$get = function(){
		return{
			add : function(a,b){return currency+(a+b);},
			subtract : function(a,b){return currency+(a-b);},
			multiply : function(a,b){return currency+(a*b);},
			divide: function(a,b){return currency+(a/b);}
		};
	};
})
.config(function(ezCalculatorProvider){
	ezCalculatorProvider.setLocal("CN");
});

/*
 *factory方法
angular.module("ezstuff",[])
	.factory("ezCalculator",function(){
		return {
			add : function(a,b){return a+b;},
			subtract : function(a,b){return a-b;},
			multiply : function(a,b){return a*b;},
			divide: function(a,b){return a/b;}
		}
	})
*/

/*
 * server方法
 var ezCalculatorClass = function(){
	this.add = function(a,b){return a+b;};
	this.subtract = function(a,b){return a-b;};
	this.multiply = function(a,b){return a*b;};
	this.divide = function(a,b){return a/b;};
};

angular.module("ezstuff",[])
.service("ezCalculator",ezCalculatorClass);

 */

/**
 * 不同指令通过scope作用域分隔
 * (order&scope.html)
 */
angular.module("ezstuff",[])
.controller("ezCtrl",["$scope",function($scope){
	$scope.Emmy = {
		name:"Emmy",
		address:"1600 Amphitheatre"
	};
	$scope.Edison = {
	    name: "Edison",
	    address: "2500 Amphitheatre"
	};
}])
.directive("ezCustomer",function(){
	return {
	  restrict:"E",
	  replace:true,
	  scope:{
		customer:"=sb",
	  },
	  template: "<div>Name: {{customer.name}} Address: {{customer.address}}</div>"
  };
});


