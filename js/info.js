/*> по логике - обрезанного, так как duration для полного нельзя установить‏
Да, duration - значение с геттером/сеттером, которое отображает/устанавливает длительность трека в данный момент

> [понедельник, 21 октября 2013 г. 17:39:27 Роман Моторин] Ребят, кому не влом, направьте, что почитать о том, как хранить видео локально в браузере. Первый раз сталкиваюсь и накопать не могу. 

HTML 5 file api
[21.10.2013 17:40:42] igooor2010: загружаешь в браузер и можешь хранить его например в localstorage или в памяти
[21.10.2013 17:40:45] igooor2010: как удобней

> offset получается тоже у вырезанного куска трэка? Если так, то его значение устанавливается/отображается от начала создаваемого ролика или от начала редактируемой дорожки?
offset - "смещение" файла в секундах от начала всего проекта (ролика)

каждый файл обрезается только в конце соответственно duration, так как начало может быть просто "задвинуто" под предыдущий ролик без какого-либо эфекта перехода.

Еще раз: внешнее API - не ограничение, а только _минимальный_ интерфейс, который должен быть доступен _извне_. Части задания, которые не покрыты _минимальным_ интерфейсом (нет методов, пропертей и т.д.) все так же подлежат реализации, просто не обязательны к экспорту.

да, Track - описание "класса" который доступен через TimeLine.Track. все остальные вопросы или автоматически решаются из этого ответа, или относятся к реализации, которая, естественно, обьясняться не будет.
[21.10.2013 20:28:24] Роман Моторин: Т.е. Track должен быть и от него нужно наследоваться?
[21.10.2013 20:29:07] Ingvar Stepanyan: Естественно, если в задании указано, что он должен быть, то он должен быть.*/

/*[18:26:00] Ingvar Stepanyan: каждый файл обрезается только в конце соответственно duration, так как начало может быть просто "задвинуто" под предыдущий ролик без какого-либо эфекта перехода.*/

/*Если сделаете обрезку еще и с начала, мы только за. Вопрос был о требованиях к интерфейсу, но он, как уже говорилось, _минимальный_ и не отражает всех приведенных заданий.*/