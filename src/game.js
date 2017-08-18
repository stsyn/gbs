"use strict";
content.gameLaunchers.push(function() {
	game.UI.currentSpec = world.specs[0];
	utils.changeSpeed(3);
	setTimeout(function() {if (world.currentSpeed == 0) utils.changeSpeed(1)}, 3000);
});

content.gameCreators.push(function() {
	utils.preparePerks();
	game.UI.popups = [];
	game.UI.bottomOffset = 0;
	game.UI.selectedMinistry = 'OIA';
	game.UI.bottomSize = 10;
	
	game.UI.tryReadMessages = function (spec) {
		if (spec != game.UI.currentSpec) return;
		spec.messages.forEach(function (m,i,a){utils.getMessage(m).read = true});
		spec.notifyLevel = -1;
	};
	
	game.UI.generateSpecLine = function (spec) {
		return Inferno.createElement('div', {className:'t2'+(game.UI.currentSpec == spec?' sel':''), onClick:function() {
				game.UI.currentSpec = spec;
				spec.messages.forEach(function (m,i,a){utils.getMessage(m).read = true});
				spec.notifyLevel = -1;
				document.getElementById('specinfo').classList.add('d');
			}},
			Inferno.createElement('div', {className:'t'}, 
				Inferno.createElement('div', {className:'report', style:'background-position: '+(-100*(spec.notifyLevel+1))+'% 0'}, null)
			),
			Inferno.createElement('div', {className:'t'}, 
				Inferno.createElement('div', {className:'level', style:'background-position:'+(spec.stats.level*(-100))+'% 0'}, null)
			),
			Inferno.createElement('div', {className:'t'}, spec.stats.name),
			Inferno.createElement('div', {className:'t c'}, utils.getClassName(spec)),
			Inferno.createElement('div', {className:'t'}, 
				Inferno.createElement('div', {className:'info'}, 
					Inferno.createElement('div', {className:'gender',style:'background-position:'+((spec.stats.gender-1)*(-100))+'% 0'}, null),
					Inferno.createElement('div', {className:'race',style:'background-position:'+((spec.stats.specie)*(-100))+'% 0'}, null)
				)
			),
			Inferno.createElement('div', {className:'t'}, 
				Inferno.createElement('div', {className:'ministry'}, 
					Inferno.createElement('div', {style:'background-position:'+(spec.ministry!=null?-100*world.ministries[spec.ministry].info.iconOffset:0)+'%;background-image:url("'+(spec.ministry!=null?world.ministries[spec.ministry].info.iconUrl:'')+'")'}, null)
				) 
			),
			Inferno.createElement('div', {className:'t'}, 
				Inferno.createElement('div', {className:'task', style:'background-image:url('+content.works[utils.getCurrentWork(spec).id].iconUrl+');background-position: '+(-content.works[utils.getCurrentWork(spec).id].iconOffset*100)+'% 0'}, ' ')
			)
		)
	};
	
	game.UI.writeNotifies = function() {
		//////////////////////////////////////////////////////
		//					Окно уведомлений		
		//////////////////////////////////////////////////////
		
		game.UI.notifiesTempList = [];
		let i = world.lastMessageId % consts.maxNotifies, j;
		if (world.lastMessageId >= consts.maxNotifies) for (j=i; j<consts.maxNotifies; j++) game.UI.notifiesTempList.unshift(world.messages[j])
		for (j=0; j<i; j++) game.UI.notifiesTempList.unshift(world.messages[j])
		game.UI.notifiesList = game.UI.notifiesTempList.map(function (m) {
			let s = '';
			m.containerId.forEach(function (m, i, a) {
				s+=world.specs[m].stats.name;
			});
			return Inferno.createElement('div', {className:'t2'},
				Inferno.createElement('div', {className:'t'}, 
					Inferno.createElement('div', {className:'report', style:'background-position: '+(-100*(m.level+1))+'% 0'}, null)
				),
				Inferno.createElement('div', {className:'t'}, 
					Inferno.createElement('span', {className:'c'}, utils.getTime(m.date)),
					Inferno.createElement('span', {className:'c'}, s),
					m.text
				)
			)
		});
		game.UI.notesContainer = Inferno.createElement('div', {className:'table r ux'}, 
			Inferno.createElement('div', {className:'t3'}, game.UI.notifiesList)
		);
		Inferno.render(game.UI.notesContainer, document.getElementById("news").getElementsByClassName('cc')[0]);
	};
	game.UI.writeNotifies();
});

