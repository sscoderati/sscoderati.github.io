---
title: '구글러의 답변을 받았다. 그리고 V8 기술 블로그의 기여자가 되었다?'
description: 'V8 블로그 글에서 다룬 await bug에 대해 질문하고 답변을 받은 이야기. 그리고 얼떨결에 기여자까지 되어버린 이야기.'
pubDate: '2024-03-07'
heroImage: 'public/blog/hero-image/googler-replied-about-await-bug.png'
category: '프론트엔드'
tags: ['JavaScript', 'V8', 'Node.js', 'deep dive']
---

## 에러(진) -> 에러

2월 중순 쯤에 [V8 기술 블로그의 어떤 글](https://v8.dev/blog/fast-async)에서 오류라고 생각했던 부분에 대해 [이슈](https://github.com/v8/v8.dev/issues/735)를 남겨서 해당 글의 저자 분으로부터 답변을 받고 싶었는데, 답변이 왔다.

그런데 내가 멘션했던 두 저자 분이 아닌, 기술 블로그 저장소의 Maintainer 분이 답변을 주셨다.

![googler_reply_1](https://github.com/sscoderati/sscoderati.github.io/assets/69716992/afd9ae5e-0603-4def-bb65-0f10c17c8fb6)

일단 내가 파고든 부분이 맞다고 해주셔서 기분이 좋았다. V8 팀의 사연은 이랬다. 당시 팀에서 현행 JavaScript 스펙에 따르면 Node.js에서 올바르지 않게 동작하는 부분이 있었고(Node.js 버전 8까지), 그 부분을 Node.js 10버전에서 스펙에 맞게 동작하도록 수정한 것이었다. 그런데 팀에서 동시에 이전 동작이 올바른 동작이 맞다는 생각에 JavaScript 스펙의 변경을 제안했고, 이게 받아들여져 변경된 JavaScript 스펙에 맞춰 다시 Node.js를 버전 8에서 동작한 방식처럼 수정한게 Node.js 버전 12였던 것이다.

나는 아직 JavaScript를 제대로 공부한 지 1년도 안된 초본데 이런 거대한 히스토리를 듣는 것 만으로도 콧김이 뿌슝뿌슝 나왔다. ~~(짜릿해)~~

![googler_profile](https://github.com/sscoderati/sscoderati.github.io/assets/69716992/43064935-6402-4bae-8f51-7e003611ed6a)

답변 주신 분의 프로필을 봤는데 'Google'... ~~(짜릿해)~~ 내가 살면서 구글러랑 주거니 받거니 할 기회가 얼마나 있겠는가. 바로 답글로 감사함을 표시함과 동시에, 답변 마지막 문단에 있던 기여 포인트에 대해 관심을 드러냈다.

![my_reply_1](https://github.com/sscoderati/sscoderati.github.io/assets/69716992/3b9ca17f-5832-45ba-af1c-0d1821ced931)

쨔스!!! 허락 받았다.

## 저, 'Contributor'가 되겠습니다

그래서 고심고심해서 구글러 ~~형~~님의 답변을 아래처럼 요약해봤다.

![pr_1](https://github.com/sscoderati/sscoderati.github.io/assets/69716992/bac81def-af55-47c0-80e3-b3741049db95)

그랬더니 요약본이 뒷 내용을 스포하니까, 그런 내용을 빼고 더 간략하게 줄인 버전을 제안해주셨다. 내가 보기에도 독자 입장에서 더 읽기 편한 내용으로 다가와서 그렇게 바꿨다.

![pr_2](https://github.com/sscoderati/sscoderati.github.io/assets/69716992/6f3d80fa-79b7-4cf7-b1db-d077b5618fc5)

구글러 ~~형~~님도 실수를 하시나보다. 철자가 틀린 부분이 있어서 바꿔달라고 하셨는데, 인간미가 느껴졌다.
동시에 나도 꼼꼼하게 검토하지 못했음을 사과드렸다.

![pr_merged](https://github.com/sscoderati/sscoderati.github.io/assets/69716992/a953321a-500b-43b5-83f8-0a7102e0addc)

![added_note](https://github.com/sscoderati/sscoderati.github.io/assets/69716992/9898a999-0b9d-44c4-9cee-990a48e84b25)

그렇게 나는 얼떨결에 V8 팀 기술 블로그에 짤막한 노트를 남길 수 있었다.

물론 내가 쓴 내용이 온전히 반영되지는 않았지만, 작년 하반기에 JavaScript를 공부하다가 알게된 사실을 같이 공부하던 동료들한테 [발표도 하고](https://youtu.be/uzbwNUMPBNg?si=H-8WLID63vTdydUM), 그 발표 내용 중 하나를 토대로 초거대 기업인 구글의 V8 엔진을 담당하는 팀의 기술 블로그에 흔적을 남기기까지의 이 흥미진진한 스토리 자체가 누구에게라도 당당히 자랑할 수 있는 나 자신의 성취 ~~(평생 술안주)~~ 로 느껴져서 좋았다.
