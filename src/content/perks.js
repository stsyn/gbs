"use strict";
content.perks.c.p_gb_sys = {
    id:'p_gb_sys',
    name:'',
    description:'',
    secrecy:0,
    whenGet:function(spec) {
		spec.counters.main = consts.gameSpeed[2];
		spec.shadow.loyaltyBonus = 100000;
		spec.shadow.satisfactionBonus = -100000;
		spec.attributes.payout = 0;},
    onTask:function(spec,task) {
		if (world.currentSpeed!=4) spec.data.worldSpeed = world.currentSpeed;
		world.currentSpeed = 4;
	},
	onTaskTick:function(spec) {
		game.UI.currentSpec = spec;
		document.getElementById('blackBack').classList.add('d');
		document.getElementById('specinfo').classList.add('d');
		document.getElementById('specinfo').style.zIndex = 5000;
		document.getElementById('specinfo').childNodes[1].style.zIndex = 6999;
		if (world.currentSpeed!=4) spec.data.worldSpeed = world.currentSpeed;
		world.currentSpeed = 4;
	},
    onIdle:function(spec,task) {
		if (spec.location == world.homecity) {
			world.currentSpeed = spec.data.worldSpeed;
			document.getElementById('blackBack').classList.remove('d');
			document.getElementById('specinfo').style.zIndex = 1;
			document.getElementById('specinfo').childNodes[1].style.zIndex = 1;
		}
	},
	onIdleTick:function(spec) {
	}
};

//////////////////////////////////////////////

content.perks.c.p_hnst = {
    id:'p_hnst',
    name:'Честный',
    description:'',
    secrecy:10,
    whenGet:function(spec) {
        spec.shadow.badTasksMult*=8;
        spec.shadow.loyaltyBonus+=20;
        spec.shadow.payoutSatisfactionMult/=4;
        spec.shadow.payoutLoyaltyMult/=4;
        spec.shadow.workTypeSatisfactionMult*=2;
    },
    onTask:function(spec) {return 0;},
    onIdle:function(spec) {return 0;}
};

content.perks.c.p_dirt = {
    id:'p_dirt',
    name:'Нечистый',
    description:'',
    secrecy:10,
    whenGet:function(spec) {
        spec.shadow.badTasksMult*=0;
        spec.shadow.satisfactionLoyaltyMult*=4;
    },
    onTask:function(spec) {return 0;},
    onIdle:function(spec) {return 0;}
};

content.perks.perkVarPool.push({
    id:'pv_stat',
    chanceCalc: function(world,spec) {return 8;},
    list:['p_hnst', 'p_dirt']
});

//////////////////////////////////////////////

content.perks.c.p_work = {
    id:'p_work',
    name:'Трудоголик',
    description:'',
    secrecy:50,
    whenGet:function(spec) {
        spec.shadow.relaxSatisfactionMult*=-1;
        spec.shadow.workPenaltyMult*=-1;
        spec.shadow.workbalanceMult*=2;
		spec.shadow.maxHealthMult*=0.75;
    },
    onTask:function(spec) {return 0;},
    onIdle:function(spec) {return 0;}
};

content.perks.c.p_lazy = {
    id:'p_lazy',
    name:'Ленивый',
    description:'',
    secrecy:50,
    whenGet:function(spec) {
        spec.shadow.relaxSatisfactionMult*=2;
        spec.shadow.workPenaltyMult*=8;
        spec.shadow.workbalanceMult*=0.5;
    },
    onTask:function(spec) {return 0;},
    onIdle:function(spec) {return 0;}
};

content.perks.c.p_tidy = {
    id:'p_tidy',
    name:'Аккуратный',
    description:'',
    secrecy:50,
    whenGet:function(spec) {
        spec.shadow.failChanceMult *= 0.75;
        spec.shadow.speedMult *= 0.75;},
    onTask:function(spec) {return 0;},
    onIdle:function(spec) {return 0;}
};

content.perks.perkVarPool.push({
    id:'pv_work',
    chanceCalc: function(world,spec) {return 4;},
    list:['p_work', 'p_lazy', 'p_tidy']
});

/////////////////////////////////////////////////

content.perks.c.p_idea = {
    id:'p_idea',
    name:'Идейный',
    description:'',
    secrecy:50,
    whenGet:function(spec) {
        spec.shadow.payoutSatisfactionMult/=10;
        spec.shadow.payoutLoyaltyMult/=10;
    },
    onTask:function(spec) {return 0;},
    onIdle:function(spec) {return 0;}
};

