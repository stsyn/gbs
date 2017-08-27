'use strict';
window.onload = function() {
	setTimeout(init, 500);
}

var m_init;
var m = [];
var gameCycle = "main";

function parseInput() {
	let x = {};
	try {
		//данные закинуты в обычное хранилище
		x = JSON.parse(localStorage._gbs_launchdate);
		x.urlHack = false;
	}
	catch (ex) {
		try {
			//данные закинуты в ссылку
			x = JSON.parse(decodeURI(location.hash.slice(1)));
			x.urlHack = true;
			try {
				//если туда закинули мир
				x.specs.length;
				x = x.config;
				x.urlHack = true;
				x.hasWorld = true;
			}
			catch (ex) {
				//мира там нет
				x.hasWorld = false;
			}
		}
		catch (ex) {
			//сэр, нам пізда
			alert('Failed to load configurations. Click "OK" to start launching in default configuration.');
			x = {};
			x.urlHack = false;
			x.hasWorld = false;
			x.engine = 'def';
			x.content = 'def';
			x.lang = 'ru';
			x.mods = [];
		}
	}
	if (!x.urlHack) {
		try {
			let z = JSON.parse(localStorage._gbs_world).specs.length;
			x.hasWorld = true;
		}
		catch (ex) {
			x.hasWorld = false;
		} 
	}
	//if (x.hasStory) x.mods.push();
	//if (x.hasTutorial) x.mods.push();
	return x;
}

function init() {
	let conf = parseInput();
	var compilations = {
		def:['src/zero.js','src/entities/ministries.js','src/entities/cities.js','src/entities/messages.js','src/entities/world.js','src/entities/perks.js','src/entities/specs.js','src/entities/tasks.js', 'src/player.js', 'src/game.js']
	}
	var contentpacks = {
		def:['src/content/portraits.js','src/content/specs.js','src/content/cities.js','src/content/perks.js','src/content/tasks.js']
	}
	var currentCompilation = conf.engine;
	var currentPack = conf.content;
	var currentLanguage = conf.lang;
	var loaders = [];
	
	m.push('src/utils.js');
	m.push('src/lang/ru.js');
	m.push('src/fontload.js');
	for (let i=0; i<conf.mods.length; i++) {
		if (conf.mods[0] == "") {
			conf.mods.splice(0,1);
			i--;
		}
	}
	m = m.concat(compilations[currentCompilation]);
	m = m.concat(contentpacks[currentPack]);
	m = m.concat(conf.mods);
	if (currentLanguage != 'ru') m.push('src/lang/'+currentLanguage+'.js');
	
	var i = 0;
	var ap, timer;
	var loadingFail = false;
	
	var nx = function() {
		return 0;
	}
	var t = function() {
		clearTimeout(timer);
		ap = true;
		loaders.push(m_init);
		if (!loadingFail) setTimeout(a, 33);
		else m_init();
		m_init = nx;
	}
	var c = function() {
		console.log('Cannot load '+m[i-1]);
		loadingFail = true;
		if (!ap) a();
	}
	var a = function() {
		var s = document.createElement('script');
		s.type = 'text/javascript';
		if (i >= m.length) {
			if (loadingFail) {
				document.querySelector('#popUp .loadtext').innerHTML = '<span style="color:#f00">Some files cannot be loaded right now. They maybe will be loaded later.</span>';
				finish_init(loaders, conf);
			}
			else finish_init(loaders, conf);
			return;
		}
		document.querySelector('#popUp .loadtext').innerHTML = 'Loading '+m[i]+'...';
		document.querySelector('#popUp .loadline').style.width = 100*i/m.length+'%';
		s.src = m[i];
		i++;
		document.head.appendChild(s);
		ap = false;
		s.onload = function() {setTimeout(t, 1)};
		timer = setTimeout(c, 5000);
	}
	m_init = nx;
	a();
}

function finish_init(loaders, c) {
	document.querySelector('#popUp .loadline').style.width = '100%';
	
	var af = function() {
		document.querySelector('#popUp .loadtext').innerHTML = 'Postloading...';
		let i=0;
		let afa = function () {
			loaders[i]();
			document.querySelector('#popUp .loadline').style.width = 100*i/loaders.length+'%';
			if (++i<loaders.length) setTimeout(afa, 10);
			else {
				document.querySelector('#popUp .loadline').style.width = '100%';
				setTimeout(bf, 10);
			}
		};
		setTimeout(afa, 10);
	};
	
	var bf = function() {
		document.querySelector('#popUp .loadtext').innerHTML = 'Launching...';
		let i=0;
		let bfa = function () {
			content.gameCreators[i]();
			document.querySelector('#popUp .loadline').style.width = 100*i/content.gameCreators.length+'%';
			if (++i<content.gameCreators.length) setTimeout(bfa, 10);
			else {
				document.querySelector('#popUp .loadline').style.width = '100%';
				setTimeout(cf, 10);
			}
		}
		setTimeout(bfa, 10);
	};
	
	var cf = function() { 
		if (!c.hasWorld) {
			document.querySelector('#popUp .loadtext').innerHTML = 'Building world...';
			let i=0;
			let cfa = function()  {
				content.worldCreators[i](world);
				document.querySelector('#popUp .loadline').style.width = 100*i/content.worldCreators.length+'%';
				if (++i<content.worldCreators.length) setTimeout(bfa, 10);
				else {
					world.config = c;
					document.querySelector('#popUp .loadline').style.width = '100%';
					setTimeout(df, 10);
				}
			}
			setTimeout(cfa, 10);
		}
		else {
			document.querySelector('#popUp .loadline').style.width = 0;
			document.querySelector('#popUp .loadtext').innerHTML = 'Loading world...';
			if (c.urlHack) {
				world = JSON.parse(decodeURI(location.hash.slice(1)));
				delete world.mods;
				delete world.engine;
				delete world.content;
				delete world.lang;
				delete world.hasWorld;
				delete world.urlHack;
			}
			else {
				world = JSON.parse(localStorage._gbs_world);
			}
			document.querySelector('#popUp .loadline').style.width = '100%';
			setTimeout(df, 10);
		}
	};
	
	var df = function() {
		document.querySelector('#popUp .loadtext').innerHTML = 'Postlaunching...';
		let i=0;
		let dfa = function ()  {
			content.gameLaunchers[i]();
			document.querySelector('#popUp .loadline').style.width = 100*i/content.gameLaunchers.length+'%';
			if (++i<content.gameLaunchers.length) setTimeout(dfa, 10);
			else {
				document.querySelector('#popUp .loadline').style.width = '100%';
				setTimeout(ef, 10);
			}
		}
		setTimeout(dfa, 10);
	};
	
	var ef = function() {
		document.querySelector('#popUp .loadtext').innerHTML = 'Launching...';
		setTimeout(function() {
			document.getElementById('popUp').classList.remove('d');
			document.getElementById('popUp').getElementsByClassName('loadtext')[0].style.display="none";
			content.gameCycles[gameCycle]()},300);
		location.hash = '';
	};
	
	setTimeout(af, 100);
}