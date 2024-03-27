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

같은 맥락에서, GraphQL API는 Type의 집합이라고 생각하면 됩니다. 타입을 알려주지 않으면, 오류가 생길 겁니다.<br/>
**GraphQL에서의 query는, REST API의 Get Request를 만드는 것과 같다는 것을 명심해주세요**
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
#### SDL 등록이 의미하는바
```javascript
const typeDefs = gql`
    type Query {
        text: String
        hello: String
    }
`;
```
윗 내용은 REST API에서 GET url을 생성한 것과 같은 의미를 갖습니다.<br/>
**사용자가 요청할 수 있도록 하고 싶은 모든 것은 type "Query"안에 작성되어야합니다**<br/>
*기억하세요. Query라는 타입 안에 명시되어야 GET method를 수행하는 것과 같은 역할을 합니다*
```markdown
GET /text
GET /hello
```
윗 역할과 같은 것을 수행한다고 보시면 됩니다.

## Scalar Type
*GraphQL에 내장된 타입 : GraphQL 사용시, 기본 제공되는 타입입니다.*
* String
* Int
* Float
* Boolean
* ID
    * id값을 명시적으로 표시하기 위해 사용
    * 내부적으로는 String과 동일합니다
## Arguments
경로를 세분화하다보면, REST API의 /tweets/:id처럼 사용자의 id에 따라 달라지는 요청들이 있습니다.<br/>
이는, 명시적으로 적어주는 게 아닌, 동적으로 들어와야하는 값인데, 미리 설정할 수 있는 값이 아니다보니, Arguments로 넘겨줘야합니다(마치, 함수의 인자처럼).
```javascript
const typeDefs = gql`
    type User {
        id: ID
        username: String
    }
    type Tweet {
        id: ID
        text: String
        author: User
    }
    type Query {
        allTweets: [Tweet]
        // 여기 이 부분이 바로 Arguments에 해당합니다.
        tweet(id: ID): Tweet
    }
`;
```
## 어떤 식으로 사용하나요?
*arguments부분은 tweet(id: ${여기 이부분})에 해당합니다*
```javascript
// 아래 쿼리는 이것과 같습니다 : GET /api/.../tweet/:id
{
  allTweets {
    text
  }
  // 이렇게 id를 넣으면 :id 위치에 해당 숫자가 들어가는 셈이죠
  tweet(id: "1") {
    author {
      id
      username
    }
  }
}
```
> 이전까지는 **GraphQL에 type을 알려주는 법**에 대해 살펴봤습니다. 이제부터는 **Mutation Type**에 대해 살펴볼 예정입니다.

## Mutation Type
지금까지는 REST API에서의 GET method와 동일한 역할의 내용들을 살펴봤습니다.<br/>
Mutation Type은, 이전과는 달리 **POST 및 PUT, DELETE**과 같은, 서버측의 디비내용을 수정한다거나 새로 데이터를 추가하거나 하는 행위(Mutation)의 타입을 알려주는 겁니다.<br/>
자, 아까 타입 정의 코드에 추가해봅시다.
```javascript
const typeDefs = gql`
    type User {
        id: ID
        username: String
    }
    type Tweet {
        id: ID
        text: String
        author: User
    }
    type Query {
        allTweets: [Tweet]
        // 여기 이 부분이 바로 Arguments에 해당합니다.
        tweet(id: ID): Tweet
    }
    // this line
    type Mutation {
        postTweet(text: String, userId: ID): Tweet
        deleteTweet(id: ID): Boolean
    }
`;
```
### 그렇다면 어떻게 mutation을 사용하나요?
> 저는 아폴로 서버를 로컬에서 돌리고 있습니다.
```javascript
mutation {
    postTweet(text: "Hello, first tweet", userId: "1") {
        text
    }
}
```
이런 식으로 작성을 해주시면 됩니다.

## Non Nullable Fields
다음 타입 정의 스키마를 살펴봅시다.<br/>
```javascript
const typeDefs = gql`
    type User {
        id: ID
        username: String
    }
    type Tweet {
        id: ID
        text: String
        author: User
    }
    type Query {
        allTweets: [Tweet]
        tweet(id: ID): Tweet
    }
    type Mutation {
        postTweet(text: String, userId: ID): Tweet
        deleteTweet(id: ID): Boolean
    }
`;
```
우리(개발자들)는 데이터를 주고받을때, Null값에 대해 예민하게 생각합니다.<br/>
> Null값은 연산이 안 되기도 하고, 코드의 맥락을 파악하기도 쉽지 않기도 하고.. 다양한 문제들을 발생할 여지가 많습니다

서버와 통신을 해서 데이터를 얻어올 때, null값을 줄 가능성은 적지 않습니다. 그렇기에 우리는 이건 null값이면 안돼!라는 것을 명시해줄 필요가 있습니다<br/>
**그렇다면 어떻게 해야할까요?** 윗 코드를 변형하겠습니다.
```javascript
const typeDefs = gql`
    type User {
        id: ID!
        username: String!
    }
    type Tweet {
        id: ID!
        text: String!
        author: User!
    }
    type Query {
        // allTweets는 항상 배열을 반환해야합니다.
        // 그리고, Tweet!은 배열 내 원소가 있다면 원소의 타입은 항상 Tweet이어야한다.를 의미합니다.(원소가 없어도 괜찮음)
        allTweets: [Tweet!]!
        // 이상한 id(ex: "1111111")이면, 트윗이 없을 수도 있으니 nullable
        tweet(id: ID): Tweet
    }
    type Mutation {
        // arguments는 String과 ID을 사용, Tweet만을 반환
        postTweet(text: String!, userId: ID!): Tweet!
        // Boolean 값만을 반환
        deleteTweet(id: ID!): Boolean!
    }
`;
```
이렇게 **Scalar Type** 뒤에 "!"를 붙임으로써, 해당 데이터는 해당 타입만이어야한다라고 정의해주면 됩니다.