content.perks.c.p_gnus = {
    id:'p_gnus',
    name:'Гений',
    description:'',
    secrecy:75,
    whenGet:function(spec) {
        spec.shadow.charismaMult*=0.75;
        spec.shadow.intellectMult*=1.3;
        spec.shadow.enduranceMult*=0.75;
    },
    onTask:function(spec) {return 0;},
    onIdle:function(spec) {return 0;}
};

content.perks.c.p_art = {
    id:'p_art',
    name:'Артист',
    description:'',
    secrecy:75,
    whenGet:function(spec) {
        spec.shadow.charismaMult*=1.3;
        spec.shadow.intellectMult*=0.75;
        spec.shadow.enduranceMult*=0.75;
    },
    onTask:function(spec) {return 0;},
    onIdle:function(spec) {return 0;}
};

content.perks.c.p_sldr = {
    id:'p_sldr',
    name:'Вояка',
    description:'',
    secrecy:75,
    whenGet:function(spec) {
        spec.shadow.charismaMult*=0.75;
        spec.shadow.intellectMult*=0.75;
        spec.shadow.enduranceMult*=1.3;
    },
    onTask:function(spec) {return 0;},
    onIdle:function(spec) {return 0;}
};

content.perks.c.p_sold = {
    id:'p_sold',
    name:'Продажный',
    description:'',
    secrecy:30,
    whenGet:function(spec) {
        spec.shadow.badTasksMult*=0;
        spec.shadow.payoutLoyaltyMult*=4;
        spec.shadow.payoutSatisfactionMult*=4;
    },
    onTask:function(spec) {return 0;},
    onIdle:function(spec) {return 0;}
};

////////////////////////////////////////////////////

content.perks.c.p_fppl = {
    id:'p_fppl',
    name:'Вечный ученик',
    description:'',
    secrecy:50,
    whenGet:function(spec) {return 0;},
    onTask:function(spec) {
        if (content.works[world.tasks[spec.tasks[0]].id].type.has('study')) spec.stats.experience += 10;
        return 0;
    },
    onIdle:function(spec) {return 0;}
};

content.perks.c.p_mstr = {
    id:'p_mstr',
    name:'Мастер',
    description:'',
    secrecy:50,
    whenGet:function(spec) {
        spec.shadow.charismaMult*=1.2;
        spec.shadow.intellectMult*=1.2;
        spec.shadow.enduranceMult*=1.2;
        spec.shadow.levelUpExpMult*=1.1;
    },
    onTask:function(spec) {
        if (content.works[world.tasks[spec.tasks[0]].id].type.has('study')) spec.stats.experience -= 1;
        //Проверка на задание-обучение
        return 0;
    },
    onIdle:function(spec) {return 0;}
};

content.perks.perkVarPool.push({
    id:'pv_stdy',
    chanceCalc: function(world,spec) {return 12;},
    list:['p_fppl', 'p_mstr']
});

/////////////////////////////////////////////////////

content.perks.c.p_trtr = {
    id:'p_trtr',
    name:'Предатель',
    description:'',
    secrecy:5,
    whenGet:function(spec) {return 0;},
    onTask:function(spec) {
        //Проверки и действия
        return 0;
    },
    onIdle:function(spec) {
        //Проверки и действия
        return 0;
    }
};

content.perks.c.p_plld = {
    id:'p_plld',
    name:'Палладин',
    description:'',
    secrecy:5,
    whenGet:function(spec) {return 0;},
    onTask:function(spec) {
        //Проверки и действия
        return 0;
    },
    onIdle:function(spec) {
        //Проверки и действия
        return 0;
    }
};

content.perks.perkVarPool.push({
    id:'pv_side',
    chanceCalc: function(world,spec) {
		let x = 200/(spec.specie == 4?(world.ministries.EQ.stats.ratio):world.ministries.Z.stats.ratio);
		if (x>50) x = 50;
	},
    list:['p_plld', 'p_trtr']
});

/////////////////////////////////////////////////

content.perks.c.p_prnc = {
    id:'p_prnc',
    name:'Параноик',
    description:'',
    secrecy:5,
	//actions at content.works.w_watching
    whenGet:function(spec) {return 0;},
    onTask:function(spec) {return 0;},
    onIdle:function(spec) {return 0;}
};

content.perks.perkVarPool.push({
    id:'pv_prnc',
    chanceCalc: function(world,spec) {
        let x = 4*(spec.specie == 4?world.ministries.Z.stats.treat:world.ministries.EQ.stats.treat)/100;
		if (x>50) x = 50;
		return x;
    },
    list:['p_prnc']
});

///////////////////////////////////////////////////

