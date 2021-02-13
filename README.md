## Project Description







모든 시간값은 Korea Standard Timezone (GMT+9h)에 맞추어 표기됩니다.
Config




## Project Structure
src
|   server.js   # App entry point
|___config      # configurations
|___models      # Database models
|___public      # Publicly accessible directory (images, public filesystem, etc)
|___routes      # Express route controllers for all the HTTP endpoints (Controller part in MVC)
|___services    # All business logic (Model part in MVC)
|___views       # front-end ejs pages (View part in MVC)




## MongoDB Schema






## TODO
cannot cancel today's vacation
migrate all to DB


use cron job to remove all outdated vacations




[optional] vacation start date -> end date
[optional]
create api to increment server date
respond with proper HTML status code and error message
reset remaining vacation days to 15 at the start of every year





## ISSUES and further Action Items
[Major issues]
Dependency Hell 해결 필요: 각각 service 모듈에 Dependency Injection & IOC? 사용 (예: Service Module이 직접 dependencies를 import하는 대신에 밖에서 constructor에 parameter 형태로 주입)
각각 service module에 대해 유닛테스트 작성
모든 API에서 제대로 규격화 된 HTTP 상태코드, 그리고 에러 메세지 전달. https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
Dashboard, manageVacation 등의 페이지를 로딩할 때, controller에서 바로 데이터를 보내는 대신, GET api/v1/account/hjchoi, GET api/v1/vacations/all 같은 GET API를 따로 작성하는게 깔끔할것 같음.

[Minor issues]
유저 확인 로직을 좀더 정석적으로 username 대신 unique ID로 비교. 혹은, 더 secure한 방법이 있는지 확인 필요.
POST api/v1/vacation/new에서 잘못된 입력값 처리는 대부분 front-end에서 막아놓음. back-end단에서도 처리를 했지만, 구멍이 없는지 좀 더 체계적으로 확인이 필요함.
services/vacation 모델에서 겹치는 날짜 체크하는 로직에 대한 최적화 가능한지 확인.
change var to const for immutable stuff








## technical details
####node.js
operates on a single thread, using non-blocking I/O calls, allowing it to support thousands of simultaneous connections.
this makes nodejs extremely scalable and adaptable to any number of modules or user load.
pros: faster development time, productivity
pros: single thread, event driven and async. doesn't have to create new thread for every request.
cons: performance drop when handling heavy computing tasks
cons: unstable API, possible lack of library support



####node.js threadpool:
fixed number of threads are created as soon as node app starts.
all incoming requests are placed in a queue.
Then, any free thread in the pool handles the request.



####Promise:
proxy for a value not necessarily known when the promise is created.
Allows you to associate handlers with async action's eventual success value or failure reason.
states => pending, fulfilled, rejected



####How to avoid callback hell:
use promises
use async/await



####password encryption Salt:
salt is a random string. by using hash(password+salt), hash function is not predictable.
The same password will not yield the same hash.
No need to store salt in the DB, as it gets automatically included with the hash.




####app.use(express.urlencoded({ extended: false }));
parse url_encoded data ex) localhost3000?person[name]=bobby&person[age]=3
then, let us use that data in POST req.body

extended:false => use query-string module instead of qs module
qs library:          { person: { name: 'bobby', age: '3' } }
querystring library: { 'person[age]': '3', 'person[name]': 'bobby' }





#### package description:
nodemon: restart service automatically every time a change is made
dotenv: .env file with all configurations
passport: authentication library (can be used with facebook, google login etc)
passport-local: authentication library for local login/register system
express-session: manages authentication token (temporary token with timeout variable. Used for keeping account alive through different pages)
express-flash: displays pretty authentication messages. Internally used by passport.
method-override: override API method, allow to use POST from HTML for delete API




## questions:
are modules (require("module")) designed in singleton pattern?
I don't know full inner-workings of passport. Session is stored in Cookies as encrypted auth token
I don't know how salt works exactly. I just know that salt is a random string that doesn't need to be stored in DB






## References:
https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
https://www.youtube.com/watch?v=-RCnNyD0L-s&ab_channel=WebDevSimplified
https://github.com/WebDevSimplified/Mybrary/tree/v1.2
https://softwareontheroad.com/ideal-nodejs-project-structure/


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
