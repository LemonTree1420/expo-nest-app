# Expo-Nestjs-app

mobile application

- front-end : Expo
- back-end  : NestJs
- database  : MongoDB

# react-native

- react-native는 flutter와 함께 가장 많이 쓰이는 모바일 개발 언어이다.
- 주로 facebook, instagram 등이 react-native로 개발되었다.
- react-native는 javascript, css 코드 뿐만 아니라 각 운영체제와 연결되는 bridge들을 포함한 infra로 구성된 것이다.
- react-native는 쉽게 예를 들어 번역을 하는 것으로, javascript를 각 naitve(android, ios)로 요청을 보내준다.
- 배포를 위해 준비해야 될 사항들이 많다. (android는 java, android studio sdk가 필요하고 ios의 경우 xcode가 필요하다.)
- 이를 간단하게 모든 infra를 구성하고, javascript, css 부분 만을 추가하여 테스트 할 수 있게끔 지원해주는 툴이 expo이다.

---

## react-native expo

1. 설치
   <pre><code>npm i --global expo-cli</code></pre>
   ios)
   <pre><code>brew install watchman</code></pre>
2. 어플 다운로드
   - play store에서 expo 앱 다운로드
   - 계정 회원가입 및 필요한 추가 설정 진행
3. expo project 설치
   - expo init 프로젝트명
4. 실행
   - npm run start
   - expo login
   - expo 어플에서 qr코드 스캔
   - 유의 사항은 expo가 도는 host와 휴대폰 어플에 잡힌 host가 같아야 한다.
   - 다르게 실행할 경우, npm run start --tunnel

- snack.expo.dev

---

## 화면 구현

- Component
  : 화면에 렌더링할 항목

1. View
   - 일반적인 html의 div 태그
2. Text
   - p, span 과 같은 태그

---

## NativeWind 적용

1. npm 다운로드
<pre><code>yarn add nativewind</code></pre>
2. 개발용 npm 다운로드
<pre><code>yarn add -D tailwindcss</code></pre>
3. tailwindcss config 파일 생성
<pre><code>npx tailwindcss init</code></pre>
4. 생성된 tailwind.config.js 파일 수정
<pre><code>content: ["./App.{js,jsx,ts,tsx}", "./<custom directory>/**/*.{js,jsx,ts,tsx}"],</code></pre>
5. 기존 babel.config.js에 내용 추가
<pre><code>plugins: ["nativewind/babel"],</code></pre>
6. typescript를 사용할 경우, app.d.ts 파일 생성 후 아래 내용 추가

   `/// <reference types="nativewind/types" />`

7. 그 후, 원하는 css를 className에 선언하여 사용하면 된다.

## Navigation(페이지 전환)

1. npm 설치
<pre><code>npm install @react-navigation/native @react-navigation/native-stack</code></pre>
2. expo인 경우 추가 설치
<pre><code>npx expo install react-native-screens react-native-safe-area-context</code></pre>
3. navigation 파일 생성
4. App.tsx 파일 수정
5. 원하는 디렉토리에 컴포넌트 생성
6. 각 컴포넌트에서 navigation props를 통해 페이지 전환

Screen으로 만든 화면만 이동이 가능하다.
initialRouteName을 통해 첫 화면을 설정 가능하고, 없을 경우 첫번째 Stack.Screen이 첫 화면으로 설정된다.

- navigation 함수
  - navigate("route") : 지정한 화면으로 이동
  - replace("route") : 현재 화면을 지정한 화면으로 대체
  - push("route") : 지정한 화면을 push(추가)
  - pop() : 이전 화면으로 돌아감
  - popToTop() : 맨 처음 화면으로 돌아감

## Data Fetching(axios)

npm을 설치한 후, 기존 사용법대로 사용하면 된다.

- 다만 유의점은 url에 baseUrl(ex. http://0.0.0.0)을 필수로 지정해야 한다.

## 데이터 저장(AsyncStorage)

앱에서 데이터를 저장하기 위해 사용하는 저장소로 이름에서 알 수 있듯이 async/await 함수로 구현해야 한다.
사용방법은 간단하며, key 이름을 지정할 때 @를 앞에 붙여준다.(ex. @auth)

- 설치
<pre><code>npx expo install @react-native-async-storage/async-storage</code></pre>

## useEffect vs useLayoutEffect

- useEffect
  컴포넌트들이 render와 paint 된 후 실행된다.
  비동기적으로 실행되고, 사용자 입장에서 화면의 깜빡임을 보게 된다.
  기본적으로는 항상 useEffect를 사용하는게 권장된다.

* data fetch
* event handler
* state 관리

- useLayoutEffect
  컴포넌트들이 render된 후 실행되며, 그 후에 paint 진행된다.
  동기적으로 실행되고, 사용자 입장에서 화면의 깜빡임을 보지 않는다.
  state의 조건에 따라 첫 painting 이 후에 다시 rendering이 필요할 때 사용한다.

## 소셜 로그인(Google)
