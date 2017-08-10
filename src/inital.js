"use strict";
let langList = ['ru'];
let currentLang = 0;
let warned = false;
window.onload = function() {
	let form = document.forms.main;
	form.reset.addEventListener('click', function() {
		if (form.truereset.checked) {
			localStorage.removeItem('_gbs_world');
			localStorage.removeItem('_gbs_launchdate');
			alert('Данные сброшены');
		}
		else alert('Отметьте галочку рядом с кнопкой для подтверждения сброса');
	});
	form.run.addEventListener('click', function() {
		let x = {};
		x.engine = form.engine.value;
		x.content = form.content.value;
		x.hasStory = form.story.checked;
		x.hasTutorial = form.tutorial.checked;
		if (!warned && x.hasStory && x.hasTutorial) {
			alert('Категорически не рекомендуется одновременно включать одновременно обучение и историю!');
			warned = true;
		}
		let y = form.mods.value.trim().split('\n');
		for (let i=0; i<y.length; i++) y[i] = y[i].trim();
		x.mods = y;
		x.lang = langList[currentLang];
		try {
			localStorage._gbs_launchdate = JSON.stringify(x);
		}
		catch(ex) {
			alert('Сохранение параметров запуска невозможно! Для продолжения игры сохраните ссылку, выданную при сохранении внутри игры!');
			document.getElementById('launch').href+='?'+encodeURI(JSON.stringify(x));
			document.getElementById('launch').click();
		}
	});
	
	form.oldrun.addEventListener('click', function() {
		try {
			localStorage._gbs_launchdate.engine;
			document.getElementById('launch').click();
		}
		catch(ex) {
			alert('Не обнаружены сохраненные параметры запуска');
		}
	});
	
	form.sick.addEventListener('change', function() {
		if (form.sick.checked) form.mods.value+='\nsrc/mods/fucken_sick.js';
	});
}