content.gameCycles.main = function() {
	setTimeout(content.gameCycles.main, 1000/consts.fps);
	game.UI.currentBottomList = world.specs;
	if (game.UI.bottomOffset<0) game.UI.bottomOffset = 0;
	if (parseInt(game.UI.bottomOffset/game.UI.bottomSize)>parseInt((game.UI.currentBottomList.length-1)/game.UI.bottomSize)) game.UI.bottomOffset = parseInt((game.UI.currentBottomList.length-1)/game.UI.bottomSize)*game.UI.bottomSize;
	playerStateUpdate();
	document.querySelector('#top .c').innerHTML = utils.getTime(world.time);
	let dtime = (consts.gameSpeed[world.currentSpeed])/consts.fps;
	world.time += dtime;
	world.dcounter -= dtime;
	
	if (world.dcounter<=0) {
		world.dcounter += utils.time2ms({date:1});
		utils.newDayTick();
	}

	for (let i=0; i<world.specs.length; i++) {
		world.specs[i].counters.main -= (consts.gameSpeed[world.currentSpeed])*world.specs[i].counters.updateMult/consts.fps;
		if (world.specs[i].counters.main <= 0) {
			utils.specTick(world.specs[i]);
			for (let j=0; j<world.ministries[world.specs[i].ministry].specTicks.length; j++)
				world.ministries[world.specs[i].ministry].specTicks[j](world.specs[i]);
		}
	}
	
	world.tasks.forEach(function (item, i, arr) {
		if (item.timeBeforeUpdate != null) {
			item.timeBeforeUpdate -= (consts.gameSpeed[world.currentSpeed])/consts.fps;
			if (item.timeBeforeUpdate <= 0) utils.workTick(item);
		}
	});
	
	//////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////
	//					Нижнее меню			
	//////////////////////////////////////////////////////
	game.UI.bottomList = game.UI.currentBottomList.map(function (spec) {
		return Inferno.createElement('div', {className:'s'},
			Inferno.createElement('img', {className:'p', src:spec.stats.portrait.url}, null),
			Inferno.createElement('div', {className:'task', style:'background-image:url('+content.works[utils.getCurrentWork(spec).id].iconUrl+');background-position: '+(-content.works[utils.getCurrentWork(spec).id].iconOffset*100)+'% 0'}, ' '),
			Inferno.createElement('div', {className:'level', style:'background-position:'+(spec.stats.level*(-100))+'% 0'}, null),
			Inferno.createElement('div', {className:'report', style:'background-position: '+(-100*(spec.notifyLevel+1))+'% 0'}, null),
			Inferno.createElement('div', {className:'n'}, spec.stats.name),
			Inferno.createElement('div', {className:'c'}, utils.getClassName(spec)),
			Inferno.createElement('div', {className:'stat'}, 
				Inferno.createElement('div', {className:'progress', style:'width:'+100*spec.attributes.health/spec.attributes.maxHealth+'%'}, null),
				Inferno.createElement('div', {className:'prof label'}, spec.attributes.health+'/'+spec.attributes.maxHealth)
			)
		)
	});
	game.UI.bottomContainer = Inferno.createElement('div', {className:'container'}, game.UI.bottomList);
	Inferno.render(game.UI.bottomContainer, document.getElementById("bottom"));
	
	//////////////////////////////////////////////////////
	//					Окно специалистов		
	//////////////////////////////////////////////////////
	game.UI.specList = world.specs.map(game.UI.generateSpecLine);
	game.UI.specsContainer = Inferno.createElement('div', {className:'table r ux'}, 
		Inferno.createElement('div', {className:'t3'}, game.UI.specList)
	);
	Inferno.render(game.UI.specsContainer, document.getElementById("specialists").getElementsByClassName('cc')[0]);
	
	
	//////////////////////////////////////////////////////
	//					Окно городов		
	//////////////////////////////////////////////////////
	game.UI.cityList = [];
	for (city in world.cities) {
		game.UI.cityList.push(
			Inferno.createElement('div', {className:'t2'+(game.UI.selectedMinistry == city?' sel':''), onClick:function() {
					game.UI.selectedCity = city;
				}},
				Inferno.createElement('div', {className:'t'}, 
					Inferno.createElement('div', {className:'report', style:'background-position:'+(-100*(world.cities[city].notifyLevel+1))+'%'}, null) 
				),
				Inferno.createElement('div', {className:'t'}, content.cities[city].name),
				Inferno.createElement('div', {className:'t'}, 
					Inferno.createElement('div', {className:'home', style:'background-position:'+(-100*(world.cities[city].notifyLevel+1))+'%'}, null) 
				)
			)
		);
	}
	game.UI.cityContainer = Inferno.createElement('div', {className:'table r ux'}, 
		Inferno.createElement('div', {className:'t3'}, game.UI.cityList)
	);
	Inferno.render(game.UI.cityContainer, document.getElementById("equestria").getElementsByClassName('p14part')[0]);
	
	//////////////////////////////////////////////////////
	//					Окно министерств		
	//////////////////////////////////////////////////////
	game.UI.minsList = consts.ministries.map( function (m) {
		m = world.ministries[m];
		return Inferno.createElement('div', {className:'t2'+(game.UI.selectedMinistry == m.id?' sel':''), onClick:function() {
				game.UI.selectedMinistry = m.id;
			}},
			Inferno.createElement('div', {className:'t'}, 
				Inferno.createElement('div', {className:'ministry'}, 
					Inferno.createElement('div', {style:'background-position:'+(-100*m.info.iconOffset)+'%;background-image:url("'+m.info.iconUrl+'")'}, null)
				) 
			),
			Inferno.createElement('div', {className:'t'}, m.info.name)
		)
	});
	game.UI.minsContainer = Inferno.createElement('div', {className:'table r ux'}, 
		Inferno.createElement('div', {className:'t3'}, game.UI.minsList)
	);
	Inferno.render(game.UI.minsContainer, document.getElementById("ministries").getElementsByClassName('p14part')[0]);
	
	let l_min = world.ministries[game.UI.selectedMinistry];
	game.UI.minSpecList = world.specs.filter(function (spec) {
		return spec.ministry == l_min.id ||  spec.owner == l_min.id;
	});
	game.UI.minSpecDivList = game.UI.minSpecList.map(game.UI.generateSpecLine);
	
	{ game.UI.minProfile = 
			Inferno.createElement('div', {},
				Inferno.createElement('div', {className:'pad sp_top'},
					Inferno.createElement('div', {className:'line nm'}, 
						Inferno.createElement('div', {className:'d'},l_min.info.name)
					),
					(!(l_min.isEnemy || l_min.id == world.playerMinistry)?Inferno.createElement('div', {className:'line linebar'}, 
						Inferno.createElement('div', {className:'p',style:'width:'+l_min.stats.loyalty+'%'}, null),
						Inferno.createElement('div', {className:'d'}, strings.UI.loyalty,
							Inferno.createElement('span', {className:'c'}, l_min.stats.loyalty)
						)
					):null),
					(!(l_min.isCountry || l_min.stats.part == null)?Inferno.createElement('div', {className:'line linebar'}, 
						Inferno.createElement('div', {className:'p',style:'width:'+l_min.stats.part+'%'}, null),
						Inferno.createElement('div', {className:'d'}, strings.UI.part,
							Inferno.createElement('span', {className:'c'}, l_min.stats.part)
						)
					):null),
					(l_min.isCountry?Inferno.createElement('div', {className:'line linebar st_chr'}, 
						Inferno.createElement('div', {className:'p',style:'width:'+l_min.stats.military+'%'}, null),
						Inferno.createElement('div', {className:'d'}, strings.UI.military,
							Inferno.createElement('span', {className:'c'}, l_min.stats.military)
						)
					):null),
					(l_min.isCountry?Inferno.createElement('div', {className:'line linebar st_chr'}, 
						Inferno.createElement('div', {className:'p',style:'width:'+l_min.stats.treat+'%'}, null),
						Inferno.createElement('div', {className:'d'}, strings.UI.treat,
							Inferno.createElement('span', {className:'c'}, l_min.stats.treat)
						)
					):null),
					(l_min.id == world.playerMinistry?Inferno.createElement('div', {className:'line linebar st_chr'}, 
						Inferno.createElement('div', {className:'p',style:'width:'+l_min.stats.money+'%'}, null),
						Inferno.createElement('div', {className:'d'}, strings.UI.money,
							Inferno.createElement('span', {className:'c'}, l_min.stats.money)
						)
					):null)
				),
				Inferno.createElement('div', {className:'pad sp_img'},
					Inferno.createElement('img', {src:l_min.info.bigIconUrl}, null)
				),
				(!l_min.isEnemy?Inferno.createElement('div', {className:'pad sp_inv'},
					Inferno.createElement('div', {className:'table r ux'}, 
						Inferno.createElement('div', {className:'t3'},game.UI.minSpecDivList)
						)
					):null)/*,
				Inferno.createElement('div', {className:'pad sp_info'},
					Inferno.createElement('div', {className:'pad sp_half'}, 
						(game.UI.specPerks.length == 0?strings.UI.noPerks:game.UI.specPerks)
					),
					Inferno.createElement('div', {className:'pad sp_half'},
						l_notice
					)
				)*/
			);
	}
	Inferno.render(game.UI.minProfile, document.getElementById("ministries").getElementsByClassName('p34part')[0]);
	
	
	//////////////////////////////////////////////////////
	//					Личное дело	
	//////////////////////////////////////////////////////
	let l_spec = game.UI.currentSpec;
	game.UI.specPerks = [];
	for (let i=0; i<l_spec.perks.length; i++) {
		if (!l_spec.isPerkExplored[i]) continue;
		game.UI.specPerks.push(Inferno.createElement('div', {className:'line linebar dd'}, 
			Inferno.createElement('div', {className:'d'}, content.perks.c[l_spec.perks[i]].name),
			Inferno.createElement('div', {className:'e'}, content.perks.c[l_spec.perks[i]].description)
		));
	}
	
	game.UI.specNotes = l_spec.messages.map(function (u) {
		let m = utils.getMessage(u);
		return Inferno.createElement('div', {className:'t2'+(m.read?'':' red')},
			Inferno.createElement('div', {className:'t'}, 
				Inferno.createElement('div', {className:'report', style:'background-position: '+(-100*(m.level+1))+'% 0'}, null)
			),
			Inferno.createElement('div', {className:'t'}, 
				Inferno.createElement('span', {className:'c'}, utils.getTime(m.date)),
				m.text
			)
		)
	});
	
	game.UI.hasWorks = false;
	game.UI.specWorks = content.worklists.withSpec.map(function(work) {
		if (work.requiments(l_spec) > 0) {
			game.UI.hasWorks = true;
			let resList = '', cost = work.calcCost(l_spec, l_spec.ministry, l_spec.location);
			if (cost!={}) {
				let unf = '';
				for (let k in cost) {
					if (k == 'text') unf = cost[k];
					else resList+= strings.resources[k]+': '+cost[k]+'\n';
				}
				resList+=unf;
			}
			else resList = 'Не требуются особые затраты';
			
			return Inferno.createElement('div', {className:'line linebar dd b', onClick:function() {
				let specId = 0;
				utils.callPopup({
					id:'work_'+game.UI.currentSpec.stats.experience,
					text:(l_spec.tasks.length==0?strings.UI.messages.work:strings.UI.messages.workBusy)+'\n'+resList,
					buttons:[{
						text: 'OK',
						callback: function() {
							utils.startTask(work, [l_spec.id], l_spec.ministry, l_spec.location);
							utils.closePopup('work_'+game.UI.currentSpec.stats.experience)
						}
					},{
						text: 'Отмена',
						callback: function() {utils.closePopup('work_'+game.UI.currentSpec.stats.experience)}
					}]
				})
			}}, 
				Inferno.createElement('div', {className:'p',style:'width:'+work.requiments(l_spec)+'%'}, null),
				Inferno.createElement('div', {className:'d'}, 
					Inferno.createElement('div', {className:'task', style:'background-image:url('+work.iconUrl+');background-position: '+(-work.iconOffset*100)+'% 0'}, ' '),
					work.name,
					Inferno.createElement('div', {className:'c'}, work.requiments(l_spec)+'%')
				),
				Inferno.createElement('div', {className:'e'},work.description)
			)
		}
		
	});
	
	game.UI.currentWorks = l_spec.tasks.map(function(workId) {
		let task = world.tasks[workId];
		let work = content.works[task.id];
		return Inferno.createElement('div', {className:'line linebar dd b', onClick:function() {
				let popUp = {
					id:'work_stop_'+game.UI.currentSpec.stats.experience,
					text:'Отменить выполнение задания?',
					buttons:[{
						text: 'Снять этого специалиста с задания',
						callback: function() {
							utils.stopTask(task, l_spec, 1);
							utils.closePopup(popUp.id)
						}
					},{
						text: 'Отменить выполнение заданий для всех',
						callback: function() {
							task.workers.forEach(function(w, i, a) {utils.stopTask(task, world.specs[w], 1)});
							utils.closePopup(popUp.id)
						}
					},{
						text: 'Отмена',
						callback: function() {utils.closePopup(popUp.id);}
					}]};
				utils.callPopup(popUp);
			}}, 
			Inferno.createElement('div', {className:'p',style:'width:'+utils.workPercent(task, true, l_spec)+'%'}, null),
			Inferno.createElement('div', {className:'d'}, 
				Inferno.createElement('div', {className:'task', style:'background-image:url('+work.iconUrl+');background-position: '+(-work.iconOffset*100)+'% 0'}, ' '),
				work.name,
				Inferno.createElement('div', {className:'c'}, utils.workPercent(task, false, l_spec))
			),
			Inferno.createElement('div', {className:'e'},work.description)
		)
	});
	if (l_spec.tasks.length == 0) game.UI.currentWorks = Inferno.createElement('span', {}, strings.UI.idle);
	
	l_min = 0;
	let l_notice = strings.UI.notices.allOkay;
	if (l_spec.attributes.workbalance < -consts.workOverflow) {
		l_notice = strings.UI.notices.tooMuchRelax;
	}
	if (l_spec.attributes.worktypeSatisfaction < 0 && l_spec.attributes.worktypeSatisfaction < l_min) {
		l_min = l_spec.attributes.worktypeSatisfaction;
		l_notice = strings.UI.notices.wrongWork;
	}
	if (l_spec.attributes.workSatisfaction < 0 && l_spec.attributes.workSatisfactionMult < l_min) {
		l_min = l_spec.attributes.workSatisfaction;
		l_notice = strings.UI.notices.tooMuchWork;
	}
	if (l_spec.attributes.payoutSatisfaction < 0 && l_spec.attributes.payoutSatisfaction < l_min) {
		l_min = l_spec.attributes.payoutSatisfaction;
		l_notice = strings.UI.notices.lowPay;
	}
	if (l_spec.attributes.health < l_spec.attributes.maxHealth/10) {
		l_notice = strings.UI.notices.lowHealth;
	}
	{ game.UI.specProfile = 
			Inferno.createElement('div', {},
				Inferno.createElement('div', {className:'pad sp_top'},
					Inferno.createElement('div', {className:'line nm'}, 
						Inferno.createElement('div', {className:'d'}, 
							l_spec.stats.name,
							Inferno.createElement('div', {className:'c'}, 
								Inferno.createElement('div', {className:'gender',style:'background-position:'+((l_spec.stats.gender-1)*(-100))+'% 0'}, null),
								Inferno.createElement('div', {className:'race',style:'background-position:'+((l_spec.stats.specie)*(-100))+'% 0'}, null)
							)
						)
					),
					Inferno.createElement('div', {className:'line linebar lv'}, 
						Inferno.createElement('div', {className:'p',style:'width:'+utils.levelPercent(l_spec)+'%'}, null),
						Inferno.createElement('div', {className:'d'}, strings.UI.level,
							Inferno.createElement('span', {className:'c'}, utils.getLevel(l_spec))
						)
					),
					Inferno.createElement('div', {className:'line'}, 
						Inferno.createElement('div', {className:'sp'}, utils.getClassName(l_spec)),
						Inferno.createElement('span', {className:'r'}, utils.getClassName(l_spec))
					),
					Inferno.createElement('div', {className:'line linebar st_str'}, 
						Inferno.createElement('div', {className:'p',style:'width:'+utils.getEndurance(l_spec)*100+'%'}, null),
						Inferno.createElement('div', {className:'d'}, strings.UI.endurance,
							Inferno.createElement('span', {className:'c'}, utils.getActualEndurance(l_spec))
						)
					),
					Inferno.createElement('div', {className:'line linebar st_int'}, 
						Inferno.createElement('div', {className:'p',style:'width:'+utils.getIntellect(l_spec)*100+'%'}, null),
						Inferno.createElement('div', {className:'d'}, strings.UI.intellect,
							Inferno.createElement('span', {className:'c'}, utils.getActualIntellect(l_spec))
						)
					),
					Inferno.createElement('div', {className:'line linebar st_chr'}, 
						Inferno.createElement('div', {className:'p',style:'width:'+utils.getCharisma(l_spec)*100+'%'}, null),
						Inferno.createElement('div', {className:'d'}, strings.UI.charisma,
							Inferno.createElement('span', {className:'c'}, utils.getActualCharisma(l_spec))
						)
					)
				),
				Inferno.createElement('div', {className:'pad sp_img'},
					Inferno.createElement('img', {src:l_spec.stats.portrait.url}, null),
					Inferno.createElement('div', {className:'ministry',style:'background-position:'+(l_spec.ministry!=null?-100*world.ministries[l_spec.ministry].info.iconOffset:0)+'%;'}, null)
				),
				Inferno.createElement('div', {className:'pad sp_info'},
					Inferno.createElement('div', {className:'pad sp_half'}, 
						Inferno.createElement('div', {className:'line linebar st_loy'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+utils.getLoyalty(l_spec)+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.loyalty,
								Inferno.createElement('span', {className:'c'}, utils.getLoyalty(l_spec))
							)
						),
						Inferno.createElement('div', {className:'line linebar st_pyo'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+utils.calcPayoutV(l_spec)+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.payoutLevel,
								Inferno.createElement('span', {className:'c'}, l_spec.attributes.currentPayout)
							)
						),
						Inferno.createElement('div', {className:'line linebar st_stf'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+utils.getSatisfaction(l_spec)+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.satisfaction,
								Inferno.createElement('span', {className:'c'}, utils.getSatisfaction(l_spec))
							)
						)
					),
					Inferno.createElement('div', {className:'pad sp_half'}, 
						Inferno.createElement('div', {className:'line linebar st_inv'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+l_spec.attributes.involvement+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.involvement,
								Inferno.createElement('span', {className:'c'}, l_spec.attributes.involvement)
							)
						),
						Inferno.createElement('div', {className:'line linebar st_opn'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+(100*l_spec.attributes.health/l_spec.attributes.maxHealth)+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.health,
								Inferno.createElement('span', {className:'c'}, l_spec.attributes.health+'/'+l_spec.attributes.maxHealth)
							)
						),
						Inferno.createElement('div', {className:'line linebar st_opn'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+(100-l_spec.attributes.secrecy)+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.secrecy,
								Inferno.createElement('span', {className:'c'}, 100-l_spec.attributes.secrecy)
							)
						)
					)
				),
				Inferno.createElement('div', {className:'pad sp_info'},
					Inferno.createElement('div', {className:'pad sp_half'}, 
						(game.UI.specPerks.length == 0?strings.UI.noPerks:game.UI.specPerks)
					),
					Inferno.createElement('div', {className:'pad sp_half'},
						l_notice,
						Inferno.createElement('div', {className:'pad sp_inv'},
							'Изменить уровень оплаты',
							Inferno.createElement('div', {className:'b', style:'width:16%', onClick:function() {if (l_spec.attributes.currentPayout>100) l_spec.attributes.currentPayout-=100;}},'---'),
							Inferno.createElement('div', {className:'b', style:'width:16%', onClick:function() {if (l_spec.attributes.currentPayout>10) l_spec.attributes.currentPayout-=10;}},'--'),
							Inferno.createElement('div', {className:'b', style:'width:15%', onClick:function() {if (l_spec.attributes.currentPayout>1) l_spec.attributes.currentPayout--;}},'-'),
							Inferno.createElement('div', {className:'b', style:'width:15%', onClick:function() {l_spec.attributes.currentPayout++;}},'+'),
							Inferno.createElement('div', {className:'b', style:'width:16%', onClick:function() {l_spec.attributes.currentPayout+=10;}},'++'),
							Inferno.createElement('div', {className:'b', style:'width:16%', onClick:function() {l_spec.attributes.currentPayout+=100;}},'+++')
						)
					)
				),
				Inferno.createElement('div', {className:'pad sp_info'}, game.UI.currentWorks),
				Inferno.createElement('div', {className:'pad sp_info'}, (game.UI.hasWorks?game.UI.specWorks:strings.UI.noWork)),
				(game.UI.specNotes==0?null:Inferno.createElement('div', {className:'ux pad sp_info table st'}, 
					Inferno.createElement('div', {className:'t3'},game.UI.specNotes)
				))
			);
	}
	Inferno.render(game.UI.specProfile, document.getElementById("specinfo").getElementsByClassName('cc')[0]);
};

