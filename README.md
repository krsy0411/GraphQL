# GraphQL에 대해서 학습하는 공간입니다.
*GrqphQL은 REST API의 문제점을 개선하기 위해 탄생했습니다*<br/>
GraphQL은 **쿼리 언어**로, 특정 프로그래밍 언어를 사용해야 활용할 수 있는 기능이 아닙니다. 파이썬, 자바스크립트, 루비, PHP 등 어떤 언어를 사용하더라도 사용할 수 있습니다.<br/>

이는, *GraphQL은 하나의 아이디어*이기 때문입니다<br/>
> 🥕  우리가 영어로 써진 C프로그래밍 책을 번역한 책을 본다고 해서, C프로그래밍에 대한 내용이 변하는게 아닙니다. 그냥 사용하는 언어가 달라졌을 뿐

### Apollo Server
GraphQL은 이전에 봤듯이, Specification(명세서, 문서)에 해당할 뿐입니다.<br/>
우리가 GraphQL을 사용하려면 해당 명세를 바탕으로 코드로 구현을 해야하는데, 이를 해놓은게 **Apollo Server**입니다(NodeJS server같은 것)<br/>
Apollo Server는 그 자체로도 서버가 동작하기에 매우 좋고, Express, Fastify같은 NodeJS middleware가 있는 경우(NodeJS Backend)에도 Apollo Server를 최상단에 추가할 수 있습니다.
> 🥕  예를 들어, Express로 만들어진 REST API가 있다고 가정했을 경우에 REST API를 GraphQL API로 바꾸고 싶다면, server를 많이 변경 안 하고 그저 미들웨어만 넣어주면 됩니다.

## GraphQL은 REST API의 어떤 점을 개선했을까?
### 1. Over Fetching
우리가 현재 상영중인 영화 정보를 보여주는 사이드 프로젝트를 진행한다고 떠올려보면,
우리가 필요하지 않는 데이터마저 전부 넘어온다는 것을 알 수 있습니다(제작일, 관객수 같이 활용하지 않을 정보들).<br/>
우리가 영화 각각의 정보에서, 제목+포스터 이미지만 필요하다면, REST API는 GET요청을 보내면 모든 정보를 어쩔 수 없이 다 가져오는 반면에 GraphQL은 제목과 포스터 이미지만 보내주는거죠.
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
            "location": 1,
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
> 🥕  어쩌면 불편하다고 생각할 수 있지만, 안정성 면에서 나쁘지 않으며, 덕분에 어떤 데이터들이 들어오는지 auto-complete를 통해 편하게 알 수도 있기도 합니다.
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
> 🥕  이전까지는 **GraphQL에 type을 알려주는 법**에 대해 살펴봤습니다. 이제부터는 **Mutation Type**에 대해 살펴볼 예정입니다.

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
> 🥕  저는 아폴로 서버를 로컬에서 돌리고 있습니다.
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
> 🥕  Null값은 연산이 안 되기도 하고, 코드의 맥락을 파악하기도 쉽지 않기도 하고.. 다양한 문제들을 발생할 여지가 많습니다

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

##  Query Resolvers
우리는 방금까지 다음과 같은 스키마를 작성했습니다.<br>
*지금까지는 Query Language로써 어느 언어에서도 이해할 수 있는 내용입니다(물론 변수 선언이나 라이브러리 호출 면에서는 좀 다른 형태일지 몰라도 말이죠)*<br>
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
        allTweets: [Tweet!]!
        tweet(id: ID): Tweet
    }
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`;
```
**이제부터 작성할 Resolver라는 로직은, 어떤 언어를 사용할 것인지에 따라 조금 달라질 수 있습니다(여기선 NodeJS 사용)**
> 우선, *resolver안의 변수명*은 *스키마를 작성할 당시의 변수이름*과 **반드시** 동일해야합니다. GraphQL은 <u>*사용자가 Query type의 tweet field를 호출해서 하나의 트윗내용을 알아내고자 하는 경우에 resolvers의 Query로 들어가서 해당 field를 호출하는 방식*</u>이기 때문입니다.
> > 그렇다는 건, 리턴 타입이 스키마에 작성된 스키마와 동일해야겠죠? 우리는 Query타입안에 tweet호출에 대해서는 null or Tweet 타입을 반환(Nullable Type이므로)하도록 되어있습니다. 그러니까 resolvers의 tweet field는 null or Tweet 타입을 반환해줘야 합니다.
```javascript
const resolvers = {
    Query: {
        tweet() {
            console.log("I'm called");
            // 혹은 Tweet타입의 값을 반환해줘야합니다.
            return null;
        }
    }
}
```
원래는 DB와 연동해서 데이터를 가져오고 그래야하지만, 지금은 그냥 메모리상의 데이터로 설정해서 사용하겠습니다.
```javascript
// 임시 사용(휘발성) 데이터
const tweets = [
    {
        id: "1",
        text: "first one"
    },
    {
        id: "2",
        text: "second one"
    }
];

const resolvers = {
    Query: {
        // 임시 데이터를 반환 : 원래라면, DB로부터 데이터를 가져오는 형태여야함
        allTweets() {
            return tweets;
        }
        tweet() {
            console.log("I'm called");
            // 혹은 Tweet타입의 값을 반환해줘야합니다.
            return null;
        }
    }
}
```
로컬 서버를 실행해서 아폴로 스튜디오에서 allTweets를 실행해보시면, 
    {
        id: "1",
        text: "first one"
    },
    {
        id: "2",
        text: "second one"
    }
