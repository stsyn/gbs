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
content.worklists.perSpec = [];
content.worklists.perMinistry = [];
content.worklists.perOwnedCity = [];

content.technologies = {};
content.news = {};
content.presetedSpecs = {};
content.cities = {};
content.gameCycles = {};
content.gameListeners = [];
content.extendedPerksGenerators = [];
content.idlePerksGenerators = [];
content.worldCreators = [];
content.gameCreators = [];

var game = {};
game.UI = {};
function m_init() {return 0}