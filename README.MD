![Логотип NSUTASK](logotyp.jpg)

**NSUTASK** — это простая в настройке и использовании self-hosted веб канбан-доска для организации учебного процесса, где преподаватели в формате карточек до некторого срока могут создавать задачи, а ученики — легко отправлять свои решения на проверку.



## Установка и запуск

0. NSUTASK написан на **Node.JS**, поэтому перед запуском н ужно сперва его установить (справедливо):
```
sudo apt install nodejs npm -y
```
1. Клонируйте репозиторий и перейдите в него:
```
git clone git@github.com:NSUTASK/NSUTASK.git
```
2. Установите зависимости, также желательно поставить Nodemon для упрощения отладки:
```
npm i
npm i nodemon
```
3. Наконец, запустите и перейдите на `localhost:<ПОРТ>` для начала работы:
```
npm run test # <-- запуск под Nodemon
# ИЛИ
npm run serve # <-- запуск под Node
```
4. Для удобной отладки API можно использовать [**Insomnia**](https://insomnia.rest/download).
Файл с конфигурациями лежит в корне этого репозитория (`Insomnia_<ДАТА>.json`), для импорта нужно выбрать *Use the local Scratch Pad*, затем тыкнуть по *Scratch Pad* слева сверху и выбрать *Import*.



## Документация АРІ

### Users
- **`login`** — 
- **`register`** — 
- **`getUsers`** — 
- **`getUser`** — 
- **`findUsers`** — 

### Boards
- **`getUserBoards`** — 
- **`getBoardInfo`** — 
- **`createBoard`** — 
- **`editBoardInfo`** — 
- **`deleteBoard`** — 
- **`getMembers`** — 
- **`addMember`** — 
- **`deleteMember`** — 

### Tasks
- **`getBoardTasks`** — 
- **`getTaskInfo`** — 
- **`createTask`** — 
- **`editTaskInfo`** — 
- **`deleteTask`** — 

### Submits
- **`getSubmitInfo`** — 
- **`createSubmit`** — 
- **`deleteSubmit`** — 
- **`getTaskSubmits`** — 
- **`setSubmitStatus`** — 
