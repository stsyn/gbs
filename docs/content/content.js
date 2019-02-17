content.title = {
c:``,
markdown:true,
next:'specs',
name:'Гайдлайн сущностей GBS',
id:'title'
};

content.specs = {
l2:{
	overwiew:{
		c:
`# Специалисты

## Конструктор

На вход может быть подан образ специалиста с группами полей **stats**, **attributes**, и полями **ministry**, **owner**, **location**, **perks**, **isPerkExplored**, **tasks**, **messages**, **notifyLevel**, **id**. При отсутствии, задаются значения по умолчанию. Могут быть заданы не все значения.

## Поля

См. раздел.

## Статы

### Имя, пол и вид

Имя — доступно два генератора: понячие и зебринские.

Понячьи имена образуются путем сочетания двух случайных слов (**utils.generateName() -> {n:name, g:gender}**) из пула (**strings.nameGeneration**). Существует четыре массива слов: как первое, как второе, универсальное, редкое. Редкие имена состоят из одного элемента (но это все равно могут быть два и более слов), и не дают никаких бонусов. Все пулы прописаны в файле языка. Пол выбирается случайно.

Зебринские имена образуются путем сочетания **generateZebraName() -> {n:name, g:gender}** нескольких слогов (2 или 3, средний слог может отсутствовать), хранящихся в пулах (**strings.zebraNamesGenerator**). Четыре пула: начальные, средние, конечные и универсальные. Для конечных и универсальных имеется второй массив, определяющий пол.

Выбор конструктора имени определяется значением в **consts.speciesNameGenerFunction** по индексу вида.

### Великая тройка характеристик

Задаются двумя уровнями: первый уровень — доля характеристики, второй уровень — реальное значение (которое может и не соответствовать своей доле полностью). 

Получить значения первого уровня можно с помощью **utils.getCharisma/getIntellect/getEndurance(spec) -> [0-1]float**. 

Значения второго уровня зависят от: уровня (коэффициент определяется **utils.levelAmplifier(level) -> float**) и теневых множителей (**spec.shadow.charismaMult/intellectMult/enduranceMult**). Для пегасов значение выносливости умножено на дополнительный коэффициент. Получить можно с помощью **utils.getActualCharisma/getActualIntellect/getActualEndurance(spec) -> int**.

Уровень увеличивается, когда текущее значение опыта достигает требуемой отметки, после чего обнуляется. Требуемые значения даны в **consts.nextLevel**. Максимальный уровень — 10. При генерации персонажи могут получить уровень от 1 до 3 (2 — примерно 10%, 3 — примерно 1-2%)

### Остальные характеристики

Максимальное здоровье зависит от реальной выносливости и теневого множителя (**spec.shadow.maxHealthMult**) и определяется функцией {utils.generateMaxHealth(spec) -> int**}. Минимальное значение — 10.

Желаемая оплата определяется функцией **utils.calcPayout(spec) -> int**. Каждое следующее значение всегда опирается на предыдущее и не может отличаться от него более чем на 1-2%. На практике, новое значение почти всегда выше.

Удовлетворенность определяется функцией **utils.getSatisfaction(spec) -> [0-100]int**. Зависит от **spec.attributes.workSatisfaction**, **...worktypeSatisfaction**, **...payoutSatisfaction**. Если имеется неуплата, значение удовлетворенности уменьшается на 10 за каждую полную неуплату.

Перерасчет большинства значений выполняется только для специалистов игрока в функции **utils.OIAspecTick(spec)**. Процесс рассчета прокомментирован внутри самой функции.

Секретность определяет объем видимых перков. Также определяет видимых характеристики для чужих специалистов. Ключевые точки даны в **consts.visibility**.

`,
		markdown:true,
		name:'Обзор',
		id:'overwiew',
		next:'fields'
	},
	fields:{
		c:
`## Поля


### L1

*	**id**: Порядковый номер специалиста в мире, эквивалентен номеру в массиве специалистов, используется для адресации.
*	**internalId**: Уникальный идентификатор квестовых специалистов для их поиска.
*	**shadow**: Раздел для бафов.
*	**messages**: Очередь ссылок на сообщения с этим специалистом.
*	**notifyLevel**: Уровень уведомления.
*	**counters**: Счетчики обновления.
*	**data**: Пользовательский контейнер.
*	**stats**: Свалка статических данных.

### stats

*	**name**: Отображаемое имя специалиста.
*	**charisma**, **intellect**, **endurance**: "Великая тройка" характеристик.
*	**level**: Уровень.
*	**experience**: Опыт.
*	**gender**: Пол (согласно **consts.gender = ['r', 'm', 'f', 'u']**. Значение 0 (r) зарезервировано для повторной генерации пола в генераторе специалиста).
*	**specie**: Вид (согласно **consts.species:['earthpony','unicorn','pegasus','alicorn','zebra']**).
*	**portrait**: Портрет.

### shadow

*	**charismaMult**: Множитель харизмы.
*	**intellectMult**: Множитель интеллекта.
*	**enduranceMult**: Множитель выносливости.
*   **maxHealthMult**: Множитель предела здоровья.
*   **levelUpExpMult**: Множитель количества опыта до уровня.
*	**payoutSatisfactionMult**: Множитель штрафа/бонуса на удовлетворенность от зарплаты.
*	**payoutLoyaltyMult**: То же, но на лояльность.
*	**satisfactionLoyaltyMult**: Пропорция зависимости лояльности от удовлетворенности.
*	**speedMult**: Множитель скорости обновления, не рекомендуется к использованию.
*   **workSatisfactionMult**: Множитель штрафа за переработку.
*	**workTypeSatisfactionMult**: Множитель бонуса/штрафа за тип работы [недостаточно гибкий, переделать на объектный уровень].
*	**workHealthMult**: Множитель урона здоровью от переработки.
*	**relaxSatisfactionMult**: Множитель удовлетворенности от отдыха.
*	**workPenaltyMult**: Множитель требования к зарплате за переработку (???).
*	**workbalanceMult**: Множитель отдыха относительно работы.
*	**failChanceMult**: Множитель шанса провала.
*	**badTasksMult**: Множитель штрафа за плохие задания [недостаточно гибкий, слить с workTypeSatisfactionMult]
*	**zebraTasksMult**: То же для заданий против зебр.
*	**loyaltyBonus**: Статический бонус/штраф к лояльности.
*	**satisfactionBonus**: То же для удовлетворенности.
*	**excludePerkLists**: (???).


`,
		markdown:true,
		name:'Поля',
		id:'fields'
	}
},
multilevel:true,
markdown:true,
first:'overwiew',
next:'dialogs',
name:'Специалисты',
id:'specs'
};