function m_init() {
	for (let i=0; i<document.querySelectorAll('#top .ico1').length; i++) {
		if (i!=document.querySelectorAll('#top .ico1').length-1) document.querySelectorAll('#top .ico1')[i].addEventListener('click', function() {utils.changeSpeed(i)});
		else document.querySelectorAll('#top .ico1')[i].classList.add('na');
	}
	
	document.querySelectorAll('#top .menukey')[0].innerHTML = strings.UI.menu;
	document.querySelectorAll('#top .menukey')[1].innerHTML = strings.UI.specs;
	document.querySelectorAll('#top .menukey')[2].innerHTML = strings.UI.map;
	document.querySelectorAll('#top .menukey')[3].innerHTML = strings.UI.ministries;
	document.querySelectorAll('#top .menukey')[4].innerHTML = strings.UI.player;
	document.querySelectorAll('#top .menukey')[5].innerHTML = strings.UI.techs;
	
	document.querySelector('#menu .h').innerHTML = strings.UI.menu;
	document.querySelector('#player .h').innerHTML = strings.UI.player;
	document.querySelector('#specialists .h').innerHTML = strings.UI.specs;
	document.querySelector('#equestria .h').innerHTML = strings.UI.map;
	document.querySelector('#specinfo .h').innerHTML = strings.UI.personal;
	
	document.querySelectorAll('#top .menukey')[0].addEventListener('click', function() {
		game.UI.tspeed = document.querySelectorAll('#top .ico1').length-world.currentSpeed-1;
		utils.changeSpeed(3);
		document.getElementById('menu').classList.add('d');
	});
	document.querySelectorAll('#top .menukey')[1].addEventListener('click', function() {
		if (!document.querySelectorAll('#top .menukey')[1].classList.contains('sel')) {
			document.querySelectorAll('#top .menukey')[1].classList.add('sel');
			document.getElementById('specialists').classList.add('d');
			document.querySelectorAll('#top .menukey')[2].classList.remove('sel');
			document.getElementById('equestria').classList.remove('d');
			document.querySelectorAll('#top .menukey')[3].classList.remove('sel');
			document.getElementById('ministries').classList.remove('d');
		}
		else {
			document.querySelectorAll('#top .menukey')[1].classList.remove('sel');
			document.getElementById('specialists').classList.remove('d');
		}
	});
	document.querySelectorAll('#top .menukey')[2].addEventListener('click', function() {
		if (!document.querySelectorAll('#top .menukey')[2].classList.contains('sel')) {
			document.querySelectorAll('#top .menukey')[2].classList.add('sel');
			document.getElementById('equestria').classList.add('d');
			document.querySelectorAll('#top .menukey')[1].classList.remove('sel');
			document.getElementById('specialists').classList.remove('d');
			document.querySelectorAll('#top .menukey')[3].classList.remove('sel');
			document.getElementById('ministries').classList.remove('d');
		}
		else {
			document.querySelectorAll('#top .menukey')[2].classList.remove('sel');
			document.getElementById('equestria').classList.remove('d');
		}
	});
	document.querySelectorAll('#top .menukey')[3].addEventListener('click', function() {
		if (!document.querySelectorAll('#top .menukey')[3].classList.contains('sel')) {
			document.querySelectorAll('#top .menukey')[3].classList.add('sel');
			document.getElementById('ministries').classList.add('d');
			game.UI.selectedMinistry = 'OIA';
			document.querySelectorAll('#top .menukey')[2].classList.remove('sel');
			document.getElementById('equestria').classList.remove('d');
			document.querySelectorAll('#top .menukey')[1].classList.remove('sel');
			document.getElementById('specialists').classList.remove('d');
		}
		else {
			document.querySelectorAll('#top .menukey')[3].classList.remove('sel');
			document.getElementById('ministries').classList.remove('d');
		}
	});
	document.querySelectorAll('#top .menukey')[4].addEventListener('click', function() {
		if (!document.querySelectorAll('#top .menukey')[4].classList.contains('sel')) {
			document.querySelectorAll('#top .menukey')[4].classList.add('sel');
			document.getElementById('player').classList.add('d');
		}
		else {
			document.querySelectorAll('#top .menukey')[4].classList.remove('sel');
			document.getElementById('player').classList.remove('d');
		}
	});
	
	document.querySelectorAll('#menu .b.fs')[0].addEventListener('click', function() {
		utils.changeSpeed(game.UI.tspeed);
		document.getElementById('menu').classList.remove('d');
	});
	document.querySelectorAll('#menu .b.fs')[1].addEventListener('click', function() {
		utils.saveAndQuit();
	});
	
	document.querySelector('#player .close').addEventListener('click', function() {
		document.querySelectorAll('#top .menukey')[4].classList.remove('sel');
		document.getElementById('player').classList.remove('d');
	});
	document.querySelector('#ministries .close').addEventListener('click', function() {
		document.querySelectorAll('#top .menukey')[3].classList.remove('sel');
		document.getElementById('ministries').classList.remove('d');
	});
	document.querySelector('#equestria .close').addEventListener('click', function() {
		document.querySelectorAll('#top .menukey')[2].classList.remove('sel');
		document.getElementById('equestria').classList.remove('d');
	});
	document.querySelector('#specialists .close').addEventListener('click', function() {
		document.querySelectorAll('#top .menukey')[1].classList.remove('sel');
		document.getElementById('specialists').classList.remove('d');
	});
	document.querySelector('#specinfo .close').addEventListener('click', function() {
		document.getElementById('specinfo').classList.remove('d');
	});
	
}