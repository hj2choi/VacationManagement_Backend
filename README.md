## Project Description
사용한 기술 스택은 Node.js, Express, MongoDB 그리고 ejs입니다.<br><br>

모든 시간값은 Korea Standard Timezone (GMT+9h)에 맞추어 표기됩니다. (front-end와 back-end 사이의 일관성 있는 시간 계산을 위해 전용 wrapper class를 만들었습니다.)<br>
config/config.json 에서 session timeout (현재 6분), 매년 주어지는 총 연차 일수 등의 값을 설정할 수 있습니다.<br><br>


당일 연차는 취소할 수 없습니다. 그리고 새벽 00:00시에 그 날의 연차가 소모됩니다.<br>
이미 연차가 신청이 되어있는 날짜에 추가로 연차를 신청할 수 없습니다.<br><br>


로그인이 되어있는 유저가 직접 이용할 수 있는 페이지는 세 개 입니다.<br>
[/dashboard]      [/vacation/manage]    [/vacation/apply<br>]
세션이 없으면 아래의 페이지들 밖에 이용하지 못합니다.<br>
[/]           [/login]        [/register]<br>
미들웨어를 사용해서 로그인 여부에 따라 API를 포함한 모든 HTTP endpoint에 대한 접근권한이 결정되며, 자동으로 redirect됩니다.<br><br>


오로지 테스트를 위한 전용 페이지를 생성했습니다. 이 페이지에서 Authentication은 적용되지 않습니다.<br>
/demo_only/backdoor/<br>
여기에 들어가서 서버 내부 시간을 빨리감기 하며 테스트 할 수 있습니다.<br>
모든 사용자의 연차 일수를 초기화 시킬 수 있습니다.<br>
또한, raw 데이터베이스 정보를 볼 수 있습니다.<br>
config.json의 ENABLE_DEMO_ROUTES = false로 설정하면 관련 API과 백도어 기능을 전부 비활성화 시킬 수 있습니다.<br><br>


## Project Structure
src<br>
|   server.js   <i># App entry point</i><br>
|___config      <i># configurations</i><br>
|___models      <i># Database models</i><br>
|___public      <i># Publicly accessible directory (images, public filesystem, etc)</i><br>
|___routes      <i># Express route controllers for all the HTTP endpoints (Controller part in MVC)</i><br>
|___services    <i># All business logic (Model part in MVC)</i><br>
|___views       <i># front-end ejs pages (View part in MVC)</i><br>



## API specifications




## ISSUES and further Action Items
[Major issues]<br>
- 코드가 Dependency Hell에 빠지기 직전임. 해결 필요: 각각 service 모듈에 Dependency Injection & IOC? 사용 (예: Service Module이 직접 dependencies를 import하는 대신에 밖에서 constructor에 parameter 형태로 주입)
- 모든 API에서 제대로 규격화 된 HTTP 상태코드, 그리고 에러 메세지 전달. https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- 논리적인 결함: 연차 횟수를 내년까지 이월 가능함. 연차를 내년 일자로 신청하지 못하게 바꿔야함.
- 각각 service module에 대해 유닛테스트 작성

[Minor issues]<br>
- Dashboard, manageVacation 등의 페이지를 로딩할 때, controller에서 바로 데이터를 보내는 대신, GET api/v1/account/hjchoi, GET api/v1/vacations/all 같은 GET API를 따로 작성하는게 깔끔할것 같음.<br>
- async-await에서 try-catch 블록을 제대로 가져다가 붙여야함. (service단에서는 그저 throw만 하고 controller에 try catch 넣는게 더 깔끔하다는 얘기가 있음)<br>
- /vacation 모델에서 겹치는 날짜 체크하는 로직에 대한 최적화 가능한지 확인.
- 잠재적인 결함: 서버가 지속적으로 실행이 되지 않는 환경일 경우: 시간이 지난 vacation (days>1) 이 삭제되지 않는 경우가 발생할 수 있음.<br><br>








## 기술적 디데일 컨닝노트
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
salt is a random string. by using hash(password+salt), hash function is not predictable.
The same password will not yield the same hash.
No need to store salt in the DB, as it gets automatically included with the hash.




