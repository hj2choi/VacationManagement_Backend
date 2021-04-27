## Project Description
Application Link (Herokuapp + MongoLAB):<br>
https://employee-vacation-manager.herokuapp.com/dashboard

사용한 기술 스택은 <b>Node.js, Express, MongoDB</b> 그리고 <b>ejs</b>입니다. (Angular 없는 MEAN Stack)<br><br>

모든 시간값은 Korea Standard Timezone (GMT+9h)에 맞추어 표기됩니다. (front-end와 back-end 사이의 일관성 있는 시간 계산을 위해 전용 wrapper class를 만들었습니다.)<br>
<b>config/config.json</b> 에서 session timeout (현재 6분), 매년 주어지는 총 연차 일수 등의 값을 설정할 수 있습니다.<br><br>


당일 연차는 취소할 수 없습니다. 그리고 새벽 00:00시에 그 날의 연차가 소모됩니다.<br>
이미 연차가 신청이 되어있는 날짜에 추가로 연차를 신청할 수 없습니다.<br><br>


로그인이 되어있는 유저가 직접 이용할 수 있는 페이지는 세 개 입니다.<br>
<i>[/dashboard]      [/vacation/manage]    [/vacation/apply]</i><br>
세션이 없으면 아래의 페이지들 밖에 이용하지 못합니다.<br>
<i>[/]           [/login]        [/register]</i><br>
예외적으로 <i>[/account/:id]</i>는 세션에 관계없이 누구나 볼 수 있습니다.<br>
<b>미들웨어</b>를 사용해서 로그인 여부에 따라 API를 포함한 모든 HTTP endpoint에 대한 접근권한이 결정되며, 자동으로 redirect됩니다.<br><br>


<b>오로지 테스트를 위한 전용 페이지</b>를 생성했습니다. 이 페이지에서 Authentication은 적용되지 않습니다.<br>
<i>config.json의 ENABLE_DEMO_ROUTES = false</i>로 설정하면 관련 API과 백도어 기능을 전부 비활성화 시킬 수 있습니다.<br>
<b>/demo_only/backdoor/</b><br>
여기에 들어가서 서버 내부 시간을 빨리감기 하며 테스트 할 수 있습니다.<br>
모든 사용자의 연차 일수를 초기화 시킬 수 있습니다.<br>
또한, raw 데이터베이스 정보를 전부 볼 수 있습니다.<br>


## Project Structure
src<br>
|   server.js   <sub><i># App entry point</i></sub><br>
|___config      <sub><i># configurations</i></sub><br>
|___models      <sub><i># Database models</i></sub><br>
|___public     <sub><i># Publicly accessible directory (images, public filesystem, etc)</i></sub><br>
|___routes      <sub><i># Express route controllers for all the HTTP endpoints (Controller part in MVC)</i></sub><br>
|___services    <sub><i># All business logic (Model part in MVC)</i></sub><br>
|___views       <sub><i># front-end ejs pages (View part in MVC)</i></sub><br>


## API specifications
### Account
| TYPE  | HTTP ENDPOINT URI | REQUSET | RESPONSE | REMARKS |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| GET  | /api/v1/account/all  | - | all accounts JSON | unused |
| GET  | /api/v1/account/all/on_vacation  | - | all accounts currently on vacation| unused |
| GET  | /api/v1/account/[id]  | - | single account JSON | unused |
| GET  | /api/v1/account/name/[name]  | - | single account JSON| unused |
| POST  | /api/v1/account/login  | name, password | authentication token | |
| POST  | /api/v1/account/register  | name, email, password | - | |
| DELETE  | /api/v1/account/logout  | authentication token | - | |

### Vacation
| TYPE  | HTTP ENDPOINT URI | REQUSET | RESPONSE | REMARKS |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| GET  | /api/v1/vacation/[id]  | - | vacation | unused |
| GET  | /api/v1/vacation/user/[id]  | - | list of vacations |  unused |
| POST  | /api/v1/vacation/new  | mode, startdate, days, comment, auth | - | |
| DELETE  | /api/v1/vacation/cancel  | id, authentication token | - | |

### DEMO_ONLY (_DEV 내부용 API)
| TYPE  | HTTP ENDPOINT URI | REQUSET | RESPONSE | REMARKS |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| PUT  | /demo_only/increment_servertime  | - | - | increment by 1 day |
| PUT  | /demo_only/reset_dateoffset  | - | - | reset server time day offset |
| PUT  | /demo_only/reset_user_remainingvacation  | - | - | reset to config.YEARLY_VACATION_DAYS (15)|

## ISSUES and further Action Items
<b>[Major issues]</b><br>
- <b>[MongoDB NoSQL 관련 Issue]</b> 커다란 결함 발견. NoSQL에는 Transaction이 없기 때문에 apply for vacation 버튼을 빠르게 두번 클릭하면 하루에 연차가 두번 써짐.
- 코드가 Dependency Hell에 빠지기 직전임. 해결 필요: 각각 service 모듈에 Dependency Injection & IOC? 사용 (예: Service Module이 직접 dependencies를 import하는 대신에 밖에서 constructor에 parameter 형태로 주입)
- 모든 API에서 제대로 규격화 된 HTTP 상태코드, 그리고 에러 메세지 전달. input과 output을 일관된 구조로 구성해야 함. https://developer.mozilla.org/en-US/docs/Web/HTTP/Statusd
- 1월 1일 연차 횟수 초기화와 관련한 논리적인 결함: 현재로서는 연차를 내년 일자로 신청이 가능함. 수정 필요.
- Timezone 로직: UTC+9로 표기되지만 실제 timestamp데이터는 frontend & backend 통틀어 UTC+0으로 관리되는지 제대로 확인해야함. 그리고 config를 통해서 한번에 관리할 수 있도록 refactor.

