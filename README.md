# SearchBar

### 만든 사람

김보현


### 프로젝트 실행 방법

npm install && npm run dev

### 배포 링크

[배포링크](https://vercel.com/new/wanted-pre-onboarding-1-3/success?developer-id=&external-id=&redirect-url=&branch=main&deploymentUrl=wanted-pre-onboarding-12-3-bohyeon-e0bqu4rrf.vercel.app&projectName=wanted-pre-onboarding-12-3-bohyeon&s=https%3A%2F%2Fgithub.com%2FBHyeonKim%2Fwanted-pre-onboarding-12-3-bohyeon&gitOrgLimit=&hasTrialAvailable=0&totalProjects=1)

---

### 구현사항

#### Cache Storage를 사용한 로컬 캐싱

캐시 스토리지에 캐시를 검색해서 캐시가 있으면 캐시 데이터를 불러오고 없으면 새로운 API 콜을 하도록 설정하였습니다.

```typescript
function* fetchData(action: ReturnType<typeof changeInput>) {
  try {
    const cachedData: SickResponseData | undefined = yield getCache( // 캐시 검색
      `/sick?q=${action.payload}`,
    )
    if (!cachedData) { // 캐시가 없어 새로운 API콜 요청
      const response: AxiosResponse<SickResponseData> = yield sick.getSick(action.payload)
      if (response.config.url) {
        const myResponse = new Response(JSON.stringify(response.data), {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        })
        setCache(response.config.url, myResponse)
      }
      yield put(setSick(response.data))  // 새로운 데이터를 리덕스에 저장
    } else {
      yield put(setSick(cachedData))  // 캐시 데이터를 리덕스에 저장
    }
  } catch (e) {
    console.error(e)
  }
}
```

캐시 저장 함수
```typescript
export const setCache = async (request: RequestInfo | URL, response: Response) => {
  const cache = await caches.open(CACHE_NAME)
  await cache.put(request, response)
}

export const getCache = async (request: RequestInfo | URL) => {
  const cache = await caches.open(CACHE_NAME)
  const response = await cache.match(request)
  return await response?.json()
}
```

#### 디바운싱
디바운싱 훅을 만들어 사용하다가 redux-saga에게 디바운싱을 일임했습니다.
<br/>
<br/>
디바운싱 훅
```
import { useCallback, useRef } from 'react'

const useDebounce = <P extends unknown[], R = unknown>(
  callback: (...args: P) => R,
  time: number,
) => {
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const dispatchDebounce = useCallback(
    (...args: P) => {
      if (timer.current) clearTimeout(timer.current)
      const newTimer = setTimeout(() => callback(...args), time)
      timer.current = newTimer
    },
    [callback, time],
  )

  return dispatchDebounce
}

export default useDebounce

```

<br/>
<br/>

사가

```
function* watchChangeInput() {
  yield debounce(500, changeInput.type, fetchData)
}

export default function* rootSaga() {
  yield all([watchChangeInput()])
}
```

---

### 사용 기술 스택

- bundler: vite
- language: typescript, sass
- library: react, axios, classnames, redux toolkit, redux-saga, html-react-parser


---


### Project Structure
      📦src
       ┣ 📂assets
       ┣ 📂components
       ┣ 📂hooks
       ┣ 📂pages
       ┣ 📂redux
       ┣ 📂services
       ┣ 📂styles
       ┣ 📂types
       ┣ 📂utils
       ┣ 📜App.tsx
       ┣ 📜main.tsx
       ┗ 📜vite-env.d.ts
