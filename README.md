# Firebase Auth Test 🔥

Often abbreviated as "fat" or "fat-auth", this is a test project for Firebase Authentication.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- A [Firebase project](https://firebase.google.com/docs/projects/create)

### Setup

1. Add a `.firebaserc` with your [Project ID](https://firebase.google.com/docs/projects/learn-more#project-id) in the root of the project, i.e. with the following content:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

2. Install dependencies

```sh
  pnpm i
```

### Develop

```sh
  pnpm dev
```

> [!NOTE]
> You can also run `pnpm start` to achieve the same result.

### Deploy

```sh
  pnpm deploy
```