content.dialogs = {
c:`# Диалоги

Все ветви диалогов прописываются в **content.dialogs** в виде объектов с четко заданными полями.

## Обзор

Основная информация хранится в указанном выше объекте. Текущее состояние диалога хранится в объекте DialState, который является одним из аргументом для всех методов. Без вызова диалога можно просмотреть его состояния в объекте dialState специалиста, к которому диалог привязан. Допускается привязка одного диалога к нескольким специалистам, в таком случае все dialState будут разными. 

Для прописывания персонажу диалога при генерации мира необходимо задать ему объект **dialState** с единственным полем **id**. Во всех остальных случаях необходим вызов **utils.setDialogueToSpecialist(specialist, dialogueId)**. Вызов диалога по инициативе игрока выполняется через системное задание *w_dialogue*, в остальных случаев вызывается **utils.startDialogue(specialist)** (допускается вместо объекта специалиста указывать идентификатор нужного диалога, в таком случае диалог будет привязан к миру по этому идентификатору). Вызов не выполняется, если **Dialogue.checkAvailibility(dialState)** возвращает *false* или **dialState.isAvailable** равен *false* (исключение для программного вызова, которое вызывает диалог всегда).

## Поля объекта Dialogue

Некоторые функции объекта **tree.*node* ** могут быть и строками/обычными объектами, если значения статичны. В ветке **обязательно** должно быть либо поле **choices**, либо поле **next**, либо название ветки должно заканчиваться на число и должна существовать следующая ветка с большим номером (из ветки *node4* произойдет переход в *node5*, если отсутствует поле **next** или **choices**, задающие иное).

*	**id** — идентификатор. Обязан совпадать с именем объекта;
*	**defaultSpecialist** — *необязательный*, специалист, который по умолчанию отображается, как произносящий реплики. При наличии перекрывает закрепленного специалиста;
*	**checkAvailibility(dialState)** — функция обязана возвращать true, если диалог доступен для вызова и false в обратном случае;
*	**startingNode(dialState)** — функция обязана возвращать имя первой ветки диалога. Выполняется перед началом диалога, если необходимо выполнить дополнительные приготовления, должны выполняться в этой функции;
*	**tree{}** — объект со всеми ветками:
	*	* **node_name{}** * — ветка представляет собой самостоятельный объект. Допускается любое имя, за исключением *_end*, которое зарезервировано для завершения диалога:
		*	**onShow(dialState)** — *необязательный*, функция выполняется при попадании в ветку диалога;
		*	**overrideSpecialist(dialState) -> строка** — *необязательный, может быть строкой*, функция возвращает идентификатор специалиста, с которым ассоциируется реплика. null эквивалентно обезличенному диалогу, -1 не делает ничего;
		*	**text(dialState) -> строка** — *может быть строкой*, текст сообщения;
		*	**next(dialState) -> строка** — *необязательный, может быть строкой*, в случае отсутствия поля **choices** определяет следующую ветку диалога;
		*	**choices(dialState) -> []** — *необязательный, может быть массивом*, возможные реакции на диалог:
			*	**text** — строка;
			*	**newNode** — строка, ветка, на котороую произойдет переход. Допускается отсутствие при **unavailable:true**;
			*	**unavailable** — *необязательный*, если равно true, то данный вариант выбрать нельзя;
			*	**action(dialState)** — *необязательный*, выполняется при выборе опции.
			*	либо
			*	**generator(dialState) -> {}** — возвращает объект с вышеуказанной структурой.
			
### Приоритет отображаемого специалиста в диалоге

Нет специалиста < Привязанный специалист < Значение **Dialogue.defaultSpecialist** < Значение ** *node_name*.overrideSpecialist**

### Приоритет переходов в диалоге

*node*X -> *node*X+1 < Значение ** *node_name*.next** < Значения ** *node_name*.choices**


## Поля объекта DialState

*	**background** — *необязательный, не реализован*, определяет фоновое изображение диалога;
*	**attachedSpecialistId** — *r/o* идентификатор привязанного специалиста;
*	**overridingSpecialistId** — идентификатор специалиста, который используется для отрисовки, если не равен привязанному;
*	**dialogueId** — идентификатор текущего диалога;
*	**currentNode** — текущая ветка диалога;
*	**isAvailable** — доступен ли для вызова;
*	**data{}** — пользовательские данные.
.`,
markdown:true,
next:'ministries',
name:'Диалоги',
id:'dialogs'
};


