# 2023년 2학기 캡스톤디자인 수업

* 프로젝트명 : 명지대 2023년도 2학기 캡스톤디자인 4조 백엔드 서버
* 내용: 워케이션 관광지 추천 플랫폼 백엔드 서버.

--------------

# 🚨중요사항🚨

## 1. 초기 세팅

### 1.1 Git clone

```bash
git clone https://github.com/Arenslien/MJU-CapstoneDesign-Project.git
```

### 1.2 `.env` 파일 생성

`server` 폴더 안에 `.env` 파일 생성 후 아래 코드 작성

```ini
DB_HOST='localhost' # 작업은 각자 local에서 진행
DB_USER='root'
DB_PASSWORD='local 컴퓨터의 mysql의 비밀번호'
DB_DATABASE='workation_db'

DOMAIN='localhost:8080' 
PORT=8080

BASE_URI = '/api/'
```

### 1.3 Version 8 이상 MySQL 설치 및 DB 수동 생성

아래 링크 or 구글링 후 설치 방법 참고

LINK: [MySQL 설치 가이드](https://hongong.hanbit.co.kr/mysql-%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C-%EB%B0%8F-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0mysql-community-8-0/)

MySQL 실행하여 'workation_db' 생성

```mysql
CREATE DATABASE workation_db;
```

### 1.4 npm install & npm start

`client` 경로에서 아래 명령어 실행

```bash
  npm install # 초기 상태 or 사용하는 pacakge가 변경되었을 때 실행
  npm run dev
```

`/server/` 경로에서 아래 명령어 실행

```bash
npm install # 초기 상태 or 사용하는 pacakge가 변경되었을 때 실행
npm start
```

--------------

## 2. git pull & push

### 2.1 개발 전 업데이트된 코드 가져오기

```bash
git checkout <자신이 사용하는 브랜치 명>
git pull origin main
```

### 2.2 추가 or 수정된 코드 원격 저장소에 업데이트

🚨 push 할 때 **무조건** **자신이 사용하는 브랜치 명**으로 하기

```bash
git add *
git commit -m "변경사항과 관련된 메시지"
git push origin <자신이 사용하는 브랜치 명>
```

--------------

## 3. 작업 디렉토리

Frontend 담당 개발 시 `/client/src/component/` 에서 개발 진행
필요시 `/client/src` 경로의 다른 디렉토리 개발 가능

Backend 담당 개발 시 `client/src/router` & `/client/src/service` & `/server/` 에서 개발 진행
필요시 다른 디렉토리에서 개발 가능