#### app.use(express.urlencoded({ extended: false }));
parse url_encoded data ex) localhost3000?person[name]=bobby&person[age]=3<br>
then, let us use that data in POST req.body<br>

extended:false => use query-string module instead of qs module<br>
qs library:          { person: { name: 'bobby', age: '3' } }<br>
querystring library: { 'person[age]': '3', 'person[name]': 'bobby' }<br><br>





#### package description:
nodemon: restart service automatically every time a change is made<br>
dotenv: .env file with all configurations<br>
passport: authentication library (can be used with facebook, google login etc)<br>
passport-local: authentication library for local login/register system<br>
express-session: manages authentication token (stored in Cookies. Used for keeping account alive through different pages)<br>
express-flash: displays pretty authentication messages. Internally used by passport.<br>
method-override: override API method, allow to use POST from HTML for delete API<br>
cron: job scheduler<br>



## 기술적인 궁금점
I don't know full inner-workings of passport. Session is stored in Cookies as encrypted auth token<br>
I don't know how salt works exactly. I just know that salt is a random string that doesn't need to be stored in DB<br>






## References:
https://developer.mozilla.org/en-US/docs/Web/HTTP/Status<br>
https://www.youtube.com/watch?v=-RCnNyD0L-s&ab_channel=WebDevSimplified<br>
https://www.youtube.com/watch?v=XlvsJLer_No&list=PLZlA0Gpn_vH8jbFkBjOuFjhxANC63OmXM&index=1&ab_channel=WebDevSimplified<br>
https://github.com/WebDevSimplified/Mybrary/tree/v1.2<br>
https://softwareontheroad.com/ideal-nodejs-project-structure/<br>





## 온라인 테스트 진행 방법
- 아래 테스트 내용을 확인하고, 코드를 작성해주세요.
- 테스트 결과물 제출은 Github에서 진행됩니다.
- master가 아닌 임의의 작업branch를 만들고, 작업branch에 commit해 주세요.
- 모든 작업이 완료되면 master브랜치로 머지하는 PullRequest를 만들어주세요.
- PullRequest생성까지 완료되었다면, HR담당자에게 알려주세요.


## 온라인 테스트 내용
아래 두가지 과제 중 한가지를 선택해서 구현해주세요.
- document-apporval
- <b>request-vacation</b>


주어진 요구 사항에 맞는 시스템을 만들 수 있는지 확인하기 위한 과제입니다.

만들어야 할 것은 휴가 신청 시스템입니다.

# 요구 사항
* 완전히 동작하는 웹 어플리케이션 또는 API 서버를 작성해주세요.
    * 웹 어플리케이션을 작성하는 경우 웹 UI는 평가대상이 아닙니다. CSS를 적용하지 않아도 됩니다.
    * API 서버를 작성하는 경우 일반적인 사용 시나리오에 대한 호출 순서를 스크립트로 작성해주세요.
        * 예) 휴가 취소: 로그인 API 호출 -> 목록 API 호출 -> 휴가 보기 API 호출 -> 휴가 취소 API 호출
* 데이터를 영구히 저장하기 위해 DBMS를 사용해주세요.
* 사용가능한 언어: JavaScript / TypeScript / Java / Kotlin

## 기능 명세
* 사용자 모델과 로그인 시스템이 필요합니다.
    * 가입 기능은 없어도 괜찮습니다.
* 사용자에게는 매년 15일의 연차가 부여됩니다.
* 사용자는 연차/반차(0.5일)/반반차(0.25일)에 해당하는 휴가를 신청할 수 있습니다.
* 휴가 신청시 시작일, 종료일(반차/반반차의 경우는 필요없음), 사용 일수, 코멘트(선택 항목)를 입력합니다.
    * 휴가 신청시 남은 연차를 표시합니다.
    * 연차를 모두 사용한 경우 휴가를 신청할 수 없습니다.
    * 추가 기능: 사용 일수를 입력하는 대신 시작일, 종료일을 가지고 공휴일을 제외하고 계산해도 됩니다.
* 아직 시작하지 않은 휴가는 취소할 수 있습니다.