content.ministries = {
c:``,
markdown:true,
next:'cities',
name:'Министерства',
id:'ministries'
};

content.cities = {
c:``,
markdown:true,
name:'Города',
next:'tasks',
id:'cities'
};

content.tasks = {
c:`# Задания

Все задания прописываются в **content.works** в виде объектов с четко заданными полями.

## Обзор

Задания являются шаблоном. При непосредственном начале выполнения создается объект "задача", который наследует значения некоторых полей и содержит конкретную информацию о специалистах, выполняющих задание, период обновления и долю выполнения. Состояние задания обновляется в соответствии с прописанным интервалом. Задание считается выполненым, когда значение **value** задачи больше или равно значению **target** задачи. Может выполнено принудительно путем вызова функции **utils.completeTask(%задача%)**.

## Поля задания

Обязано содержать следующие блоки (если у элемента во входных параметрах не указано "идентификатор", значит подается сам объект):

*	**id** — идентификатор. Обязан совпадать с именем объекта;
*	**iconUrl** — адрес к файлу, содержащий иконку задания;
*	**iconOffset** — порядок иконки в файле (отсчет с 0);
*	**name** — отображаемое имя задания;
*	**description** — описание;
*	**target** — целевое знаение, при котором задание будет выполнено. Дублируется в задачу, где может быть изменено или пересчитано;
*	**maxWorkers** — максимальное число работников-специалистов. -1 эквивалентно бесконечности. Для заданий в списке **withSpec** должно равняться 1;
*	**minWorkers** — минимальное число работников-специалистов. Если к моменту обновления задания их будет меньше, задание считается проваленым. Для **perSpec** значение 0 используется, чтобы имитировать **withSpec**;
*	**onlyOne** — определяет, возможно ли несколько итераций данного задания с такими же условиями (одновременно уточняются министерство, город и целевой специалист). Если отмечено и есть задание с такими же условиями, при попытке начать задание будет вызван интерфейс редактирования текущего;
*	**unstoppable** — определяет, может ли задание быть прервано или изменено;
*	**type** — массив из типов задания;
*	**updateInterval** — интервал обновления во внутриигровом времени. Для упрощения можно использовать **utils.time2ms({})**;
*	**data** — объект для пользовательских статичных данных;
*	**noneCalcCost(идентификатор министерства, идентификатор города, целевой специалист)** — обязано возвращать стоимость задания в виде объекта с перечнем идентификаторов ресурсов и количества. Поле **text** может использоваться для добавления своего текста после перечня ресурсов. Поле **mainText** может использоваться для замещения стандартного текста при инициировании задания. Если не имеет стоимости, должен возвращаться пустой объект (**{}**);
*	**calcCost(список идентификаторов специалистов, идентификатор министерства, идентификатор города, целевой специалист)** — аналогичен предыдущему, но вызывается со списком специалистов;
*	**requiments(специалист, идентификатор министерства, идентификатор города, целевой специалист)** — возвращает пригодность данного специалиста к выполнению задания. Ноль и ниже означает полную непригодность, в таком случае специалиста назначить нельзя;
*	**noneRequiments(идентификатор министерства, идентификатор города, целевой специалист)** — возвращает возможность выполнения задания. Значение приблизительно. Ноль означает, что задание не может быть начато не при каких условиях, оно не будет выведено в списке;
*	**massRequiments(список идентификаторов специалистов, идентификатор министерства, идентификатор города, целевой специалист)** — возвращает возможность выполнения задания данным набором специалистов. Задание не может быть начато, если возвращает 0 и ниже;
*	**whenStart(задача)** — выполняется один раз при старте задания;
*	**whenStartPerSpec(задача, специалист)** — аналогичен предыдущему, но вызывается для каждого специалиста;
*	**whenComplete(задача)** — вызывается один раз при выполнении задания;
*	**update(задача)** — вызывается всякий раз при обновлении задания;
*	**updatePerSpec(задача, специалист)** — вызывается для каждого специалиста, выполняющего задание, при обновлении задания;
*	**whenStopped(задача)** — вызывается один раз при остановке выполнения задания;
*	**whenStoppedPerSpec(задача, специалист)** — вызывается для специалиста, который прервал выполнение задания. Также вызывается для каждого специалиста вместе с предыдущим;
*	**whenFailed(задача)** — вызывается один раз, если задание провалено.

## Списки заданий

Массивы в **content.worklists**. Каждое задание нужно добавлять в список через **push()** при инициализации.

*	**withSpec** — задания, выполняемые данным специалистом (принадлежащим игроку!) в одиночку и нацелены на него самого;
*	**perSpec** — задания, выполняемые другими специалистами относительно данного. Может использоваться, если необходимо реализовать задание предыдущего типа для не принадлежащего игроку специалиста;
*	**perCity** — задания, предназначенные для выполнения в данном городе;
*	**perMinistry** — задания, предназначенные для данного отделения министерства в данном городе.
`,
markdown:true,
name:'Задания',
next:'API',
id:'tasks'
};

