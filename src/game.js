"use strict";
content.gameLaunchers.push(function() {
	game.UI.currentSpec = world.specs[0];
	utils.changeSpeed(3);
	setTimeout(function() {if (world.currentSpeed == 0) utils.changeSpeed(1)}, 5000);
	
	game.player.ministry = world.ministries.OIA;
	game.player.resources.money = world.ministries.OIA.money;
	game.player.specs = [];
	if (world.time == 0) utils.newDayTick();
	if (world.specs[0].tasks.length > 0) content.perks.c.p_gb_sys.onTask();
});

content.gameCreators.push(function() {
	utils.preparePerks();
	
	game.UI.popups = [];
	game.UI.selectedMinistry = 'OIA';
	game.UI.selectedCity = 'canterlot';
	game.UI.bottomRenderCounter = 0;
	game.UI.bottomSelectionMode = 'view';
	
	game.UI.bottomSelection = {};
	game.UI.bottomSelection.view = function (spec) {
		game.UI.currentSpec = spec;
		spec.messages.forEach(function (m,i,a){utils.getMessage(m).read = true});
		spec.notifyLevel = -1;
		document.getElementById('specinfo').classList.add('d');
	};
	game.UI.bottomSelection.addToTask = function (spec) {
		let task = game.UI.taskHandling;
		let work = content.works[task.id];
		if (task.hasStarted && work.unstoppable) return;
		
		if (work.requiments(spec, task.ministry, task.location) <= 0) return;
		else {
			//if (work.maxWorkers!=0) return;
			for (let i=0; i<task.workers.length; i++) if (task.workers[i] == spec.id) {
				let popUp = {
					text: strings.UI.messages.stopSolo,
					buttons:[{
						text: strings.UI.messages.removeSpecFromTask,
						callback: function() {
							utils.stopTask(task, spec, 1);
							utils.closePopup()
						}
					},{
						text: strings.UI.messages.cancel,
						callback: function() {utils.closePopup();}
					}]};
				utils.callPopup(popUp);
				return;
			}
			for (let i=0; i<game.UI.taskAddedWorkers.length; i++) if (game.UI.taskAddedWorkers[i] == spec.id) {
				if (!(i<=game.UI.taskDontRemove))
				game.UI.taskAddedWorkers.splice(i, 1);
				return;
			}
			if (((task.workers.length+game.UI.taskAddedWorkers.length)<work.maxWorkers) || work.maxWorkers==-1)
				game.UI.taskAddedWorkers.push(spec.id);
		}
	};
	
	
	game.UI.bottomSelectionView = {};
	game.UI.bottomSelectionView.view = function (spec) {
		return Inferno.createElement('div', {className:'stat'},
			Inferno.createElement('div', {className:'progress', style:'width:'+100*spec.attributes.health/spec.attributes.maxHealth+'%'}, null),
			Inferno.createElement('div', {className:'prof label'}, parseInt(spec.attributes.health)+'/'+spec.attributes.maxHealth)
		)
	};
	game.UI.bottomSelectionView.addToTask = function (spec) {
		let task = game.UI.taskHandling;
		let work = content.works[task.id];
		let t = work.requiments(spec, task.ministry, task.location);
		return Inferno.createElement('div', {className:'stat'},
			Inferno.createElement('div', {className:'progress', style:'width:'+t+'%'}, null),
			Inferno.createElement('div', {className:'prof label'}, parseInt(t)+'%')
		)
	};
	
	game.UI.tryReadMessages = function (spec) {
		if (spec != game.UI.currentSpec) return;
		spec.messages.forEach(function (m,i,a){utils.getMessage(m).read = true});
		spec.notifyLevel = -1;
	};
	
	game.UI.generateSpecLine = function (spec) {
		if (utils.getSpecSecrecy(spec)>consts.visibility[0]) return;
		return Inferno.createElement('div', {className:'t2'+((game.UI.currentSpec == spec)&&(document.getElementById("specinfo").classList.contains('d'))?' sel':''), onClick:function() {
				game.UI.currentSpec = spec;
				spec.messages.forEach(function (m,i,a){utils.getMessage(m).read = true});
				spec.notifyLevel = -1;
				document.getElementById('specinfo').classList.add('d');
			}},
			Inferno.createElement('div', {className:'t'}, 
				Inferno.createElement('div', {className:'report', style:'background-position: '+(-100*(spec.notifyLevel+1))+'% 0'}, null)
			),
			Inferno.createElement('div', {className:'t'}, 
				(utils.getSpecSecrecy(spec)<93)?Inferno.createElement('div', {className:'level', style:'background-position:'+(spec.stats.level*(-100))+'% 0'}, null):null
			),
			Inferno.createElement('div', {className:'t'}, (utils.getSpecSecrecy(spec)>=93)?'???':spec.stats.name),
			Inferno.createElement('div', {className:'t c'}, (utils.getSpecSecrecy(spec)>=93)?'???':utils.getClassName(spec)),
			Inferno.createElement('div', {className:'t'}, 
				(utils.getSpecSecrecy(spec)<consts.visibility[1]?Inferno.createElement('div', {className:'info'}, 
					Inferno.createElement('div', {className:'gender',style:'background-position:'+((spec.stats.gender-1)*(-100))+'% 0'}, null),
					Inferno.createElement('div', {className:'race',style:'background-position:'+((spec.stats.specie)*(-100))+'% 0'}, null)
				):null)
			),
			Inferno.createElement('div', {className:'t'}, 
				Inferno.createElement('div', {className:'ministry'}, 
					Inferno.createElement('div', {style:'background-position:'+(spec.ministry!=null?-100*world.ministries[spec.ministry].info.iconOffset:0)+'%;background-image:url("'+(spec.ministry!=null?world.ministries[spec.ministry].info.iconUrl:'')+'")'}, null)
				) 
			),
			Inferno.createElement('div', {className:'t'}, 
				(utils.ownedByPlayer(spec)?Inferno.createElement('div', {className:'task', style:'background-image:url('+content.works[utils.getCurrentWork(spec).id].iconUrl+');background-position: '+(-content.works[utils.getCurrentWork(spec).id].iconOffset*100)+'% 0'}, ' '):null)
			)
		)
	};
	
	game.UI.generateSpecCard = function (spec, mode) {
		let image;
		if (spec.stats.portrait.url != '' && spec.stats.portrait.url != undefined) image = Inferno.createElement('img', {className:'p', src:spec.stats.portrait.url}, null);
		else image = content.portraits[spec.stats.portrait.id].func(spec, 'p color');
		return Inferno.createElement('div', {className:'s', onClick:(game.UI.bottomSelection[mode]!=undefined?function(){game.UI.bottomSelection[mode](spec)}:function(){return 0})},
			image,
			Inferno.createElement('div', {className:'task', style:'background-image:url('+content.works[utils.getCurrentWork(spec).id].iconUrl+');background-position: '+(-content.works[utils.getCurrentWork(spec).id].iconOffset*100)+'% 0'}, ' '),
			Inferno.createElement('div', {className:'level', style:'background-position:'+(spec.stats.level*(-100))+'% 0'}, null),
			Inferno.createElement('div', {className:'report', style:'background-position: '+(-100*(spec.notifyLevel+1))+'% 0'}, null),
			Inferno.createElement('div', {className:'n'}, spec.stats.name),
			Inferno.createElement('div', {className:'c'}, utils.getClassName(spec)),
			game.UI.bottomSelectionView[mode](spec)
		)
	};
	
	//////////////////////////////////////////////////////
	//					Окно уведомлений		
	//////////////////////////////////////////////////////
	
	game.UI.writeNotifies = function() {
		
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
					' ',
					Inferno.createElement('span', {className:'c'}, s),
					' ',
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
	if (world.currentSpeed == undefined) world.currentSpeed = 2;
	setTimeout(content.gameCycles.main, 1000/consts.fps);
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
			for (let j=0; j<content.ministrySpecTicks[world.specs[i].ministry].length; j++)
				content.ministrySpecTicks[world.specs[i].ministry][j](world.specs[i]);
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
	
	if (game.UI.bottomRenderCounter <= 0) {
		game.UI.bottomRenderCounter = 60;
		if (game.UI.bottomSelectionMode == 'view') {
			utils.sortSpecList('OIA', game.player.specs, 'priorityOIA');
		}
		game.UI.bottomList = game.player.specs.map(function(spec) {return game.UI.generateSpecCard(spec, game.UI.bottomSelectionMode)});
		game.UI.bottomContainer = Inferno.createElement('div', {className:'container speccardcontainer'}, game.UI.bottomList);
		Inferno.render(game.UI.bottomContainer, document.getElementById("bottom"));
	}
	game.UI.bottomRenderCounter--; 
	
	//////////////////////////////////////////////////////
	//					Окно специалистов		
	//////////////////////////////////////////////////////
	
	if (document.getElementById("specialists").classList.contains('d')) {
		game.UI.specList = game.player.specs.map(game.UI.generateSpecLine);
		game.UI.specsContainer = Inferno.createElement('div', {className:'table r ux'}, 
			Inferno.createElement('div', {className:'t3'}, game.UI.specList)
		);
		Inferno.render(game.UI.specsContainer, document.getElementById("specialists").getElementsByClassName('cc')[0]);
	}
	
	//////////////////////////////////////////////////////
	//				Окно выдачи заданий		
	//////////////////////////////////////////////////////
	
	if (document.getElementById("selectSpecs").classList.contains('d')) {
		let task = game.UI.taskHandling;
		let work = content.works[task.id];
		let c_city = content.cities[task.location];
		if (task.value>=task.target && task.target>0) {
			document.getElementById("selectSpecs").classList.remove('d');
			game.UI.bottomSelectionMode = 'view';
			game.UI.bottomRenderCounter = 0;
		};
		
		let workersContainer = [];
		for (let i=0; i<task.workers.length; i++) {
			workersContainer.push(game.UI.generateSpecCard(world.specs[task.workers[i]], 'addToTask'));
		}
		
		let selectedContainer = [];
		for (let i=0; i<game.UI.taskAddedWorkers.length; i++) {
			selectedContainer.push(game.UI.generateSpecCard(world.specs[game.UI.taskAddedWorkers[i]], 'addToTask'));
		}
		let tlist = task.workers.concat(game.UI.taskAddedWorkers);
		
		let reslist = [];
		let cost, payable = true;
		if (task.internalId == undefined && tlist.length>=work.minWorkers) {
			cost = work.calcCost(tlist, task.ministry, task.location);
			for (let res in cost) {
				if (res == 'text') continue;
				let w = game.player.resources[res].value*100/cost[res];
				if (game.player.resources[k].value<cost[k]) payable = false;
				if (w>100) w = 100;
				reslist.push(Inferno.createElement('div', {className:'line linebar'},
					Inferno.createElement('div', {className:'p',style:'width:'+w+'%'}, null),
					Inferno.createElement('div', {className:'d'}, strings.resources[res],
						Inferno.createElement('div', {className:'c'}, parseInt(cost[res]))
					)
				));
			}
			if (cost.text != undefined) reslist.push(cost.text);
		}
		
		{game.UI.taskContainer = 
		Inferno.createElement('div', {},
			Inferno.createElement('div', {className:'pad sp_info'},
				Inferno.createElement('div', {className:'line'}, 
					Inferno.createElement('div', {className:'d', style:'text-align:center;font-size:120%'}, 
						(task.internalId == undefined)?'Создать задание '+work.name:'Изменить задание №'+task.internalId+' ('+work.name+')'
					)
				),
				'Необходимо специалистов: ',
				work.minWorkers,
				Inferno.createElement('br',{},null),
				'Максимум специалистов: ',
				(work.maxWorkers==-1?'Неограничено':work.maxWorkers),
				Inferno.createElement('br',{},null),
				'Потребуется:',
				Inferno.createElement('br',{},null),
				reslist,
				Inferno.createElement('br',{},null),
				(payable?'':strings.UI.messages.notEnoughRes),
				Inferno.createElement('br',{},null),
				(task.internalId != undefined?Inferno.createElement('div', {className:'line linebar'},
					Inferno.createElement('div', {className:'p',style:'width:'+utils.workPercent(task, true)+'%'}, null),
					Inferno.createElement('div', {className:'d'}, work.name,
						Inferno.createElement('div', {className:'c'}, utils.workPercent(task, false))
					)
				):null),
				(tlist.length>=work.minWorkers?Inferno.createElement('div', {className:'line linebar'},
					Inferno.createElement('div', {className:'p',style:'width:'+work.massRequiments(tlist, task.ministry, task.location, task.targetSpec)+'%'}, null),
					Inferno.createElement('div', {className:'d'}, 'Эффективность',
						Inferno.createElement('div', {className:'c'}, parseInt(work.massRequiments(tlist, task.ministry, task.location, task.targetSpec))+'%')
					)
				):null)
			),
			(workersContainer.length!=0?Inferno.createElement('div', {className:'pad sp_info speccardcontainer'},
				workersContainer
			):null),
			(selectedContainer.length!=0?Inferno.createElement('div', {className:'pad sp_info speccardcontainer'},
				selectedContainer
			):'Не выбраны дополнительные специалисты'),
			((tlist.length>=work.minWorkers) && payable && (task.internalId == undefined) && (work.massRequiments(tlist, task.ministry, task.location, task.targetSpec)>0)?
				Inferno.createElement('div', {className:'b fs', onClick:function() {
					utils.startTask(work, game.UI.taskAddedWorkers, task.ministry, task.targetSpec, task.location);
					utils.closeTaskWindow();
				}}, 'Начать выполнение')
			:null),
			((!((work.unstoppable) && (task.hasStarted)) || !task.hasStarted) && (game.UI.taskAddedWorkers.length>0) && (task.internalId != undefined)) && (work.massRequiments(tlist, task.ministry, task.location, task.targetSpec)>0?
				Inferno.createElement('div', {className:'b fs', onClick:function() {
					utils.startTask(content.works.w_sys_companyHandler, game.UI.taskAddedWorkers, task.ministry, task.targetSpec, task.location);
					console.log(world.tasks);
					for (let i=0; i<world.tasks.length; i++) {
						if (world.tasks[i] == undefined) continue;
						if (world.tasks[i].id != 'w_sys_companyHandler') continue;
						if (world.tasks[i].data.taskId == undefined) {
							world.tasks[i].data.taskId = task.internalId;
							break;
						};
					}
					utils.closeTaskWindow();
				}}, 'Добавить специалистов на задание')
			:null),
			(!((work.unstoppable) && (task.hasStarted)) && (task.internalId != undefined)?
				Inferno.createElement('div', {className:'b fs', onClick:function() {
					let popUp = {
						text: strings.UI.messages.stop,
						buttons:[{
							text: strings.UI.messages.removeAllSpecsFromTask,
							callback: function() {
								task.workers.forEach(function(w, i, a) {utils.stopTask(task, world.specs[w], 1)});
								utils.closePopup()
							}
						},{
							text: strings.UI.messages.cancel,
							callback: function() {utils.closePopup();}
						}]};
					utils.callPopup(popUp);
				}}, 'Отменить задание')
			:null),
			Inferno.createElement('div', {className:'b fs', onClick:function() {
				if (game.UI.taskBackHandlerType == 'none') {
					utils.closeTaskWindow();
				}
				else if (game.UI.taskBackHandlerType == 'recreate') {
					utils.closeTaskWindow();
					utils.prepareTaskWindow(task.id, task.location, task.ministry);
				}
			}}, strings.UI.messages.cancel)
		);}
		
		Inferno.render(game.UI.taskContainer, document.getElementById("selectSpecs").getElementsByClassName('cc')[0]);
	}
	
		
	//////////////////////////////////////////////////////
	//					Окно городов		
	//////////////////////////////////////////////////////
	
	if (document.getElementById("equestria").classList.contains('d')) {
		game.UI.cityList = [];
		for (let city in world.cities) {
			let x = city;
			game.UI.cityList.push(
				Inferno.createElement('div', {className:'t2'+(game.UI.selectedCity == city?' sel':''), onClick:function() {
						game.UI.selectedCity = x;
					}},
					Inferno.createElement('div', {className:'t', style:'width: 8%;text-align: center'}, 
						Inferno.createElement('div', {className:'ministry'}, 
							Inferno.createElement('div', {style:'background-position:'+(-100*world.ministries[world.cities[city].owner].info.iconOffset)+'%;background-image:url("'+world.ministries[world.cities[city].owner].info.iconUrl+'")'}, null)
						) 
					),
					Inferno.createElement('div', {className:'t'}, 
						Inferno.createElement('div', {className:'report', style:'background-position:'+(-100*(world.cities[city].notifyLevel+1))+'%'}, null) 
					),
					Inferno.createElement('div', {className:'t'}, content.cities[city].name),
					Inferno.createElement('div', {className:'t'}, 
						Inferno.createElement('div', {className:'home', style:'background-position:'+(0)+'%'}, null) 
					)
				)
			);
		}
		game.UI.cityContainer = Inferno.createElement('div', {className:'table r ux'}, 
			Inferno.createElement('div', {className:'t3'}, game.UI.cityList)
		);
		Inferno.render(game.UI.cityContainer, document.getElementById("equestria").getElementsByClassName('p14part')[0]);
		
		let l_city = world.cities[game.UI.selectedCity];
		let c_city = content.cities[game.UI.selectedCity];
		game.UI.specsInCity = world.specs.filter(function(spec) {
			return (!(utils.getSpecSecrecy(spec)>=consts.visibility[3] && !utils.ownedByPlayer(spec)) && (spec.location == game.UI.selectedCity))
		});
		
		game.UI.specsInCityList = game.UI.specsInCity.map(game.UI.generateSpecLine);
		
		game.UI.ministriesInCity = [];
		for (let m in l_city.ministriesPart) game.UI.ministriesInCity.push(
			Inferno.createElement('div', {className:'line linebar'}, 
				Inferno.createElement('div', {className:'p',style:'width:'+((l_city.ministriesDisplayPart[m]>100)?100:l_city.ministriesDisplayPart[m])+'%'}, null),
				Inferno.createElement('div', {className:'d'}, world.ministries[m].info.name,
					Inferno.createElement('span', {className:'c'}, parseInt(l_city.ministriesPart[m])+' ('+parseInt(l_city.ministriesDisplayPart[m])+'%)')
				)
			)
		);
		
			
		game.UI.hasCityWorks = false;
		game.UI.cityWorks = content.worklists.perCity.map(function(work) {
			game.UI.hasCityWorks = true;
			
			return Inferno.createElement('div', {className:'line linebar dd b', onClick:function() {
				utils.prepareTaskWindow(work, l_city.id, game.player.ministry.id);
			}}, 
				Inferno.createElement('div', {className:'d'}, 
					Inferno.createElement('div', {className:'task', style:'background-image:url('+work.iconUrl+');background-position: '+(-work.iconOffset*100)+'% 0'}, ' '),
					work.name
				),
				Inferno.createElement('div', {className:'e'},work.description)
			)
		});
		
		game.UI.citySpecDivList = game.UI.specsInCity.map(game.UI.generateSpecLine);
		{ 
			game.UI.cityProfile = 
				Inferno.createElement('div', {},
					(l_city.owner=='EQ'?Inferno.createElement('div', {className:'pad sp_info'},
						Inferno.createElement('div', {className:'line nm'}, 
							Inferno.createElement('div', {className:'d'},c_city.name)
						),
						Inferno.createElement('div', {className:'line linebar'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+parseInt(100*l_city.attributes.ponyCount/l_city.attributes.ponyCountMax)+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.ponyCount,
								Inferno.createElement('span', {className:'c'}, parseInt(l_city.attributes.ponyCount))
							)
						),
						Inferno.createElement('div', {className:'line linebar'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+l_city.attributes.ratio+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.ratio,
								Inferno.createElement('span', {className:'c'}, parseInt(l_city.attributes.ratio))
							)
						),
						Inferno.createElement('div', {className:'line linebar'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+100*utils.getCityMilitary(l_city)+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.militaryPower,
								Inferno.createElement('span', {className:'c'}, utils.getCityActualMilitary(l_city))
							)
						),
						Inferno.createElement('div', {className:'line linebar'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+100*utils.getCityIndustrial(l_city)+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.industrialPower,
								Inferno.createElement('span', {className:'c'}, utils.getCityActualIndustrial(l_city))
							)
						),
						Inferno.createElement('div', {className:'line linebar'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+100*utils.getCityTech(l_city)+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.techPower,
								Inferno.createElement('span', {className:'c'}, utils.getCityActualTech(l_city))
							)
						)
					):null),
					(game.UI.hasCityWorks?Inferno.createElement('div', {className:'pad sp_info'},
						game.UI.cityWorks
					):null),
					Inferno.createElement('div', {className:'pad sp_inv'},
						Inferno.createElement('div', {className:'table r ux'}, 
							Inferno.createElement('div', {className:'t3'},game.UI.ministriesInCity)
						)
					),
					Inferno.createElement('div', {className:'pad sp_inv'},
						Inferno.createElement('div', {className:'table r ux'}, 
							Inferno.createElement('div', {className:'t3'},game.UI.specsInCityList)
						)
					)
				);
			}
		Inferno.render(game.UI.cityProfile, document.getElementById("equestria").getElementsByClassName('p34part')[0]);
	}
	
	
	//////////////////////////////////////////////////////
	//					Окно министерств		
	//////////////////////////////////////////////////////
	
	if (document.getElementById("ministries").classList.contains('d')) { 
		game.UI.minsList = consts.ministries.map( function (m) {
			m = world.ministries[m];
			return Inferno.createElement('div', {className:'t2'+(game.UI.selectedMinistry == m.id?' sel':''), onClick:function() {
					game.UI.selectedMinistry = m.id;
				}},
				Inferno.createElement('div', {className:'t', style:'width: 8%;text-align: center'}, 
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
		game.UI.minSpecList = l_min.specs.map(function (spec) {
			return world.specs[spec];
		});
		game.UI.minSpecDivList = game.UI.minSpecList.map(game.UI.generateSpecLine);
		
		game.UI.resources = [];
		if (l_min == game.player.ministry) {
			for (let r in game.player.resources) {
				game.UI.resources.push(Inferno.createElement('div', {className:'line linebar'}, 
					Inferno.createElement('div', {className:'d'}, strings.resources[r],
						Inferno.createElement('span', {className:'c'}, parseInt(game.player.resources[r].value))
					)
				));
			}
		}
		
		{ game.UI.minProfile = 
				Inferno.createElement('div', {},
					Inferno.createElement('div', {className:'pad sp_top'},
						Inferno.createElement('div', {className:'line nm'}, 
							Inferno.createElement('div', {className:'d'},l_min.info.name)
						),
						(!(l_min.id == world.playerMinistry)?Inferno.createElement('div', {className:'line linebar'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+l_min.stats.loyalty+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.loyalty,
								Inferno.createElement('span', {className:'c'}, parseInt(l_min.stats.loyalty))
							)
						):null),
						(!(l_min.isCountry || l_min.stats.part == null)?Inferno.createElement('div', {className:'line linebar'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+l_min.stats.part+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.part,
								Inferno.createElement('span', {className:'c'}, parseInt(l_min.stats.part))
							)
						):null),
						(!(l_min.isCountry || l_min.stats.part == null)?Inferno.createElement('div', {className:'line linebar'}, 
							Inferno.createElement('div', {className:'d'}, strings.UI.tpart,
								Inferno.createElement('span', {className:'c'}, parseInt(l_min.stats.tpart))
							)
						):null),
						(l_min.isCountry?Inferno.createElement('div', {className:'line linebar st_chr'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+l_min.stats.military+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.military,
								Inferno.createElement('span', {className:'c'}, parseInt(l_min.stats.military))
							)
						):null),
						(l_min.isCountry?Inferno.createElement('div', {className:'line linebar st_chr'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+l_min.stats.treat+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.treat,
								Inferno.createElement('span', {className:'c'}, parseInt(l_min.stats.treat))
							)
						):null),
						game.UI.resources
					),
					Inferno.createElement('div', {className:'pad sp_img'},
						Inferno.createElement('img', {src:l_min.info.bigIconUrl}, null)
					),
					(!l_min.isEnemy?Inferno.createElement('div', {className:'pad sp_inv'},
						Inferno.createElement('div', {className:'table r ux'}, 
							Inferno.createElement('div', {className:'t3'},game.UI.minSpecDivList)
							)
						):null)
				);
		}
		Inferno.render(game.UI.minProfile, document.getElementById("ministries").getElementsByClassName('p34part')[0]);
	}
	
	
	//////////////////////////////////////////////////////
	//					Личное дело	
	//////////////////////////////////////////////////////
	
	if (document.getElementById("specinfo").classList.contains('d')) {
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
					' ',
					m.text
				)
			)
		});
		
		game.UI.hasWorks = false;
		game.UI.specWorks = content.worklists.withSpec.map(function(work) {
			if (work.requiments(l_spec, l_spec.ministry, l_spec.location) > 0) {
				game.UI.hasWorks = true;
				let resList = '', cost = work.calcCost([l_spec.id], l_spec.ministry, l_spec.location);
				let payable=true;
				if (cost!={}) {
					let unf = '';
					for (let k in cost) {
						if (k == 'text') unf = cost[k];
						else {
							resList+= strings.resources[k]+': '+parseInt(cost[k])+' ('+strings.UI.messages.resHave+parseInt(game.player.resources[k].value)+')\n';
							if (game.player.resources[k].value<cost[k]) payable = false;
						}
					}
					resList+=unf;
				}
				else resList = strings.UI.messages.freeTask;
				
				return Inferno.createElement('div', {className:'line linebar dd b', onClick:function() {
					let specId = 0;
					utils.callPopup({
						text:(l_spec.tasks.length==0?strings.UI.messages.work:strings.UI.messages.workBusy)+'\n'+resList,
						buttons:[{
							text: (payable?strings.UI.messages.ok:strings.UI.messages.notEnoughRes),
							callback: (payable?function() {
								utils.startTask(work, [l_spec.id], l_spec.ministry, undefined, world.homecity);
								utils.closePopup()
							}:function(){return 0})
						},{
							text: 'Отмена',
							callback: function() {utils.closePopup('work_'+game.UI.currentSpec.stats.experience)}
						}]
					})
				}}, 
					Inferno.createElement('div', {className:'p',style:'width:'+work.requiments(l_spec, l_spec.ministry, l_spec.location)+'%'}, null),
					Inferno.createElement('div', {className:'d'}, 
						Inferno.createElement('div', {className:'task', style:'background-image:url('+work.iconUrl+');background-position: '+(-work.iconOffset*100)+'% 0'}, ' '),
						work.name,
						Inferno.createElement('div', {className:'c'}, work.requiments(l_spec, l_spec.ministry, l_spec.location)+'%')
					),
					Inferno.createElement('div', {className:'e'},work.description)
				)
			}
			
		});
		
		game.UI.hasPerWorks = false;
		game.UI.specPerWorks = content.worklists.perSpec.map(function(work) {
			if (work.massRequiments([], l_spec.ministry, l_spec.location, l_spec.id) > 0) {
				
				game.UI.hasPerWorks = true;
				let resList = '', cost = work.calcCost([], l_spec.ministry, l_spec.location, l_spec);
				let payable=true;
				if (cost!={}) {
					let unf = '';
					for (let k in cost) {
						if (k == 'text') unf = cost[k];
						else {
							resList+= strings.resources[k]+': '+parseInt(cost[k])+' ('+strings.UI.messages.resHave+parseInt(game.player.resources[k].value)+')\n';
							if (game.player.resources[k].value<cost[k]) payable = false;
						}
					}
					resList+=unf;
				}
				let click;
				if (work.maxWorkers == -1) {
					click = function() {utils.callPopup({
						text:resList,
						buttons:[{
							text: (payable?strings.UI.messages.ok:strings.UI.messages.notEnoughRes),
							callback: (payable?function() {
								utils.startTask(work, [], game.player.ministry.id, l_spec.id, world.homecity);
								utils.closePopup()
							}:function() {return 0})
						},{
							text: strings.UI.messages.cancel,
							callback: function() {utils.closePopup()}
						}]
					})};
				}
				else {
					click = function() {utils.prepareTaskWindow(work, l_spec.location, l_spec.ministry, undefined, l_spec.id);};
				}
				
				return Inferno.createElement('div', {className:'line linebar dd b', onClick:click}, 
					Inferno.createElement('div', {className:'p',style:'width:'+work.massRequiments([], l_spec.ministry, l_spec.location, l_spec.id)+'%'}, null),
					Inferno.createElement('div', {className:'d'}, 
						Inferno.createElement('div', {className:'task', style:'background-image:url('+work.iconUrl+');background-position: '+(-work.iconOffset*100)+'% 0'}, ' '),
						work.name,
						Inferno.createElement('div', {className:'c'}, work.massRequiments([], l_spec.ministry, l_spec.location, l_spec.id)+'%')
					),
					Inferno.createElement('div', {className:'e'},work.description)
				)
				
			}
		});
		
		game.UI.currentWorks = l_spec.tasks.map(function(workId) {
			let task = world.tasks[workId];
			let work = content.works[task.id];
			return Inferno.createElement('div', {className:'line linebar dd b', onClick:(utils.ownedByPlayer(l_spec)?function() {
					if (work.maxWorkers != 1) {
						game.UI.taskHandling = task;
						document.getElementById("selectSpecs").classList.add('d');
						game.UI.taskBackHandlerType = 'none';
						game.UI.bottomSelectionMode = 'addToTask';
						utils.sortSpecList(game.player.ministry.id, game.player.specs, 'workPriority');
						game.UI.bottomRenderCounter = 0;
						game.UI.taskAddedWorkers = [];
					}
					else {
						let popUp;
						if (task.workers.length == 1) 
							popUp = {
								text: strings.UI.messages.stopSolo,
								buttons:[{
									text: strings.UI.messages.removeSpecFromTask,
									callback: function() {
										utils.stopTask(task, l_spec, 1);
										utils.closePopup()
									}
								},{
									text: strings.UI.messages.cancel,
									callback: function() {utils.closePopup();}
								}]};
						else 
							popUp = {
								text: strings.UI.messages.stop,
								buttons:[{
									text: strings.UI.messages.removeSpecFromTask,
									callback: function() {
										utils.stopTask(task, l_spec, 1);
										utils.closePopup()
									}
								},{
									text: strings.UI.messages.removeAllSpecsFromTask,
									callback: function() {
										task.workers.forEach(function(w, i, a) {utils.stopTask(task, world.specs[w], 1)});
										utils.closePopup()
									}
								},{
									text: strings.UI.messages.cancel,
									callback: function() {utils.closePopup();}
								}]};
						if (work.unstoppable) {
							popUp = {
							text: strings.UI.messages.cannotStop,
							buttons:[{
								text: strings.UI.messages.ok,
								callback: function() {
									utils.closePopup()
								}
							}]};
						}
						utils.callPopup(popUp);
					}
				}:null)}, 
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
		
		let l_min = 0;
		let l_notice = strings.UI.notices.allOkay;
		if (l_spec.attributes.workbalance > consts.workOverflow) {
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
		if (utils.getSpecSecrecy(l_spec)<consts.visibility[1]) {
			if (l_spec.stats.portrait.url != '' && l_spec.stats.portrait.url != undefined) game.UI.specImage = Inferno.createElement('img', {src:l_spec.stats.portrait.url}, null);
			else game.UI.specImage = content.portraits[l_spec.stats.portrait.id].func(l_spec, 'color');
		}
		else {
			game.UI.specImage = Inferno.createElement('img', {src:'res/portraits/unknown.png'}, null);
		}
		{ game.UI.specProfile = 
				Inferno.createElement('div', {},
					Inferno.createElement('div', {className:'pad sp_top'},
						Inferno.createElement('div', {className:'line nm'}, 
							Inferno.createElement('div', {className:'d'}, 
								(utils.getSpecSecrecy(l_spec)>=consts.visibility[1])?'???':l_spec.stats.name,
								(utils.getSpecSecrecy(l_spec)<consts.visibility[1]?Inferno.createElement('div', {className:'c'}, 
									Inferno.createElement('div', {className:'gender',style:'background-position:'+((l_spec.stats.gender-1)*(-100))+'% 0'}, null),
									Inferno.createElement('div', {className:'race',style:'background-position:'+((l_spec.stats.specie)*(-100))+'% 0'}, null)
								):null)
							)
						),
						Inferno.createElement('div', {className:'line linebar lv'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+(utils.getSpecSecrecy(l_spec)<consts.visibility[2]?utils.levelPercent(l_spec):0)+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.level,
								Inferno.createElement('span', {className:'c'}, (utils.getSpecSecrecy(l_spec)<consts.visibility[1]?utils.getLevel(l_spec):'???'))
							)
						),
						Inferno.createElement('div', {className:'line'}, 
							Inferno.createElement('div', {className:'sp'}, (utils.getSpecSecrecy(l_spec)>=consts.visibility[1])?'???':utils.getClassName(l_spec)),
							Inferno.createElement('span', {className:'r'}, (utils.getSpecSecrecy(l_spec)>=consts.visibility[3] && !utils.ownedByPlayer(l_spec))?'???':content.cities[l_spec.location].name)
						),
						Inferno.createElement('div', {className:'line linebar st_str'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+(utils.getSpecSecrecy(l_spec)<consts.visibility[2]?utils.getEndurance(l_spec)*100:0)+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.endurance,
								Inferno.createElement('span', {className:'c'}, (utils.getSpecSecrecy(l_spec)<consts.visibility[2]?utils.getActualEndurance(l_spec):'???'))
							)
						),
						Inferno.createElement('div', {className:'line linebar st_int'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+(utils.getSpecSecrecy(l_spec)<consts.visibility[2]?utils.getIntellect(l_spec)*100:0)+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.intellect,
								Inferno.createElement('span', {className:'c'}, (utils.getSpecSecrecy(l_spec)<consts.visibility[2]?utils.getActualIntellect(l_spec):'???'))
							)
						),
						Inferno.createElement('div', {className:'line linebar st_chr'}, 
							Inferno.createElement('div', {className:'p',style:'width:'+(utils.getSpecSecrecy(l_spec)<consts.visibility[2]?utils.getCharisma(l_spec)*100:0)+'%'}, null),
							Inferno.createElement('div', {className:'d'}, strings.UI.charisma,
								Inferno.createElement('span', {className:'c'}, (utils.getSpecSecrecy(l_spec)<consts.visibility[2]?utils.getActualCharisma(l_spec):'???'))
							)
						)
					),
					Inferno.createElement('div', {className:'pad sp_img'},
						game.UI.specImage,
						Inferno.createElement('div', {className:'ministry',style:'background-position:'+(l_spec.ministry!=null?-100*world.ministries[l_spec.ministry].info.iconOffset:0)+'%;'}, null)
					),
					(utils.getSpecSecrecy(l_spec)<consts.visibility[1]?Inferno.createElement('div', {className:'pad sp_info'},
						Inferno.createElement('div', {className:'pad sp_half'}, 
							Inferno.createElement('div', {className:'line linebar st_loy'}, 
								Inferno.createElement('div', {className:'p',style:'width:'+(utils.ownedByPlayer(l_spec)?utils.getLoyalty(l_spec):0)+'%'}, null),
								Inferno.createElement('div', {className:'d'}, strings.UI.loyalty,
									Inferno.createElement('span', {className:'c'}, (utils.ownedByPlayer(l_spec)?utils.getLoyalty(l_spec):'???'))
								)
							),
							Inferno.createElement('div', {className:'line linebar st_pyo'}, 
								Inferno.createElement('div', {className:'p',style:'width:'+(utils.ownedByPlayer(l_spec)?utils.calcPayoutV(l_spec):0)+'%'}, null),
								Inferno.createElement('div', {className:'d'}, strings.UI.payoutLevel,
									Inferno.createElement('span', {className:'c'}, (utils.ownedByPlayer(l_spec)?l_spec.attributes.currentPayout:'???'))
								)
							),
							Inferno.createElement('div', {className:'line linebar st_stf'}, 
								Inferno.createElement('div', {className:'p',style:'width:'+(utils.ownedByPlayer(l_spec)?utils.getSatisfaction(l_spec):0)+'%'}, null),
								Inferno.createElement('div', {className:'d'}, strings.UI.satisfaction,
									Inferno.createElement('span', {className:'c'}, (utils.ownedByPlayer(l_spec)?utils.getSatisfaction(l_spec):'???'))
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
								Inferno.createElement('div', {className:'p',style:'width:'+((utils.ownedByPlayer(l_spec)||utils.getSpecSecrecy(l_spec)<consts.visibility[3])?(100*l_spec.attributes.health/l_spec.attributes.maxHealth):0)+'%'}, null),
								Inferno.createElement('div', {className:'d'}, strings.UI.health,
									Inferno.createElement('span', {className:'c'}, ((utils.ownedByPlayer(l_spec)||utils.getSpecSecrecy(l_spec)<consts.visibility[3])?parseInt(l_spec.attributes.health)+'/'+l_spec.attributes.maxHealth:'???'))
								)
							),
							Inferno.createElement('div', {className:'line linebar st_opn'}, 
								Inferno.createElement('div', {className:'p',style:'width:'+(100-utils.getSpecSecrecy(l_spec))+'%'}, null),
								Inferno.createElement('div', {className:'d'}, strings.UI.secrecy,
									Inferno.createElement('span', {className:'c'}, 100-parseInt(utils.getSpecSecrecy(l_spec)))
								)
							)
						)
					):null),
					(l_spec.internalId=='GB'?null:Inferno.createElement('div', {className:'pad sp_info'},
						Inferno.createElement('div', {className:'pad sp_half'}, 
							(game.UI.specPerks.length == 0?strings.UI.noPerks:game.UI.specPerks)
						),
						(utils.ownedByPlayer(l_spec)?Inferno.createElement('div', {className:'pad sp_half'},
							l_notice,
							Inferno.createElement('br'),
							(l_spec.attributes.unpaid>0?strings.UI.messages.unpaid+l_spec.attributes.unpaid:''),
							Inferno.createElement('div', {className:'pad sp_inv'},
								'Изменить уровень оплаты',
								Inferno.createElement('div', {className:'b', style:'width:16%', onClick:function() {if (l_spec.attributes.currentPayout>100) l_spec.attributes.currentPayout-=100;}},'---'),
								Inferno.createElement('div', {className:'b', style:'width:16%', onClick:function() {if (l_spec.attributes.currentPayout>10) l_spec.attributes.currentPayout-=10;}},'--'),
								Inferno.createElement('div', {className:'b', style:'width:15%', onClick:function() {if (l_spec.attributes.currentPayout>1) l_spec.attributes.currentPayout--;}},'-'),
								Inferno.createElement('div', {className:'b', style:'width:15%', onClick:function() {l_spec.attributes.currentPayout++;}},'+'),
								Inferno.createElement('div', {className:'b', style:'width:16%', onClick:function() {l_spec.attributes.currentPayout+=10;}},'++'),
								Inferno.createElement('div', {className:'b', style:'width:16%', onClick:function() {l_spec.attributes.currentPayout+=100;}},'+++')
							)
						):null)
					)),
					((utils.ownedByPlayer(l_spec)||utils.getSpecSecrecy(l_spec)<consts.visibility[4])?Inferno.createElement('div', {className:'pad sp_info'}, game.UI.currentWorks):null),
					(utils.ownedByPlayer(l_spec)?Inferno.createElement('div', {className:'pad sp_info'}, (game.UI.hasWorks?game.UI.specWorks:strings.UI.noWork)):null),
					Inferno.createElement('div', {className:'pad sp_info'}, (game.UI.hasPerWorks?game.UI.specPerWorks:strings.UI.noPerWork)),
					((game.UI.specNotes==0 || !utils.ownedByPlayer(l_spec))?null:Inferno.createElement('div', {className:'ux pad sp_info table st'}, 
						Inferno.createElement('div', {className:'t3'},game.UI.specNotes)
					))
				);
		}
		Inferno.render(game.UI.specProfile, document.getElementById("specinfo").getElementsByClassName('cc')[0]);
	}
	
};

function m_init() {
	for (let i=0; i<document.querySelectorAll('#top .ico1').length; i++) {
		if (i!=document.querySelectorAll('#top .ico1').length-1) document.querySelectorAll('#top .ico1')[i].addEventListener('click', function() {utils.changeSpeed(i)});
		else document.querySelectorAll('#top .ico1')[i].classList.add('na');
	}
	
	document.querySelectorAll('#top .menukey')[0].innerHTML = strings.UI.menu.pause;
	document.querySelectorAll('#menu .b')[0].innerHTML = strings.UI.menu.continue;
	document.querySelectorAll('#menu .b')[1].innerHTML = strings.UI.menu.saveAndExit;
	
	document.querySelectorAll('#top .menukey')[1].innerHTML = strings.UI.specs;
	document.querySelectorAll('#top .menukey')[2].innerHTML = strings.UI.map;
	document.querySelectorAll('#top .menukey')[3].innerHTML = strings.UI.ministries;
	document.querySelectorAll('#top .menukey')[4].innerHTML = strings.UI.player;
	document.querySelectorAll('#top .menukey')[5].innerHTML = strings.UI.techs;
	
	document.querySelector('#menu .h').innerHTML = strings.UI.menu.pause;
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
		if (game.UI.tspeed == 3) game.UI.tspeed = 1;
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