---
title: HTTP란?
date: 2021-10-31
categories: [Network]
tags:
    - http
author: cheshier
---

### 목차

- HTTP란
    - HTTP 1.0 / 1.1
    - HTTP 2
- HTTP Request Protocol
    - HTTP method : GET
    - HTTP method : POST
    - HTTP method : others...
- HTTP Response Protocol

## HTTP란

HTTP는 Hyper Text Transfer Protocol로서, 둘 이상의 웹 통신을 하는 개체들이 MIME Type의 데이터를 주고 받을 때 사용하는 Protocol이다.

> MIME 타입이란 클라이언트에게 전송된 문서의 다양성을 알려주기 위한 메커니즘입니다: 웹에서 파일의 확장자는 별 의미가 없습니다. 그러므로, 각 문서와 함께 올바른 MIME 타입을 전송하도록, 서버가 정확히 설정하는 것이 중요합니다. 브라우저들은 리소스를 내려받았을 때 해야 할 기본 동작이 무엇인지를 결정하기 위해 대게 MIME 타입을 사용합니다.
출처 : [https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/MIME_types](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
> 

![image](/_posts/img/2021-10-31/1_1.png)

### HTTP 1.0 / 1.1

**HTTP 1.0**

"한 개의 연결 → 한 개의 데이터 수신"

초기 웹 통신에는 적절하였으나, Client로 전송하는 데이터의 양이 늘어나면서 네트워크 부하 발생.

![http_1.0.png](/_posts/img/2021-10-31/1_2.png)

**HTTP 1.1 : persistent connection**

keep alive 기능을 도입하여 이미 연결된 TCP 연결을 재사용 → 정적 웹 페이지에서 약 50% 성능 향상

서버가 여러 곳의 Client request를 받는 경우 해당 연결에 모두 keep alive를 적용해야 하는데,

"1 keep alive → 1 process"

프로세스 개수가 늘어나면 서버의 메모리에 부하가 발생.

즉 대형 서비스 운용에 적합하지 못했음.

**HTTP 1.1 : pipelining**

HTTP 1.1에서 a, b, c 순의 request가 server로 들어올 때, 이에 대한 응답도 a, b, c 순이어야 함.

기존에 request b를 보내기 전에 response a가 수신 될 때 까지 기다렸다면,

pipelining에선 a, b, c의 모든 요청을 한 번에 보낸 뒤에 받은 순서에 따라 response를 보내줌.

**HTTP 1.1 : Head of Line Blocking**

순차적 요청에 따른 순차적 응답 방식의 고질적인 문제점. 앞선 요청에 대한 응답이 지연된다면, 대기 중인 요청도 같이 지연되어 Latency 증가함.

**HTTP 1.1 : Repeat of Header**

![image (1).png](/_posts/img/2021-10-31/1_3.png)

연속된 요청의 경우 각기 다른 데이터에 대한 요청임에도 Header 구조의 중복이 생기기 때문에, 전송되는 데이터의 크기에 비해 내포된 정보의 양은 많지 않은 경우 발생. (Resource 낭비)

### HTTP 2

![binary_framing_layer01.svg](/_posts/img/2021-10-31/1_4.svg)

HTTP 요청문 structure 변화

(Header / Data) Frame 계층 사용 → 파싱, 전송 속도 증가, 오류 발생 가능성 줄어듬.

![streams_messages_frames01.svg](/_posts/img/2021-10-31/1_5.svg)

Server ↔ Client 간 Stream 활성 중에 frame들이 전송됨. (순서 사라짐)

![스크린샷 2021-10-07 오후 5.32.42.png](/_posts/img/2021-10-31/1_6.png)

Multiflex(다중화) 실현 → Head of Line Blocking 문제 해결

## HTTP Request Protocol

![스크린샷 2021-10-07 오후 5.38.22.png](/_posts/img/2021-10-31/1_7.png)

요청 프로토콜 구조

![스크린샷 2021-10-07 오후 5.08.06.png](/_posts/img/2021-10-31/1_8.png)

HTTP 요청 프로토콜의 구조는 그림과 같고, 아래 메시지는 실제 네이버 웹사이트에 접속 했을 때 발생하는 요청 프로토콜 중 하나의 내용을 캡쳐한 것이다.

### GET 메소드

GET은 클라이언트가 사용하는 메소드 중 하나로, Server로부터 특정 데이터를 읽어올 때 사용한다.

기본 형식은 다음과 같다

> GET [request-uri]?query_string HTTP/1.1
Host:[Hostname] 혹은 [IP]
> 

### POST 메소드

POST도 GET과 같이 클라이언트가 사용하는 메소드 중 하나로, 보통 Client가 특정 데이터를 Server로 전송할 때 사용한다.

보내는 요청 받은 데이터 정보가 body에 있다.

![스크린샷 2021-10-07 오후 5.39.27.png](/_posts/img/2021-10-31/1_9.png)

## HTTP Response Protocol

![스크린샷 2021-10-07 오후 5.45.11.png](/_posts/img/2021-10-31/1_10.png)

응답 프로토콜의 구조는 그림과 같은데, 주목할 것은 Status Line의 reponse code이다.

![스크린샷 2021-10-07 오후 5.43.24.png](/_posts/img/2021-10-31/1_11.png)