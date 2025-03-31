# find-to-use 🔍

파일 시스템을 검색하여 특정 문자열의 사용 위치를 찾고, 결과를 마크다운 문서로 생성하는 TypeScript 라이브러리입니다.

## ✨ 주요 기능

- 🔍 재귀적 파일 시스템 검색
- 📝 마크다운 형식의 결과 문서 생성
- 🎯 다중 문자열 검색 지원
- 📁 폴더별 결과 그룹화
- ⚡ TypeScript 지원
- 🔄 ES 모듈 & CommonJS 지원

## 📦 설치

```bash
npm install find-to-use
```

## 🚀 사용법

### 기본 사용

```typescript
import { search } from 'find-to-use';

const config = {
  targetStrings: ['검색할 문자열1', '검색할 문자열2'],
  includeExtensions: ['.js', '.ts', '.vue', '.jsx', '.tsx'],
  excludeDirs: ['node_modules', 'dist', 'build'],
  excludeFiles: ['test.ts']
};

search(config, 'search_results.md');
```

### 설정 옵션

```typescript
interface SearchConfig {
  targetStrings: string[];    // 검색할 문자열 목록
  includeExtensions: string[]; // 포함할 파일 확장자 목록
  excludeDirs: string[];     // 제외할 디렉토리 목록
  excludeFiles: string[];    // 제외할 파일 목록
}
```

### 결과 예시

```markdown
## 프로젝트명 검색 결과

### 🔗 https://example.com (3건)

#### 📁 src
##### 1. `App.tsx` (line 42)
경로: `src/App.tsx`
```js
const url = 'https://example.com';
```

##### 2. `utils.ts` (line 15)
경로: `src/utils.ts`
```js
export const API_URL = 'https://example.com/api';
```
```

## 🔧 설정 예시

### Vue.js 프로젝트에서 사용

```typescript
const config = {
  targetStrings: ['https://api.example.com'],
  includeExtensions: ['.vue', '.js', '.ts'],
  excludeDirs: ['node_modules', 'dist', '.git'],
  excludeFiles: ['*.test.*']
};

search(config, 'api-usage.md');
```

### React 프로젝트에서 사용

```typescript
const config = {
  targetStrings: ['process.env.REACT_APP_API_URL'],
  includeExtensions: ['.jsx', '.tsx', '.js', '.ts'],
  excludeDirs: ['node_modules', 'build', 'coverage'],
  excludeFiles: ['*.test.*']
};

search(config, 'env-usage.md');
```

## 📝 라이선스

MIT

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