<b>[Minor issues]</b><br>
- Dashboard, manageVacation 등의 페이지를 로딩할 때, controller에서 바로 데이터를 보내는 대신, GET api/v1/account/hjchoi, GET api/v1/vacations/all 같은 GET API에서 따로 데이터를 불러오게 하는게 속도는 느리지만 코드는 깔끔할것 같음.<br>
- async-await에서 try-catch 블록을 제대로 가져다가 붙여야함. (service단에서는 그저 throw만 하고 controller에 try catch 넣는게 더 깔끔하다는 얘기가 있음, 혹은 Express()가 알아서 예외처리해주길 기다리는것도 방법...)<br>
- /vacation 모델에서 겹치는 날짜 체크하는 로직에 대한 최적화 가능한지 확인.
- 잠재적인 결함: 서버가 지속적으로 실행이 되지 않는 환경일 경우: 철 지난 vacation (days>1) 이 자동으로 삭제되지 않음.<br><br>
- Username, Password에 대해 길이제한 등 걸어야함.

<b>[TODO]</b><br>
- 연차를 소모한 이후에 DB에서 삭제하는 대신 History로 남겨두게끔 수정
- 각각 service module에 대해 유닛테스트 작성
- ADMIN 계정 다시 생성 후 admin route 작성
- Google Calendar API 사용해서 공휴일 정보 받아오기. 그 후, 시작일, 종료일을 가지고 공휴일+주말을 제외하고 계산해보기.





## 기술적인 궁금점
- [passport] 구조를 아직 완전히 파악하지 못함. Session is stored in Cookies as encrypted auth token<br>
- [Salt] Salt값을 직접 다뤄본 적이 없어서 왜 salt가 DB에 저장될 필요가 없는지 모르겠음. <br>
- [네트워크 보안] HTTPS 대신 HTTP를 사용하면 password나 authentication token같은 민감한 정보들이 그대로 네트워크에 노출이 되는게 맞는지 확인하고 싶음.
- [대용량 트래픽, 대규모 유저 시스템] 요새는 AWS가 다 해준다고는 하지만, 대용량 트래픽과 storage를 다룰 때 어떻게 load-balancing & distribution이 되는지 궁금함.
- [대용량 트래픽, 대규모 유저 시스템] CD/CI (Continuous Deployment & Continuous Integration)
- [Javascript singleThread] UI는 무조건 Main thread 위에서 돌아가야 한다고 들었는데, 그 이유를 까먹음. (ront-end javascript가 singlethread로 구동되는 이유와 비슷하다고 알고 있음)
- [Concurrency] javascript async 함수들이 언어 내부적으로 정확히 어떻게 구현되어있는지 궁금함. (C로 짠다면 어떻게 구현할까? main event loop? event listeners? job scheduling?)


## 기술적 디테일 정리노트
#### node.js
operates on a single thread, using non-blocking I/O calls, allowing it to support thousands of simultaneous connections.<br>
this makes nodejs extremely scalable and adaptable to any number of modules or user load.<br>
pros: faster development time, productivity<br>
pros: single thread, event driven and async. doesn't have to create new thread for every request.<br>
cons: performance drop when handling heavy computing tasks<br>
cons: unstable API, possible lack of library support<br>



#### node.js threadpool:
fixed number of threads are created as soon as node app starts.<br>
all incoming requests are placed in a queue.<br>
Then, any free thread in the pool handles the request.<br>



#### Promise:
proxy for a value not necessarily known when the promise is created.
Allows you to associate handlers with async action's eventual success value or failure reason.
states => pending, fulfilled, rejected



#### How to avoid callback hell:
use promises<br>
use async/await



#### password encryption Salt:
salt is a random string. by using hash(password+salt), hash function is not predictable.<br>
The same password will not yield the same hash.<br>
No need to store salt in the DB, as it gets automatically included with the hash.<br>




#### app.use(express.urlencoded({ extended: false }));
parse url_encoded data ex) localhost3000?person[name]=bobby&person[age]=3<br>
then, let us use that data in POST req.body<br><br>

extended:false => use query-string module instead of qs module<br>
qs library:          { person: { name: 'bobby', age: '3' } }<br>
querystring library: { 'person[age]': '3', 'person[name]': 'bobby' }<br><br>





#### package description:
- nodemon: restart service automatically every time a change is made
- dotenv: .env file with all configurations
- passport: authentication library (can be used with facebook, google login etc)
- passport-local: authentication library for local login/register system
- express-session: manages authentication token (stored in Cookies. Used for keeping account alive through different pages)
- express-flash: displays pretty authentication messages. Internally used by passport.
- method-override: override API method, allow to use POST from HTML for delete API
- cron: job scheduler



## References:
HTML_runtimeLogger.js (Author: hjchoi (2016))<br>
https://stackoverflow.com/<br>
https://namu.wiki/w/Node.js?from=Nodejs<br>
https://www.w3schools.com/<br>
https://mongoosejs.com/docs/<br>
https://www.youtube.com/watch?v=-RCnNyD0L-s&ab_channel=WebDevSimplified<br>
https://www.youtube.com/watch?v=XlvsJLer_No&list=PLZlA0Gpn_vH8jbFkBjOuFjhxANC63OmXM&index=1&ab_channel=WebDevSimplified<br>
https://github.com/WebDevSimplified/Mybrary/tree/v1.2<br>
https://softwareontheroad.com/ideal-nodejs-project-structure/<br>
https://developer.mozilla.org/en-US/docs/Web/HTTP/Status<br>
