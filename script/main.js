// JavaScript Document

(function ($) {
	"use strict";

	var BetterAcunote = window.BetterAcunote || {
		version: "0.0.1",
		init: function () {
			initPluginManager(BetterAcunote);
			initPlugin(BetterAcunote);
		},
		createPlugin: function (pluginProps) {
			return $.extend(true, BetterAcunote.Plugin.prototype, pluginProps);
		},
		registerPlugin: function (pluginProps) {
			var Plugin = BetterAcunote.Plugin;
			Plugin.prototype = BetterAcunote.createPlugin(pluginProps);
			BetterAcunote.PluginManager.addPlugin(Plugin);
		},
		activates: function () {
			BetterAcunote.PluginManager.activatePlugins();
		},
		deactivates: function () {
			BetterAcunote.PluginManager.deactivatePlugins();
		},
		Util: {
			defineReadOnlyProperty: function (obj, propName, props) {
				Object.defineProperty(obj, propName, $.extend(props, {
					configurable: false,
					enumarable: true
				}));
			}
		}
	};

	function initPlugin(BetterAcunote) {

		var plugin = function (context) {
			this.context = context;
		}

		// life cycle metthods

		var mustBeOverrideMethod = function () {
			throw Error("Must be override");
		}

		$.extend(plugin.prototype, {
			onActivated: mustBeOverrideMethod,
			onDeactivated: mustBeOverrideMethod
		});

		plugin.prototype.activateShim = function () {
			this.onActivated(this.context);
		}

		plugin.prototype.deactivateShim = function () {
			this.onDeactivated(this.context);
		}

		BetterAcunote.Plugin = plugin;
	}

	function initPluginManager(BetterAcunote) {

		var pluginManager = function () {
			this.plugins = [];
			this.context = {};
			this.init();
		}

		pluginManager.prototype.init = function () {
			this.context.views = {};

			var navs = {};
			navs["wiki"] = $("ul#mainnav a[href$=wiki]");
			navs["sprints"] = $("ul#mainnav a[href$=sprints]");
			navs["sprint"] = $("ul#mainnav a[href$=sprint]");
			navs["backlog"] = $("ul#mainnav a[href$=backlog]");
			navs["tasks"] = $("ul#mainnav a[href$=tasks]");
			navs["timeline"] = $("ul#mainnav a[href$=timeline]");
			this.context.views["navs"] = navs;

			var breadcrumbs = {};
			this.context.views["breadcrumbs"] = breadcrumbs;

			var toolbar = {};
			toolbar["new task"] = $("#show_hide_new_task");
			toolbar["move"] = $("#tasklist-toolbox input[value=Move]");
			toolbar["copy"] = $("#tasklist-toolbox input[value=Copy]");
			toolbar["go"] = $("#tasklist-toolbox input[value=Go]");
			toolbar["delete"] = $("#tasklist-toolbox input[value=Delete]");
			this.context.views["toolbar"] = toolbar;

			var tasktable = {
				headers: {}
			};
			tasktable.headers["description"] = $("#tasklist thead .title");
			tasktable.headers["owner"] = $("#tasklist thead .owner a");
			tasktable.headers["status"] = $("#tasklist thead .status a");
			tasktable.headers["priority"] = $("#tasklist thead .task_priority a");
			tasktable.headers["estimate"] = $("#tasklist thead .estimate");
			tasktable.headers["remain"] = $("#tasklist thead .remaining");
			this.context.views["tasktable"] = tasktable;
		}


		pluginManager.prototype.addPlugin = function (Plugin) {
			this.plugins.push(new Plugin(this.context));
		}

		pluginManager.prototype.activatePlugins = function () {
			for (var i = 0; i < this.plugins.length; i++) {
				this.plugins[i].activateShim();
			}
		}

		pluginManager.prototype.deactivatePlugins = function () {
			for (var i = 0; i < this.plugins.length; i++) {
				this.plugins[i].deactivateShim();
			}
		}

		BetterAcunote.PluginManager = new pluginManager();
	}

	window.BetterAcunote = BetterAcunote;

	$(window).on("load", function () {
		BetterAcunote.init();
		BetterAcunote.registerPlugin({
			onActivated: function (context) {
				context.views.navs.wiki.text("ウィキ");
				context.views.navs.sprints.text("スプリント一覧");
				context.views.navs.sprint.text("現在のスプリント");
				context.views.navs.backlog.text("プロダクトバックログ");
				context.views.navs.tasks.text("タスク一覧");
				context.views.navs.timeline.text("タイムライン");

				context.views.toolbar["new task"].val("新規タスク");
				context.views.toolbar.move.val("移動");
				context.views.toolbar.copy.val("コピー");
				context.views.toolbar.delete.val("削除");

				context.views.tasktable.headers.description.text("説明");
				context.views.tasktable.headers.owner.text("所有者");
				context.views.tasktable.headers.status.text("状況");
				context.views.tasktable.headers.priority.text("優先度");
				context.views.tasktable.headers.estimate.text("見積もり");
				context.views.tasktable.headers.remain.text("残り");
			}
		})
		BetterAcunote.activates();
	});

})(window.jQuery);