content.perks.c.p_runr = {
    id:'p_runr',
    name:'Бежавший',
    description:'',
    secrecy:5,
    whenGet:function(spec) {
		if (Math.random() > 0.5) {
			if (spec.specie == 4) spec.specie = parseInt(Math.random()*3);
			else spec.specie = 4;
		}
		return 0;
	},
    onTask:function(spec) {
        //Проверки и действия
        return 0;
    },
    onIdle:function(spec) {
        //Проверки и действия
        return 0;
    }
};

content.perks.perkVarPool.push({
    id:'pv_runr',
    chanceCalc: function(world,spec) {
        let x = (spec.specie != 4?
            world.ministries.EQ.stats.ratio*world.ministries.Z.stats.military/world.ministries.Z.stats.ratio:
            world.ministries.Z.stats.ratio*world.ministries.EQ.stats.military/world.ministries.EQ.stats.ratio
        )/100;
		if (x>50) x = 50;
    },
    list:['p_runr']
});

////////////////////////////////////////////////////

content.perks.c.p_hero = {
    id:'p_hero',
    name:'Герой',
    description:'',
    secrecy:90,
    whenGet:function(spec) {
        spec.shadow.charismaMult*=1.2;
		return 0;
	},
    onTask:function(spec) {return 0;},
    onIdle:function(spec) {return 0;}
};

content.perks.perkVarPool.push({
    id:'pv_hero',
    chanceCalc: function(world,spec) {
        let x = (spec.specie == 4?world.ministries.Z.stats.military:world.ministries.EQ.stats.military);
		if (x>50) return;
    },
    list:['p_hero']
});

////////////////////////////////////////////////////

content.perks.c.p_drnk = {
    id:'p_drnk',
    name:'Алкоголик',
    description:'',
    secrecy:40,
    whenGet:function(spec) {
		spec.shadow.loyaltyBonus += 20;
	},
    onTask:function(spec) {return 0;},
    onIdle:function(spec) {return 0;},
	onIdleTick:function(spec) {
		if (!utils.ownedByPlayer(spec)) return;
		if (Math.random()<0.005) spec.attributes.health-=1+parseInt(Math.random()*Math.random()*Math.random()*8)
	}
};

content.perks.perkVarPool.push({
    id:'pv_drnk',
    chanceCalc: function(world,spec) {
        return 2*(spec.specie == 4?world.ministries.Z.stats.treat:world.ministries.EQ.stats.treat)/100;
    },
    list:['p_drnk']
});

////////////////////////////////////////////////////

content.perks.c.p_lucky = {
    id:'p_lucky',
    name:'Везунчик',
    description:'',
    secrecy:10,
    whenGet:function(spec) {return 0;},
    onTask:function(spec) {return 0;},
    onIdle:function(spec) {return 0;},
	onIdleTick:function(spec) {return 0;}
};

content.perks.perkVarPool.push({
    id:'pv_lucky',
    chanceCalc: function(world,spec) {
        return 1;
    },
    list:['p_lucky']
});

//////////////////////////////////////////////////

content.perks.perkReplPool.push({
    id:'pr_mstr',
    chanceCalc: function(world,spec) {
        return 10;
    },
    list:['p_mstr'],
	initators:['p_gnus', 'p_art', 'p_sldr']
});

content.perks.perkReplPool.push({
    id:'pr_drnk',
    chanceCalc: function(world,spec) {
        return 15;
    },
    list:['p_drnk'],
	initators:['p_work']
});

content.perks.perkReplPool.push({
    id:'pr_trtrr',
    chanceCalc: function(world,spec) {
        let x = 25*(spec.specie == 4?world.ministries.Z.stats.military:world.ministries.EQ.stats.military)/100;
		if (x>50) x=50;
		return x;
    },
    list:['p_trtr'],
	initators:['p_sold']
});

content.perks.perkReplPool.push({
    id:'pr_trtrs',
    chanceCalc: function(world,spec) {
        return 10;
    },
    list:['p_trtr'],
	initators:['p_sold']
});

//////////////////////////////////////////////////

content.perks.perkExclusions.push({
    id:'px_goodbad',
    lists:[
	['p_hnst', 'p_idea', 'p_plld', 'p_hero'],
    ['p_dirt', 'p_trtr', 'p_sold', 'p_runr']]
});

content.extendedPerksGenerators.push(function(world, spec) {
	if (utils.getIntellect(spec) > 0.9) if (Math.random() > 0.5) return 'p_gnus';
	if (utils.getCharisma(spec) > 0.9) if (Math.random() > 0.5) return 'p_art';
	if (utils.getEndurance(spec) > 0.9) if (Math.random() > 0.5) return 'p_sldr';
	return '';
});