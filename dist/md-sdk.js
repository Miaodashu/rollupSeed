(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.mdsdk = factory());
}(this, (function () { 'use strict';

	var collect = {
		params: {},
		data: {
			serverUrl: "", //上报接口
			EVENT_PREFIX: "longan-" //全局事件过滤节点前缀
		},
		// 设置基本参数配置 上报接口，id过滤前缀
		setData: function setData(data) {
			this.data = Object.assign({}, this.data, data);
		},
		// 初始化
		init: function init() {
			//Document对象数据
			if (document) {
				this.params.domain = document.domain || ""; //获取域名
				this.params.url = document.URL || ""; //当前Url地址
				this.params.title = document.title || "";
				this.params.referrer = document.referrer || ""; //上一跳路径
			}
			//Window对象数据
			if (window && window.screen) {
				this.params.sh = window.screen.height || 0; //获取显示屏信息
				this.params.sw = window.screen.width || 0;
				this.params.cd = window.screen.colorDepth || 0;
				this.params.origin = window.location.origin;
				this.params.pathname = window.location.pathname;
			}
			//navigator对象数据
			if (navigator) {
				this.params.lang = navigator.language || ""; //获取所用语言种类
			}
			// , 返回document的可见性
			document.addEventListener("visibilitychange", function () {
				console.log(document.visibilityState);
				// stay()
			});
			this.listenTriggerEvent(this.params);
			this.listenHistory(this.params);
			// console.log(this.params)
			// this.sendRequest(this.params)
		},
		// 上报数据
		sendRequest: function sendRequest(config) {
			config.route = window.location.origin + window.location.pathname;
			config.createTime = (new Date().getTime() / 1000).toFixed(0);
			// 直接上报
			var image = new Image();
			image.src = data.serverUrl + "?" + parseParams(params);
		},
		// 监听全局事件埋点
		listenTriggerEvent: function listenTriggerEvent(config) {
			var EVENT_PREFIX = this.data.EVENT_PREFIX;
			document.addEventListener("click", function (e) {
				var dataset = e.target.dataset;
				if (e.target.id && e.target.id.startsWith(EVENT_PREFIX)) {
					var eventName = e.target.id.split(EVENT_PREFIX)[1];
					var eventContent = e.target.innerHTML || "";
					var payload = Object.assign(config, dataset, {
						type: "event-click",
						client: navigator.userAgent,
						content: eventContent,
						name: eventName
					});
					console.log(payload);
					//上传埋点信息fn
					// sendRequest(payload);
				}
			});
		},
		listenHistory: function listenHistory(params) {
			window.onload = function () {
				params.createTime = getCurrentTime();
				params.type = '进入页面';
				console.log('onload', params);
			};
			window.onbeforeunload = function () {
				params.leaveTime = getCurrentTime();
				console.log(params);
				params.type = '离开页面';
				localStorage.setItem('onbeforeunload', params);
				alert("oo");
			};
			// 篇幅有限这里addHistoryListener挖个坑有机会连载再细说叭
			// window.addHistoryListener('history', function() {
			//     alert('sss')
			//   params.route = getCurrentRoute();
			//   params.createTime = getCurrentTime();
			//   stay()
			//   console.log(params);
			// //   sendRequest(params);
			// });
		}
	};
	// collect.setData({ serverUrl: "www.baidu.com" });

	//将所有获取到的信息进行拼接
	function parseParams() {
		var args = "";
		for (var i in params) {
			// alert(i);
			if (args != "") {
				args += "&";
			}
			args += i + "=" + params[i];
		}
		return args;
	}
	// 获取当前时间的秒级时间戳
	function getCurrentTime() {
		return (new Date().getTime() / 1000).toFixed(0);
	}

	return collect;

})));