<< 해당 구조로 반환한다는 것을 알 수 있습니다.
> 🥕 좀 전에 얘기했다시피 사용자가 Query type 내 allTweets field를 호출하면, GraphQL은 resolver 로직에서 Query type 내 allTweets의 이름을 가진 함수를 찾아가고, 해당 함수 내의 처리 이후 리턴값을 가져다준다의 동작 방식입니다

### arguments
그럼 이번엔 인자가 있는 필드 내용도 살펴보겠습니다.
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
        allTweets: [Tweet!]!
        tweet(id: ID): Tweet
    }
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`;

const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        }
        // resolvers function은 아폴로 서버가 해당 함수를 호출할때, 실은 어떤 arguments를 줍니다.
        tweet(root, args) {
            console.log(args);
            return null;
        }
    }
}
```
다시 로컬서버 아폴로 스튜디오에서 <u>tweets("1")</u>과 같이 인자값을 전달하고 실행하면, 리턴값은 null이지만 터미널의 콘솔창에는 **{ id: '1' }** 이라고 표시됩니다.<br>
> 🥕 유저가 arguments를 줄때, 해당 arguments를 resolver function의 2번째 argument가 된다는 사실을 기억해주시면 될 것 같습니다. **query나 mutation에서 유저가 보낸 argument!**<br>
(root인자에 대해선 좀 더 이후에 얘기해볼게요)

여기서 한 단계 발전시켜봅시다. 객체구조분해할당을 사용해볼게요.
```javascript
// 임시 사용(휘발성) 데이터
const tweets = [
    {
        id: "1",
        text: "first one"
    },
    {
        id: "2",
        text: "second one"
    }
];

const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        }
        // 객체구조분해할당을 통해, 인자 내용 중 id값을 변수로 들고옵니다.
        tweet(root, { id }) {
            // 원래라면, DB에 접근해서 어떤 SQL 코드를 실행해야합니다만, 여기선 그냥 find를 사용할게요
            return tweets.find(tweet => tweet.id === id) || null;
        }
    }
};
```
방금까진 Query type의 필드 내용을 이용해서 데이터를 GET해오는 것에 대해서 알아봤는데요. 이젠 유저가 데이터를 변경하고 싶은(DELETE, PUT, POST...) 경우의 Mutation type에 대한 resolver를 생성할 것 입니다.

## Mutation Resolvers
```javascript
// 임시 사용(휘발성) 데이터
const tweets = [
    {
        id: "1",
        text: "first one"
    },
    {
        id: "2",
        text: "second one"
    }
];

const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        }
        // 객체구조분해할당을 통해, 인자 내용 중 id값을 변수로 들고옵니다.
        tweet(root, { id }) {
            // 원래라면, DB에 접근해서 어떤 SQL 코드를 실행해야합니다만, 여기선 그냥 find를 사용할게요
            return tweets.find(tweet => tweet.id === id) || null;
        }
    }
    Mutation: {
        postTweet(_, { text, userId }) {
            // 새 트윗을 만들어서 tweets 데이터에 추가
            // 실제로는 DB에 접근해서 어떤 SQL 코드를 실행해야합니다만, 여기선 그냥 push method를 사용합니다.
            const newTweet = {
                id: tweets.length + 1,
                text,
            }
            tweets.push(newTweet);
            
            return newTweet;
        }
    }
};
```
> 🥕 항상 명심해아할 것은, **resolver function의 인자 순서는 root, argument이다!**

실행해보시면, postTweet의 인자에 userid, text를 잘 작성해주면 응답이 잘 나옵니다.<br>
물론, 우리가 tweets 변수에 push를 했기에, allTweets를 실행해보시면, 여러분(유저)이 postTweet한 내용들이 잘 리턴됩니다.<br>
*하지만, DB에 저장했다거나 그런 데이터가 아닌, 그저 메모리상에 데이터를 잠시 넣어둔거라서, 새로고침하면 postTweet의 내용은 날아갑니다.*

##### 그럼 이번엔 delete field를 구현해볼까요?
```javascript
// 임시 사용(휘발성) 데이터
const tweets = [
    {
        id: "1",
        text: "first one"
    },
    {
        id: "2",
        text: "second one"
    }
];

const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        }
        // 객체구조분해할당을 통해, 인자 내용 중 id값을 변수로 들고옵니다.
        tweet(root, { id }) {
            // 원래라면, DB에 접근해서 어떤 SQL 코드를 실행해야합니다만, 여기선 그냥 find를 사용할게요
            return tweets.find(tweet => tweet.id === id) || null;
        }
    }
    Mutation: {
        postTweet(_, { text, userId }) {
            // 새 트윗을 만들어서 tweets 데이터에 추가
            // 실제로는 DB에 접근해서 어떤 SQL 코드를 실행해야합니다만, 여기선 그냥 push method를 사용합니다.
            const newTweet = {
                id: tweets.length + 1,
                text,
            }
            tweets.push(newTweet);
            
            return newTweet;
        },
        deleteTweet(_, { id }) {
            const tweet = tweets.find(tweet => tweet.id === id);

            if(!tweet) {
                return false;
            }

            tweets = tweets.filter(tweet => tweet.id !== id);
            
            return true;
        }
    }
};
```
deleteTweet을 구현해봤습니다. 로컬서버 아폴로 스튜디오에서 deleteTweet의 인자 id를 잘 넣어서 실행해보면 응답으로 tweet 하나가 없어졌다는 것을 확인해볼 수 있습니다.

## Type Resolvers