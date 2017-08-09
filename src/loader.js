'use strict';
window.onload = function() {
	setTimeout(init, 500);
}

var m_init;
var m = [];
var gameCycle = "main";

function init() {
	var compilations = {
		def:['src/zero.js','src/entities/ministries.js','src/entities/world.js','src/entities/perks.js','src/entities/specs.js','src/entities/tasks.js', 'src/player.js', 'src/game.js']
	}
	var contentpacks = {
		def:['src/content/specs.js','src/content/perks.js','src/content/tasks.js']
	}
	var currentCompilation = 'def';
	var currentPack = 'def';
	var currentLanguage = 'ru';
	var loaders = [];
	
	m.push('src/utils.js');
	m.push('src/lang/ru.js');
	m.push('src/fontload.js');
	m = m.concat(compilations[currentCompilation]);
	m = m.concat(contentpacks[currentPack]);
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
				finish_init(loaders);
			}
			else finish_init(loaders);
			return;
		}
		document.querySelector('#popUp .loadtext').innerHTML = 'Loading '+m[i]+'...';
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

function finish_init(loaders) {
	document.querySelector('#popUp .loadtext').innerHTML = 'Postloading...';
	for (let i=0; i<loaders.length; i++) loaders[i]();
	document.querySelector('#popUp .loadtext').innerHTML = 'Launching...';
	for (let i=0; i<content.gameCreators.length; i++) content.gameCreators[i]();
	document.querySelector('#popUp .loadtext').innerHTML = 'Building world...';
	for (let i=0; i<content.worldCreators.length; i++) content.worldCreators[i](world);
	document.querySelector('#popUp .loadtext').innerHTML = 'Launching...';
	setTimeout(function() {
		document.getElementById('popUp').style.display = 'none';
		content.gameCycles[gameCycle]()},300);
}