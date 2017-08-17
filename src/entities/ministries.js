'use strict';
class ministry {
	constructor() {
		this.id = null;
		this.isCountry = false;
		this.owner = null;
		this.specs = [];
		this.technologies = [];		//для стран
		
		this.info = {};
		this.info.name = '';
		this.info.desc = '';
		this.info.iconUrl = '';
		this.info.iconOffset = 0;
		this.info.bigIconUrl = '';
		
		this.stats = {};
		this.stats.ratio = 0;		//рейтинг довольствия населения этим продуктом бюрократии
		this.stats.military = 0;	//военизированность (только для стран)
		this.stats.loyalty = 0;		//ладно, допустим, это верность министерства относительно ДМД. Для Эквестрии оно значит, насколько ДМД долбаеб
		this.stats.treat = 0; 		//только для стран, уровень угрозы
		this.stats.part = 0;
		
		this.specsTicks = [];
		
		this.messages = [];
		this.notifyLevel = -1;
	}
}
function m_init() {return 0}