content.API = {
l2:{
	consts:{
		c:
`Доступны из объекта consts:

*	**baseSpeed** — базовая скорость игры;
*	**fps** — частота перерисовки;
*	**gameSpeed[]** — скорость игры в зависимости от выбранной скорости;
*	**specUpdateInterval** — частота обновления специалистов;
*	**sleepOverWork** — превалирование времени отдыха над временем работы;
*	**workOverflow** — опорная константа, когда превышено время работы;
*	**maxNotifies** — количество хранимых уведомлений;
*	**workCheckInterval** — частота обновления задач;
*	**visibility[]** — константы "секретности": факт наличия; известно только имя, класс и внешность; известны характеристики; местоположение и здоровье; текущие задания;
*	**nextLevel[]** — константы для получения нового уровня;
*	**maxLevel** — максимальный уровень специалиста;
*	**ministries[]** — перечень "сущностей министерств";
*	**actualMinistries[]** — перечень каноничных министерств;
*	**species[]** — существующие в игре виды;
*	**speciesNameGenerFunction[]** — привязанные к видам генераторы имен;
*	**gender[]** — возможные варианты пола для специалистов (включая технические).
`,
		markdown:true,
		name:'Константы',
		id:'consts',
		next:'utils'
	},
	utils:{
		c:
`Доступны из объекта utils:

*	**pauseGame()** — приостанавливает игру (стакается);
*	**unpauseGame()** — возобновляет игру (стакается);
*	**changeSpeed(№ скорости)** — меняет скорость игры;
*	**saveWorld(тихо)** — пытается сохранить игру. Если подано с false, при ошибке будет уведомление;
*	**saveWorld2Url()** — сохраняет мир игру в ссылку;
*	**saveAndQuit()** — сохраняет и завершает игру;
*	**getTime(время) -> строка** — выдает строку с указанным временем в человекочитаемом виде;
*	**time2ms(Date) -> ms** — ;
*	**addNotify(тип сущности, № сущности, приоритет, текст)** — создает сообщение;
*	**getMessage(№ сообщения) -> сообщение** — ;
*	**getMessageFullText(№ сообщения) -> текст сообщения** — ;
*	**getSpecById(№ специалиста) -> специалист** — ;
*	**getTaskById(№ задачи) -> задача** — ;
*	**statsSum(специалист) -> int** — суммирует все 3 статы специалиста;
*	**levelAmplifier(специалист) -> float** — множитель стат на уровень.`,
		markdown:true,
		name:'Функции',
		id:'utils'
	}
},
multilevel:true,
markdown:true,
first:'consts',
name:'API',
id:'API'
};