var lang = 'ru';
var strings = {
	nameGeneration:{
		first:['Айрон', 'Астрал', 'Бернинг', 'Берри', 'Биг', 'Блади', 'Блу', 'Бризи', 'Бронз', 'Вайолет', 'Винди', 'Джаст', 'Доун', 'Ивнинг', 'Клир', 'Кок', 'Лайтнинг', 'Лаки', 'Лоуфол', 'Майт', 'Миднайт', 'Мэджикал', 'Оникс', 'Перфект', 'Платинум', 'Рэд', 'Рэйнбоу', 'Санни', 'Сансет', 'Сапфир', 'Свити', 'Сильвер', 'Скотч', 'Смоки', 'Старри', 'Стил', 'Тандер', 'Твайлайт', 'Томато', 'Троттинг', 'Фан', 'Флаффи', 'Фрут', 'Циркус', 'Шайнинг', 'Экселлент', 'Экшен'],
		second:['Блад', 'Блейз', 'Блум', 'Болт', 'Бонд', 'Боттом', 'Брейк', 'Вейв', 'Войс', 'Волкер', 'Гаджет', 'Гейм', 'Гизмо', 'Гир', 'Глейзер', 'Голд', 'Дей', 'Джаз', 'Ду', 'Дэнс', 'Кола', 'Краст', 'Лотус', 'Луламун', 'Майнд', 'Метеор', 'Мист', 'Пай', 'Панч', 'Прайз', 'Рейн', 'Сайдр', 'Сид', 'Симфони', 'Слайс', 'Сода', 'Спун', 'Страйкер', 'Стрип', 'Топ', 'Трот', 'Файр', 'Фанг', 'Флейм', 'Хувз', 'Шайн', 'Шарм', 'Эклипс'],
		both:['Айс', 'Аметист', 'Басс', 'Близзард', 'Блоссом', 'Блюз', 'Бэлл', 'Грин', 'Даймонд', 'Дью', 'Жакет', 'Карамел', 'Клауд', 'Куки', 'Кэнди', 'Лемон', 'Мак', 'Марбл', 'Мелоди', 'Минт', 'Мозаика', 'Найт', 'Обсидиан', 'Опал', 'Орандж', 'Перл', 'Рич', 'Рок', 'Роуз', 'Сансет', 'Силк', 'Синамон', 'Скай', 'Смайл', 'Солар', 'Сопрано', 'Спирит', 'Спринкл', 'Стар', 'Старлайт', 'Стоун', 'Стрип', 'Сэддэл', 'Фан', 'Фрост', 'Фул', 'Хани', 'Хекс', 'Черри', 'Чиз', 'Шифт', 'Шэдоу', 'Эппл'],
		mono:['Стилхуфз', 'Чарити', 'Стронгхуф', 'Даск', 'Берришайн', 'Коко', 'Найтингел', 'Блэкджек', 'Джэкпот', 'Терра', 'Дейзи', 'Тамбелвейд', 'Тэкки', 'Эмеральд', 'Скраппи Раг']
		},
	zebraNamesGenerator:{
		begin:["ксе", "аль", "хаз", "за", "эль", "саа", "аки", "уль", "аби"],
		middle:["бе", "за", "джа"],
		end:["нит", "рим", "хаз", "рет", "тал", "том", "хид", "н", "р", "ниа", "циа", "оль"],
		g_end:[  0,     1,     0,     1,     1,     1,    1,    1,   1,     0,     2,     2],
		uni:["са", "ко", "ра", "зе", "ни", "ла", "та", "зу", "це", "би", "шо", "ти", "ки", "мо", "ли"],
		g_uni:[ 2,    2,    2,    2,    2,    2,    2,    0,    0,    0,    0,    2,    2,    0,   2]
	},
	ministries:{
		names:{
			OIA:'Департамент Межминистерских Дел',
			MoM:'Министерство Морали',
			MoP:'Министерство Мира',
			MoA:'Министерство Крутости',
			MWT:'Министерство Военных Технологий',
			MI :'Министерство Стиля',
			MAS:'Министерство Тайных Наук',
			EQ :'Эквестрия',
			Z  :'Зебриника'
		},
		short: {
			OIA:'ДМД',
			MoM:'МинМор',
			MoP:'МинМира',
			MoA:'МинКрутости',
			MWT:'МВТ',
			MI :'МинСтиля',
			MAS:'МТН'
		},
		bigPictures:{
			OIA:'res/ministries/big/0.png',
			MoM:'res/ministries/big/6.png',
			MoP:'res/ministries/big/3.png',
			MoA:'res/ministries/big/4.png',
			MWT:'res/ministries/big/5.png',
			MI :'res/ministries/big/2.png',
			MAS:'res/ministries/big/1.png',
			EQ :'res/ministries/big/7.png',
			Z  :'res/ministries/big/8.png'
		},
		icons:{},
		iconOffsets:{}
	},
	useCases:true,
	dialoguesAnim:{
		slowChars:', ',
		verySlowChars:'.!?',
		fastChars:'0123456789-/—+:'
	},
	cased:{
		g: {
			ministries: {
				OIA:'Департамента Межминистерских Дел',
				MoM:'Министерства Морали',
				MoP:'Министерства Мира',
				MoA:'Министерства Крутости',
				MWT:'Министерства Военных Технологий',
				MI :'Министерства Стиля',
				MAS:'Министерства Тайных Наук',
				EQ :'Эквестрии',
				Z  :'Зебриники'
			}
		},
		d: {
			ministries: {
				OIA:'Департаменту Межминистерских Дел',
				MoM:'Министерству Морали',
				MoP:'Министерству Мира',
				MoA:'Министерству Крутости',
				MWT:'Министерству Военных Технологий',
				MI :'Министерству Стиля',
				MAS:'Министерству Тайных Наук',
				EQ :'Эквестрии',
				Z  :'Зебриники'
			}
		}
	},
	classes:[
		'Политик','Ученый','Военный','Оперативник','Офицер','Организатор','Универсал'
	],
	resources:{
		money:'Битс'
	},
	UI:{
		personal:'Личное дело',
		news:'Сводки',
		player:'Проигрыватель',
		techs:'Технологии',
		specs:'Специалисты',
		map:'Мир',
		ministries:'Министерства',
		
		byStandart:'Стандартная',
		byLevel:'По уровню',
		byEmergency:'По срочности',
		
		idle:'Нет задания',
		noWork:'Нет персональных поручений для этого специалиста',
		noPerWork:'Нет заданий, связанных с этим специалистом',
		
		clickToContinue:'Кликните для продолжения',
		
		level:'Уровень',
		endurance:'Выносливость',
		intellect:'Интеллект',
		charisma:'Харизма',
		loyalty:'Лояльность',
		payoutLevel:'Уровень оплаты',
		satisfaction:'Удовлетворенность',
		involvement:'Вовлеченность',
		secrecy:'Открытость',
		health:'Здоровье',
		noPerks:'Нет известных перков',
		ratio:'Рейтинг',
		part:'Доля',
		tpart:'Мощность',
		money:'Финансы',
		military:'Военнизированность',
		treat:'Угроза',
		
		ponyCount:'Население',
		militaryPower:'Военная мощность',
		industrialPower:'Производственная мощность',
		techPower:'Научный потенциал',
		
		notices: {
			allOkay:'Специалист доволен всем',
			lowPay:'Специалист считает, что ему платят недостаточно',
			lowHealth:'Специалист просит лечение',
			tooMuchWork:'Специалист устал от работы и хочет отдохнуть',
			tooMuchRelax:'Специалист отдыхал достаточно долго',
			wrongWork:'Специалист недоволен родом своей деятельности'
		},
		
		menu: {
			pause:'Пауза',
			continue:'Продолжить',
			saveAndExit:'Сохранить и выйти'
		},
		
		messages: {
			textWork:'Назначить специалиста на задание?',
			textWorkResources:' Потребуется:',
			textWorkBusy:' (специалист на данный момент занят, стоимость может измениться к моменту начала выполнения):',
			stop:'Отменить выполнение задания данным специалистом? Задание может быть провалено!',
			stopSolo:'Отменить выполнение задания?',
			cannotStop:'Нельзя прервать выполнение задания!',
			freeTask:'Не требуются особые затраты',
			unpaid:'Задолжность перед специалистом составляет ',
			
			removeSpecFromTask:'Снять этого специалиста с задания',
			removeAllSpecsFromTask:'Отменить выполнение задания',
			
			workCompleted:'Задание "%work%" выполнено.',
			workFailed:'Задание "%work%" провалено.',
			workCanceled:'Задание "%work%" было отменено.',
			workImpossible:'Задание "%work%" не может быть выполнено этими специалистами.',
			workCanceledForSpec:'Выполнение задания "%work%" отменено.',
			workImpossibleForSpec: 'Специалист не может выполнить задание "%work%".',
			workLowRes:'Задание "%work%" отменено, так как недостаточно ресурсов.',
			
			levelUpped:'Достигнут новый уровень.',
			perkFound:'Стал известен перк "%perk%".',
			
			deadSpec:'В связи со смертью специалиста %spec% необходимо выплатить компенсацию!',
			deadSpecFullCompensation:'3000 битс',
			deadSpecHalfCompensation:'1500 битс',
			notEnoughMoney:'Недостаточно битс',
			notEnoughRes:'Недостаточно ресурсов',
			resHave:'имеется ',
			
			specMinCount:'Необходимо специалистов: ',
			specMaxCount:'Максимум специалистов: ',
			unlimited:'Неограничено',
			required:'Потребуется:',
			noAdditionalSpecs:'Не выбраны дополнительные специалисты',
			startTask:'Начать выполнение',
			effeciency:'Эффективность',
			addSpecs:'Добавить специалистов на задание',
			
			ministryInCityTask:'Задания при %ministry% в %city%:',
			
			ok:'ОК',
			cancel:'Отмена'
		}
		
	}
}
for (let i=0; i<consts.ministries.length; i++) {
	strings.ministries.icons[consts.ministries[i]] = 'res/icons/ministries.png';
	strings.ministries.iconOffsets[consts.ministries[i]] = i+1;
}
strings.ministries.iconOffsets.EQ = 8;
strings.ministries.iconOffsets.Z = 9;


