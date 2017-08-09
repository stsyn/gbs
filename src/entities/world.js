'use strict';
function world_proto() {
	this.ministries = {};
	this.specs = [];
	this.tasks = [];
	this.time = 0;
};
var world = new world_proto();
content.worldCreators.push(function(w) {
	w.time = 0;
	w.currentSpeed = 2;
	document.querySelectorAll('#top .ico1')[1].classList.add('sel');
	for (let i=0; i<consts.ministries.length; i++) w.ministries[consts.ministries[i]] = new ministry();
	w.specs.push(new spec(content.presetedSpecs.TS));
	w.specs.push(new spec(content.presetedSpecs.AJ));
	w.specs.push(new spec(content.presetedSpecs.FS));
	w.specs.push(new spec(content.presetedSpecs.RD));
	w.specs.push(new spec(content.presetedSpecs.Rarara));
	w.specs.push(new spec(content.presetedSpecs.PP));
	
	for (let i=0; i<consts.ministries.length; i++) {
		w.ministries[consts.ministries[i]] = {
			id:consts.ministries[i],
			isCountry:false,
			isEnemy:false,
			owner:null,
			specs:[],
			technologies:[],
			
			info:{
				name:strings.ministries.names[consts.ministries[i]],
				iconUrl:strings.ministries.icons[consts.ministries[i]],
				iconOffset:strings.ministries.iconOffsets[consts.ministries[i]],
				bigIconUrl:strings.ministries.bigPictures[consts.ministries[i]],
			},
			
			stats:{
				ratio:0,
				military:0,
				loyalty:0,
				treat:0,
				money:0,
				part:0
			}
		};
	}
	w.ministries.Z.isCountry = true;
	w.ministries.Z.isEnemy = true;
	w.ministries.EQ.isCountry = true;
	w.ministries.OIA.stats.part = null;
	w.playerMinistry = 'OIA';
	
	let tarr = [];
	for (let i=0; i<60; i++) {
		w.specs.push(new spec());
		tarr.push(w.specs.length-1);
	}
	let ministriesPriorities = {};
	ministriesPriorities.MoM = function(spec) {return utils.getActualEndurance(spec)+utils.getActualCharisma(spec)};
	ministriesPriorities.MAS = function(spec) {return utils.getActualIntellect(spec)};
	ministriesPriorities.MI = function(spec) {return utils.getActualCharisma(spec)};
	ministriesPriorities.MoP = function(spec) {return utils.getActualIntellect(spec)+utils.getActualCharisma(spec)};
	ministriesPriorities.MoA = function(spec) {return utils.getActualEndurance(spec)};
	ministriesPriorities.MWT = function(spec) {return utils.getActualEndurance(spec)+utils.getActualIntellect(spec)};
	let currentMinistry = parseInt(Math.random()*6);
	for (let i=0; i<60; i++) {
		let max = 0, id = 0;
		for (let j=0; j<tarr.length; j++) {
				if (max < ministriesPriorities[consts.ministries[currentMinistry+1]](world.specs[tarr[j]])) {
				max = ministriesPriorities[consts.ministries[currentMinistry+1]](world.specs[tarr[j]]);
				id = j;
			}
		}
		utils.spec2ministry(tarr[id], consts.ministries[currentMinistry+1]);
		tarr.splice(id, 1);
		currentMinistry = ++currentMinistry%6;
	}
	game.UI.currentSpec = w.specs[0];
	
	
});
function m_init() {return 0}