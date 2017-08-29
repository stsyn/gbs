"use strict";
content.presetedSpecs.TS = {
stats:{
    name:'Твайлайт Спаркл',
    charisma: 40,
    intellect: 250,
    endurance: 10, 
    level: 5,
    gender: 2,
    specie: 1,
    portrait: {
        bodyColor: '',
        bodyUrl: '',
        maneColor: '',
        maneUrl: '',
        url: 'res/portraits/1.png'
        }
    },
attributes:{
    loyalty: 70,
    involvement: 95,
    satisfaction: 70,
    secrecy: 50
    },
id:'TS',
ministry: 'MAS', 
owner: 'MAS',
location:'canterlot',
perks: ['p_hnst', 'p_work', 'p_gnus', 'p_tidy', 'p_hero'] 
};


content.presetedSpecs.AJ = {
stats:{
    name:'Эпплджек',
    charisma: 80,
    intellect: 50,
    endurance: 170, 
    level: 5,
    gender: 2,
    specie: 0,
    portrait: {
        bodyColor: '',
        bodyUrl: '',
        maneColor: '',
        maneUrl: '',
        url: 'res/portraits/2.png'
        }
    },
attributes:{
    loyalty: 50,
    involvement: 95,
    satisfaction: 60,
    secrecy: 50
    },
id:'AJ',
ministry: 'MWT',
owner: 'MWT',
location:'canterlot',
perks: ['p_hnst', 'p_work', 'p_mstr', 'p_plld', 'p_hero']
};


content.presetedSpecs.PP = {
stats:{
    name:'Пинки Пай',
    charisma: 130,
    intellect: 40,
    endurance: 130,
    level: 5,
    gender: 2, 
    specie: 0,
    portrait: {
        bodyColor: '',
        bodyUrl: '',
        maneColor: '',
        maneUrl: '',
        url: 'res/portraits/5.png'
        }
    },
attributes:{
    loyalty: 80, 
    involvement: 90,
    satisfaction: 60,
    secrecy: 50
    },
id:'PP',
ministry: 'MoM',
owner: 'MoM',
location:'canterlot',
perks: [ 'p_work','p_mstr','p_plld','p_hero','p_prnc','p_drnk','p_psy']
};


content.presetedSpecs.Rarara = {
stats:{
    name:'Рэрити',
    charisma: 200,
    intellect: 90,
    endurance: 10,
    level: 5,
    gender: 2,
    specie: 1,
    portrait: {
        bodyColor: '',
        bodyUrl: '',
        maneColor: '',
        maneUrl: '',
        url: 'res/portraits/4.png'
        }
    },
attributes:{
    loyalty: 70,
    involvement: 95,
    satisfaction: 70,
    secrecy: 50
    },
id:'Rarara',
ministry: 'MI',
owner: 'MI',
location:'canterlot',
perks: ['p_art', 'p_tidy','p_hero']
};


content.presetedSpecs.FS = {
stats:{
    name:'Флаттершай',
    charisma: 160,
    intellect: 130,
    endurance: 10,
    level: 5,
    gender: 2, 
    specie: 2,
    portrait: {
        bodyColor: '',
        bodyUrl: '',
        maneColor: '',
        maneUrl: '',
        url: 'res/portraits/6.png'
        }
    },
attributes:{
    loyalty: 90, 
    involvement: 85,
    satisfaction: 50,
    secrecy: 50
    },
id:'FS',
ministry: 'MoP',
owner: 'MoP',
location:'canterlot',
perks: [ 'p_work','p_idea','p_hero','p_psy','p_plld']
};


content.presetedSpecs.RD = {
stats:{
    name:'Рейнбоу Дэш',
    charisma: 40,
    intellect: 10,
    endurance: 250,
    level: 5,
    gender: 2, 
    specie: 2,
    portrait: {
        bodyColor: '',
        bodyUrl: '',
        maneColor: '',
        maneUrl: '',
        url: 'res/portraits/3.png'
        }
    },
attributes:{
    loyalty: 100, 
    involvement: 90,
    satisfaction: 70,
    secrecy: 50
    },
id:'RD',
ministry: 'MoA',
owner: 'MoA',
location:'canterlot',
perks: [ 'p_idea','p_sldr','p_mstr','p_plld','p_hero']
};


content.presetedSpecs.HS = {
stats:{
    name:'Доктор Хорс',
    charisma: 80,
    intellect: 200,
    endurance: 20,
    level: 3,
    gender: 1,
    specie: 1,
    portrait: {
        bodyColor: '#F8CD69',
        bodyUrl: '',
        maneColor: '#7C5741',
        maneUrl: '',
        url: ''
        }
    },
attributes:{
    loyalty: 50,
    involvement: 70,
    satisfaction: 60,
    secrecy: 100
    },
id:'s_HS',
ministry: '', // Подумать еще
owner: '',
location:'canterlot',
perks: ['p_gnus','p_mstr','p_trtr']
};


content.presetedSpecs.GB = {
	stats:{
    name:'Голденблад',
    charisma: 85,
    intellect: 208,
    endurance: 7,
    level: 8,
    gender: 1,
    specie: 1,
    portrait: {
		id:'generic_pony_right',
        bodyColor: '#FDFDFD',
        gender: 1,
		horn: 1,
		wings: 0,
        maneColor: '#ffd700',
		mane: 1,
        url: 'res/portraits/0.png'
        }
    },
attributes:{
    loyalty: 100,
    involvement: 100,
    satisfaction: 0,
    secrecy: 0
    },
id:'GB',
ministry: 'OIA',
owner: '',
location:'canterlot',
perks: ['p_gb_sys']
};

content.presetedSpecs.BM = {
stats:{
	id:'s_BM',
    name:'Биг Макинтош',
    charisma: 30,
    intellect: 20,
    endurance: 250,
    level: 4,
    gender: 1,
    specie: 0,
    portrait: {
        bodyColor: '#EF596B',
        bodyUrl: '',
        maneColor: '#F8C075',
        maneUrl: '',
        url: ''
        }
    },
attributes:{
    loyalty: 100,
    involvement: 10,
    satisfaction: 60,
    secrecy: 100
    },
ministry: 'EQ',
owner: 'EQ',
location:'canterlot',
perks: ['p_idea','p_sldr','p_plld','p_hero']
};