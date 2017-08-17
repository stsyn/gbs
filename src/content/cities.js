'use strict',
content.cities.canterlot = {
	id:'canterlot',
	name:'Кантерлот',
	owner:'EQ',
	
	attributesStatic:{
		ponyCountPlus:60,
		ponyCountMult:1,
		ponyCountMax:75,
		powerCountPlus:60,
		powerCountMult:1,
		powerCountMax:100,
		racesEffectiencyMult:[1,1,1,1,0.5]
	},
	tick:function(city) {return 0}
};

content.cities.ponyville = {
	id:'ponyville',
	name:'Понивилль',
	owner:'EQ',
	
	attributesStatic:{
		ponyCountPlus:30,
		ponyCountMult:1,
		ponyCountMax:60,
		powerCountPlus:30,
		powerCountMult:1,
		powerCountMax:100,
		racesEffectiencyMult:[1,1,1,1,1]
	},
	tick:function(city) {return 0}
};

content.cities.manehattan = {
	id:'manehattan',
	name:'Мейнхеттен',
	owner:'EQ',
	
	attributesStatic:{
		ponyCountPlus:150,
		ponyCountMult:1,
		ponyCountMax:200,
		powerCountPlus:100,
		powerCountMult:1.2,
		powerCountMax:200,
		racesEffectiencyMult:[1,1,1,1,1]
	},
	tick:function(city) {return 0}
};

content.cities.cloudsdale = {
	id:'cloudsdale',
	name:'Клаудсдейл',
	owner:'EQ',
	
	attributesStatic:{
		ponyCountPlus:40,
		ponyCountMult:0.8,
		ponyCountMax:80,
		powerCountPlus:100,
		powerCountMult:1,
		powerCountMax:200,
		racesEffectiencyMult:[0,0.1,2,1,0.0]
	},
	tick:function(city) {return 0}
};

content.cities.stalliongrad = {
	id:'stalliongrad',
	name:'Сталлионград',
	owner:'EQ',
	
	attributesStatic:{
		ponyCountPlus:120,
		ponyCountMult:0.6,
		ponyCountMax:180,
		powerCountPlus:140,
		powerCountMult:1.4,
		powerCountMax:200,
		racesEffectiencyMult:[2,0.5,0.5,0.25,1]
	},
	tick:function(city) {return 0}
};

content.cities.fillydelphia = {
	id:'fillydelphia',
	name:'Филлидельфия',
	owner:'EQ',
	
	attributesStatic:{
		ponyCountPlus:150,
		ponyCountMult:1,
		ponyCountMax:200,
		powerCountPlus:100,
		powerCountMult:1.2,
		powerCountMax:200,
		racesEffectiencyMult:[1,1,1,1,1]
	},
	tick:function(city) {return 0}
};

content.cities.hoofington = {
	id:'hoofington',
	name:'Хуффингтон',
	owner:'EQ',
	
	attributesStatic:{
		ponyCountPlus:10,
		ponyCountMult:2,
		powerCountMax:250,
		powerCountPlus:10,
		powerCountMult:2,
		powerCountMax:300,
		racesEffectiencyMult:[1,1,1,1,1]
	},
	tick:function(city) {return 0}
};

content.cities.roam = {
	id:'roam',
	name:'Роам',
	owner:'Z',
	
	attributesStatic:{
		ponyCountPlus:10,
		ponyCountMult:2,
		powerCountMax:250,
		powerCountPlus:10,
		powerCountMult:2,
		powerCountMax:300,
		racesEffectiencyMult:[0.8,0.8,0.8,1,1.2]
	},
	tick:function(city) {return 0}
};
