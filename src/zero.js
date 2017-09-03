'use strict';
var content = {};
content.perks = {};
content.perks.c = {};					//собственно перки
content.perks.perkVarPool = [];		
content.perks.perkReplPool= [];
content.perks.perkExclusions = [];		
content.quests = {};
content.tasks = {};
content.works = {};

content.worklists = {};
content.worklists.perCity = [];
content.worklists.withSpec = [];
content.worklists.perSpec = [];
content.worklists.perMinistry = [];

content.technologies = {};
content.news = {};
content.presetedSpecs = {};
content.cities = {};
content.roadmap = {};
content.gameCycles = {};
content.gameListeners = [];
content.extendedPerksGenerators = [];
content.idlePerksGenerators = [];
content.worldCreators = [];
content.gameCreators = [];
content.gameLaunchers = [];

content.portraits = {};
content.portraitsListing = [];

content.ministryTicks = {};
content.ministryTicks.MAS = [];
content.ministryTicks.MoP = [];
content.ministryTicks.MWT = [];
content.ministryTicks.MI = [];
content.ministryTicks.MoM = [];
content.ministryTicks.MoA = [];
content.ministryTicks.OIA = [];
content.ministryTicks.Z = [];
content.ministryTicks.EQ = [];
content.ministryTicks.DDD = [];

content.ministrySpecTicks = {};
content.ministrySpecTicks.MAS = [];
content.ministrySpecTicks.MoP = [];
content.ministrySpecTicks.MWT = [];
content.ministrySpecTicks.MI = [];
content.ministrySpecTicks.MoM = [];
content.ministrySpecTicks.MoA = [];
content.ministrySpecTicks.OIA = [];
content.ministrySpecTicks.Z = [];
content.ministrySpecTicks.EQ = [];
content.ministrySpecTicks.DDD = [];

content.ministryPriorities = {};

content.ministryCityPartDelta = {};

content.ministryCityTicks = {};
content.ministryCityTicks.EQ = [];
content.ministryCityTicks.Z = [];

var game = {};
game.UI = {};
game.player = {};
game.player.resources = {};
/*
Only for linkage!

Fields:
	.ministry
	.specs[]
	.resources[type].value
*/

function m_init() {return 0}