function m_init() {
	content.presetedSpecs.TS.stats.name = 'Твайлайт Спаркл';
	content.presetedSpecs.AJ.stats.name = 'Эпплджек';
	content.presetedSpecs.PP.stats.name = 'Пинки Пай';
	content.presetedSpecs.Rarara.stats.name = 'Рэрити';
	content.presetedSpecs.FS.stats.name = 'Флаттершай';
	content.presetedSpecs.RD.stats.name = 'Рейнбоу Дэш';
	content.presetedSpecs.HS.stats.name = 'Доктор Хорс';
	content.presetedSpecs.BM.stats.name = 'Биг Макинтош';
	
	content.perks.c.p_hnst.name = 'Честный';
	content.perks.c.p_hnst.description = 'Предпочитает работать на светлой стороне сил. И если он работает с вами, то можете не сомневаться в его верности, подкупить практически невозможно. Но и вам загладить свою вину деньгами будет сложнее.';
	
	content.perks.c.p_dirt.name = 'Нечистый';
	content.perks.c.p_dirt.description = 'Достаточно темное прошлое, поэтому ему не привыкать выполнять грязную работенку. Старайтесь не огорчать его, он не будет работать на вас, если ему не нравится.';
	
	content.perks.c.p_work.name = 'Трудоголик';
	content.perks.c.p_work.description = 'Не боится тяжелой и постоянной работы, но боится безделья. Образ жизни сказался на здоровье.';
	
	content.perks.c.p_drnk.name = 'Зависимость';
	content.perks.c.p_drnk.description = 'Имеет зависимость от различных сильнодействующих веществ.';
	
	content.perks.c.p_lazy.name = 'Ленивый';
	content.perks.c.p_lazy.description = 'Избегает работы всегда, когда это возможно.';
	
	content.perks.c.p_tidy.name = 'Аккуратный';
	content.perks.c.p_tidy.description = '7 раз отмерь, 1 раз отрежь — это про него.';
	
	content.perks.c.p_idea.name = 'Идейный';
	content.perks.c.p_idea.description = 'Работает не за деньги, а за идею.';
	
	content.perks.c.p_gnus.name = 'Гений';
	content.perks.c.p_gnus.description = 'Талант в научной сфере сразу бросается в глаза. Вот только остальные области несколько страдают.';
	
	content.perks.c.p_art.name = 'Душа компании';
	content.perks.c.p_art.description = 'Талант в общении с пони сразу бросается в глаза. Вот только остальные области несколько страдают.';
	
	content.perks.c.p_sldr.name = 'Вояка';
	content.perks.c.p_sldr.description = 'Талант в боевом искусстве сразу бросается в глаза. Вот только остальные области несколько страдают.';
	
	content.perks.c.p_sold.name = 'Продажный';
	content.perks.c.p_sold.description = 'Любой каприз за деньги. А готовые платить найдутся всегда.';
	
	content.perks.c.p_fppl.name = 'Вечный ученик';
	content.perks.c.p_fppl.description = 'Провел почти всю жизнь за учебной партой, поэтому гораздо быстрее усваивает материал. Правда, любым другим способом научить его сложно.';
	
	content.perks.c.p_mstr.name = 'Мастер';
	content.perks.c.p_mstr.description = 'Почти все ему дается очень легко. Но категорически не признает современную систему образования.';
	
	content.perks.c.p_trtr.name = 'Предатель';
	content.perks.c.p_trtr.description = 'Имеет поддерживаемые связи на стороне противника.';
	
	content.perks.c.p_plld.name = 'Палладин';
	content.perks.c.p_plld.description = 'Считает себя борцом светлых сил и неприемлет какой-либо грязи.';
	
	content.perks.c.p_prnc.name = 'Параноик';
	content.perks.c.p_prnc.description = 'Один из симптомов "Синдрома военного времени", субъект очень скрытен, подозревает за собой слежку и заметает свои следы.';
	
	content.perks.c.p_hero.name = 'Герой';
	content.perks.c.p_hero.description = 'Своим отважным поступком прославился среди простого народа и служит примером для остальных.';
}