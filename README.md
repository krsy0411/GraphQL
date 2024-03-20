# GraphQL에 대해서 학습하는 공간입니다.
*GrqphQL은 REST API의 문제점을 개선하기 위해 탄생했습니다*<br/>
GraphQL은 **쿼리 언어**로, 특정 프로그래밍 언어를 사용해야 활용할 수 있는 기능이 아닙니다. 파이썬, 자바스크립트, 루비, PHP 등 어떤 언어를 사용하더라도 사용할 수 있습니다.<br/>

이는, *GraphQL은 하나의 아이디어*이기 때문입니다<br/>
> 우리가 영어로 써진 C프로그래밍 책을 번역한 책을 본다고 해서, C프로그래밍에 대한 내용이 변하는게 아닙니다. 그냥 사용하는 언어가 달라졌을 뿐

## GraphQL은 REST API의 어떤 점을 개선했을까?
### 1. Over Fetching
우리가 현재 상영중인 영화 정보를 보여주는 사이드 프로젝트를 진행한다고 떠올려보면,
우리가 필요하지 않는 데이터마저 전부 넘어온다는 것을 알 수 있습니다(제작일, 관객수 같이 활용하지 않을 정보들).<br/>
우리가 영화 각각의 정보에서, 제목+포스터 이미지만 필요하다면, REST API는 GET요청을 보내면 모든 정보를 어쩔 수 없이 다 가져오는 대신에 GraphQL은 제목과 포스터 이미지만 보내주는거죠.
> 굳이라고 생각할 수도 있지만, 데이터가 만약 몇 천 만개라고 생각하면, 딜레이가 안 생길 수가 없습니다.

### 2. Under Fetching
Under Fetching은,
백엔드 개발자가 좀 더 데이터를 세분화해서 저장하기 위해서 REST API의 Request URL을 여러 개로 쪼개놨을 경우에 발생할 수 있습니다.<br/>
유저 정보들로부터 특정 유저의 정보까지도 얻고자 할때,
```json
{
    "persons": [
        "1": {
            "name": "이시영",
            "location: 1,
            "age": 20
        },
        "2": {
            "name": "김민주",
            "location": 5,
            "age": 20
        }
    ]
}
```
이라는 데이터가 넘어온다고 생각해봐요<br/>
여기서 우리가 집 주소까지도 알고 싶은데, 백에서 좀 더 세분화해서
```json
{
    "1": "서울특별시",
    "2": "인천광역시",
    ...,
    "5": "대구광역시"
}
```
로 설정해뒀다고 생각해보시면, 우리는 persons(배열을 넘겨주는) url을 한 번 호출해주고, location key값의 숫자값을 통해서 다시 location정보의 url을 한 번 호출해줘서 찾아야합니다.
이런 두 번의 귀찮은 과정을, GraphQL은 한 번의 호출로 해결할 수 있도록 도와줍니다.
위의 일련의 과정, 정보를 덜 받는 바람에 굳이 몇 번 더 호출해야할때를 under-fetching이라고 하는겁니다.

## Apollo Server
GraphQL은 이전에 봤듯이, Specification(명세서, 문서)에 해당할 뿐입니다.<br/>
우리가 GraphQL을 사용하려면 해당 명세를 바탕으로 코드로 구현을 해야하는데, 이를 해놓은게 **Apollo Server**입니다(NodeJS server같은 것)<br/>
Apollo Server는 그 자체로도 서버가 동작하기에 매우 좋고, Express, Fastify같은 NodeJS middleware가 있는 경우(NodeJS Backend)에도 Apollo Server를 최상단에 추가할 수 있습니다.

> 예를 들어, Express로 만들어진 REST API가 있다고 가정했을 경우에 REST API를 GraphQL API로 바꾸고 싶다면, server를 많이 변경 안 하고 그저 미들웨어만 넣어주면 됩니다.

## Query Type
REST API은 URL의 집합입니다.
> /users/:id<br/>
> /features/:id

같은 맥락에서, GraphQL API는 Type의 집합이라고 생각하면 됩니다. 타입을 알려주지 않으면, 오류가 생길 겁니다.
> GraphQL server에게 서버에 있는 데이터들의 타입을 미리 설명해줘야합니다.
### Schema(스키마)
관계형 데이터 베이스의 스키마를 떠올리면 됩니다.<br/>
마찬가지로, 데이터의 shape을 알려줘야합니다.<br/>
> 어쩌면 불편하다고 생각할 수 있지만, 안정성 면에서 나쁘지 않으며, 덕분에 어떤 데이터들이 들어오는지 auto-complete를 통해 편하게 알 수도 있기도 합니다.
```javascript
// 스키마 사용방식은 다음과 같습니다.
// ``(백틱 : 오직 백틱만 쓰셔야 합니다)사이에 모든 내용이 들어가게 됩니다. 이는 SDL(Schema Definition Language)라고 부릅니다.
const typeDefs = gql`<이 곳>`
```